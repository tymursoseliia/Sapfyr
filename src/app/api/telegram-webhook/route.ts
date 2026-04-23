import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Автоматическая установка вебхука
export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get('setup') === 'true') {
    const botToken = process.env.TELEGRAM_PARSER_BOT_TOKEN;
    if (!botToken) {
      return NextResponse.json({ error: 'Missing TELEGRAM_PARSER_BOT_TOKEN' }, { status: 400 });
    }
    
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'sapffir.ru';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const webhookUrl = `${protocol}://${host}/api/telegram-webhook`;
    
    try {
      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook?url=${webhookUrl}`);
      const data = await tgRes.json();
      return NextResponse.json({ 
        success: true, 
        message: 'Вебхук успешно установлен!', 
        webhookUrl, 
        telegramResponse: data 
      });
    } catch (e: unknown) {
      return NextResponse.json({ error: 'Failed to set webhook', details: e instanceof Error ? e.message : String(e) }, { status: 500 });
    }
  }
  return NextResponse.json({ status: 'Webhook API is active. Use ?setup=true to register.' });
}

// Функция для отправки отладочных сообщений админу
async function sendDebugToAdmin(message: string) {
  const botToken = process.env.TELEGRAM_PARSER_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: `🔧 [Вебхук Дебаг]\n${message}` })
    });
  } catch (e) {
    console.error('Failed to send debug message', e);
  }
}

// Сюда Telegram будет присылать обновления в реальном времени
export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    const body = await request.json();
    
    // Проверяем, что это сообщение из канала (или отредактированное)
    const channelPost = body.channel_post || body.edited_channel_post;
    if (!channelPost) {
      return NextResponse.json({ status: 'ignored', reason: 'not a channel post' });
    }

    // Проверяем, из нужного ли канала пришло сообщение
    const chatUsername = channelPost.chat?.username; // 'Euro_avto_tut'
    if (chatUsername && chatUsername.toLowerCase() !== 'euro_avto_tut') {
       return NextResponse.json({ status: 'ignored', reason: 'wrong channel' });
    }

    const messageId = channelPost.message_id.toString();
    const text = channelPost.text || channelPost.caption || '';
    
    if (!text) {
      return NextResponse.json({ status: 'ignored', reason: 'no text' });
    }

    // Пропускаем отзывы
    if (text.toLowerCase().includes('отзыв') && !text.toLowerCase().includes('год')) {
      return NextResponse.json({ status: 'ignored', reason: 'is review' });
    }

    // Парсим текст (более гибкие регулярки)
    const yearMatch = text.match(/(?:Год|Рік)[^\d]*(\d{4})/i);
    const priceMatch = text.match(/(?:Цена|Ціна|Price)[^\d]*([\d\s,.]+)[$€₽]/i) || text.match(/(?:Цена|Ціна|Price)[^\d]*([\d\s,.]+)\s*(?:usd|евро|euro|руб|rub)/i);
    const mileageMatch = text.match(/(?:Пробег|Пробіг)[^\d]*([\d\s]+)(?:км|тыс|km)/i);
    const fuelMatch = text.match(/(?:Топливо|Паливо)[\s:-]*([^\n]+)/i);
    const boxMatch = text.match(/(?:Коробка|Трансмиссия|Кпп)[\s:-]*([^\n]+)/i);

    // Если нет года или цены, это не объявление о машине
    if (!yearMatch || !priceMatch) {
      await sendDebugToAdmin(`Пропущен пост (нет года или цены).\n\nНашел год: ${yearMatch ? 'ДА' : 'НЕТ'}\nНашел цену: ${priceMatch ? 'ДА' : 'НЕТ'}\n\nТекст:\n${text}`);
      return NextResponse.json({ status: 'ignored', reason: 'no year or price', debug_text: text });
    }

    const firstLine = text.split('\n')[0].replace(/[🚗🚘]/g, '').trim();
    const brandModel = firstLine.length < 50 ? firstLine : 'Неизвестно';
    const brandParts = brandModel.split(' ');
    const brand = brandParts[0] || 'Unknown';
    const model = brandParts.slice(1).join(' ') || brandModel;

    const priceRaw = priceMatch[1].replace(/\s/g, '').replace(',', '.');
    const mileageRaw = mileageMatch ? mileageMatch[1].replace(/\s/g, '') : '0';

    let finalImageUrl = '';
    const botToken = process.env.TELEGRAM_PARSER_BOT_TOKEN;

    if (channelPost.photo && channelPost.photo.length > 0 && botToken) {
      // Берем самое большое фото (последнее в массиве)
      const fileId = channelPost.photo[channelPost.photo.length - 1].file_id;
      
      try {
        const fileRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
        const fileData = await fileRes.json();
        
        if (fileData.ok && fileData.result.file_path) {
           const fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
           
           // Скачиваем фото в память
           const imageRes = await fetch(fileUrl);
           const arrayBuffer = await imageRes.arrayBuffer();
           const fileBuffer = Buffer.from(arrayBuffer);
           
           // Генерируем уникальное имя файла
           const fileName = `tg_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
           
           // Загружаем в бакет car-images
           const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
             .from('car-images')
             .upload(fileName, fileBuffer, { 
                contentType: 'image/jpeg',
                upsert: false
             });
             
           if (uploadData) {
              const { data: publicUrlData } = supabaseAdmin.storage
                .from('car-images')
                .getPublicUrl(fileName);
              
              finalImageUrl = publicUrlData.publicUrl;
              await sendDebugToAdmin(`Успешно загружено фото в Supabase: ${finalImageUrl}`);
           } else {
              console.error('Ошибка загрузки фото в Supabase Storage:', uploadError);
              await sendDebugToAdmin(`Ошибка загрузки фото в Supabase Storage:\n${JSON.stringify(uploadError)}`);
           }
        } else {
           await sendDebugToAdmin(`Ошибка получения файла от Telegram:\n${JSON.stringify(fileData)}`);
        }
      } catch (e: unknown) {
        console.error('Ошибка получения/скачивания фото:', e);
        await sendDebugToAdmin(`Ошибка скачивания фото (catch):\n${e instanceof Error ? e.message : String(e)}`);
      }
    } else if (!botToken) {
       await sendDebugToAdmin(`Ошибка: TELEGRAM_PARSER_BOT_TOKEN не задан!`);
    } else {
       await sendDebugToAdmin(`Предупреждение: В посте нет фотографий.`);
    }
    
    const images = finalImageUrl ? [finalImageUrl] : [];

    const telegramUrl = `https://t.me/Euro_avto_tut/${messageId}`;

    const carData = {
      telegram_id: messageId,
      telegram_url: telegramUrl,
      brand,
      model,
      year: parseInt(yearMatch[1], 10),
      price: parseFloat(priceRaw),
      mileage: parseInt(mileageRaw, 10),
      fuel_type: fuelMatch ? fuelMatch[1].trim() : 'Не указано',
      transmission: boxMatch ? boxMatch[1].trim() : 'Не указано',
      description: text,
      images: images, // Используем массив фото, который спарсили выше
      status: 'available',
      location: 'Европа',
    };

    // Проверяем, нет ли уже машины в базе
    const { data: existing } = await supabaseAdmin
      .from('cars')
      .select('id')
      .eq('telegram_id', messageId)
      .single();

    if (!existing) {
      // Добавляем
      const { error } = await supabaseAdmin.from('cars').insert(carData);
      if (error) {
        console.error('Webhook insert error:', error);
        await sendDebugToAdmin(`Ошибка добавления машины в базу данных cars:\n${JSON.stringify(error)}`);
        return NextResponse.json({ error: error.message }, { status: 500 });
      } else {
        await sendDebugToAdmin(`✅ Машина успешно добавлена в базу!\nБренд: ${brand}\nМодель: ${model}\nЦена: ${priceRaw}`);
      }
    } else {
       await sendDebugToAdmin(`⚠️ Машина с telegram_id ${messageId} уже существует в базе, пропускаем.`);
    }

    return NextResponse.json({ success: true, message: 'Car added from webhook' });
  } catch (error: unknown) {
    console.error('Webhook error:', error);
    await sendDebugToAdmin(`Критическая ошибка вебхука (catch):\n${error instanceof Error ? error.message : String(error)}`);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
