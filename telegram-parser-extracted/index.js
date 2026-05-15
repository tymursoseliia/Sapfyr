import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // Requires node 18+ native fetch, but we can use native fetch

dotenv.config();

const app = express();
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'placeholder'; 
const supabase = createClient(supabaseUrl, supabaseKey);

const TELEGRAM_BOT_TOKEN = process.env.PARSER_BOT_TOKEN || '';

app.get('/api/tg-parser', async (req, res) => {
  // Роут для быстрой установки вебхука Telegram
  if (req.query.setup === 'true') {
    if (!TELEGRAM_BOT_TOKEN) {
      return res.status(400).json({ error: 'Отсутствует переменная PARSER_BOT_TOKEN' });
    }
    
    const host = req.get('host');
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const webhookUrl = `${protocol}://${host}/api/tg-parser`;
    
    try {
      const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=${webhookUrl}`);
      const data = await tgRes.json();
      
      return res.json({ 
        success: true, 
        message: 'Вебхук успешно установлен!', 
        webhookUrl, 
        telegramResponse: data 
      });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to set webhook', details: e.message });
    }
  }
  
  return res.json({ status: 'PARSER API is active. Use ?setup=true to register webhook.' });
});

app.post('/api/tg-parser', async (req, res) => {
  try {
    const update = req.body;
    
    // Сообщение может прийти как message (от пользователя) или channel_post (из канала)
    const msg = update.channel_post || update.message;
    if (!msg) {
      return res.json({ status: 'ignored', reason: 'Not a message or post' });
    }

    // Текст может быть в text или в caption (если есть картинка)
    const text = msg.caption || msg.text || '';
    
    // Простейшая проверка, что это нужный шаблон
    if (!text.includes('Год выпуска:')) {
      return res.json({ status: 'ignored', reason: 'Does not match template (No year)' });
    }

    if (!TELEGRAM_BOT_TOKEN) {
      console.error('Missing PARSER_BOT_TOKEN');
      return res.status(500).json({ error: 'System is missing Telegram Bot Token' });
    }

    // --- 1. ПАРСИНГ ХАРАКТЕРИСТИК (REGEX) ---
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const titleLine = lines[0] || 'Unknown Car';
    const brand = titleLine.split(' ')[0] || 'Unknown';
    const model = titleLine.split(' ').slice(1).join(' ') || '';

    const yearMatch = text.match(/Год выпуска:\s*(\d+)/i);
    const mileageMatch = text.match(/Пробег:\s*([\d\s]+)\s*км/i);
    const fuelMatch = text.match(/Топливо:\s*(.+)/i);
    const transmissionMatch = text.match(/КПП:\s*(.+)/i);
    const driveMatch = text.match(/Привод:\s*(.+)/i);
    const priceMatch = text.match(/ЦЕНА ПОД КЛЮЧ:\s*([\d\s]+)\s*₽?/i);
    const colorMatch = text.match(/Цвет:\s*(.+)/i);
    const engineMatch = text.match(/Двигатель:\s*(.+)/i);

    const year = yearMatch ? parseInt(yearMatch[1], 10) : 2020;
    const mileage = mileageMatch ? parseInt(mileageMatch[1].replace(/\s/g, ''), 10) : 0;
    const price = priceMatch ? parseInt(priceMatch[1].replace(/\s/g, ''), 10) : 0;
    const color = colorMatch ? colorMatch[1].trim() : '';
    const engine = engineMatch ? engineMatch[1].trim() : '';

    const transmissionLabel = transmissionMatch ? transmissionMatch[1].trim().toLowerCase() : 'автомат';
    let transmission = 'автомат';
    if (transmissionLabel.includes('механ')) transmission = 'механика';
    if (transmissionLabel.includes('робот')) transmission = 'робот';
    if (transmissionLabel.includes('вариат')) transmission = 'вариатор';

    const driveLabel = driveMatch ? driveMatch[1].trim().toLowerCase() : 'fwd';
    let body_type = 'fwd'; 
    if (driveLabel.includes('задн')) body_type = 'rwd';
    if (driveLabel.includes('полн')) body_type = 'awd';

    const fuel_type = fuelMatch ? fuelMatch[1].trim().toLowerCase() : 'бензин';

    // --- 2. СКАЧИВАНИЕ И ЗАГРУЗКА ФОТО ---
    let finalImageUrl = '';
    if (msg.photo && msg.photo.length > 0) {
      const bestPhoto = msg.photo[msg.photo.length - 1]; 
      const fileId = bestPhoto.file_id;
      
      const fileRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`);
      const fileData = await fileRes.json();
      
      if (fileData.ok && fileData.result.file_path) {
         const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${fileData.result.file_path}`;
         
         const imageRes = await fetch(fileUrl);
         const arrayBuffer = await imageRes.arrayBuffer();
         const buffer = Buffer.from(arrayBuffer);
         
         const fileName = `tg_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
         
         const { data: uploadData, error: uploadError } = await supabase.storage
           .from('zvuk-cars')
           .upload(fileName, buffer, { contentType: 'image/jpeg' });
           
         if (uploadData) {
            const { data: publicUrlData } = supabase.storage.from('zvuk-cars').getPublicUrl(fileName);
            finalImageUrl = publicUrlData.publicUrl;
         } else {
            console.error('Supabase Upload error:', uploadError);
         }
      }
    }
    
    // --- 3. ЗАПИСЬВ В БАЗУ ДАННЫХ SUPABASE ---
    const slug = `${brand}-${model}-${year}-${Math.floor(Math.random() * 1000)}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    let short_desc = '';
    if (engine) short_desc += `Двигатель: ${engine}. `;
    if (color) short_desc += `Цвет: ${color}.`;

    const { data: insertData, error: insertError } = await supabase.from('cars').insert([{
      slug,
      status: 'available',
      brand,
      model,
      year,
      price,
      mileage,
      fuel_type,
      transmission,
      body_type,
      short_description: short_desc.trim(),
      full_description: text,
      main_image: finalImageUrl || null,
      images: finalImageUrl ? [finalImageUrl] : [],
      location_country: 'Россия',
      location_city: 'Уточняйте'
    }]);

    if (insertError) {
      console.error('Supabase DB error:', insertError);
      return res.status(500).json({ error: 'DB Insert Failed', details: insertError });
    }

    return res.json({ success: true, slug, textConfig: { brand, model, year, price, mileage }});
  } catch (error) {
    console.error('TG Parser Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Telegram parser server is running on port ${PORT}`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/api/tg-parser`);
});
