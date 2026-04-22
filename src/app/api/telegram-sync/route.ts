import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const CHANNEL_URL = 'https://t.me/s/Euro_avto_tut';

async function fetchTelegramChannel() {
  const response = await fetch(CHANNEL_URL, { next: { revalidate: 0 } });
  if (!response.ok) {
    throw new Error(`Ошибка загрузки: ${response.statusText}`);
  }
  return await response.text();
}

function parseCars(html: string) {
  const cars = [];
  const blocks = html.split('<div class="tgme_widget_message ');
  
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    
    // Получаем ID поста
    const idMatch = block.match(/data-post="Euro_avto_tut\/(\d+)"/);
    if (!idMatch) continue;
    const telegramId = idMatch[1];
    const telegramUrl = `https://t.me/Euro_avto_tut/${telegramId}`;

    // Получаем текст
    const textMatch = block.match(/<div class="tgme_widget_message_text[^>]*>(.*?)<\/div>/s);
    if (!textMatch) continue;
    
    // Убираем HTML теги
    const rawText = textMatch[1].replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim();
    
    // Пропускаем отзывы
    if (rawText.toLowerCase().includes('отзыв') && !rawText.toLowerCase().includes('год')) {
        continue;
    }
    
    // Парсим поля
    const yearMatch = rawText.match(/(?:Год|Рік)[\s:-]*(\d{4})/i);
    const priceMatch = rawText.match(/(?:Цена|Ціна)[\s:-]*([\d\s,.]+)[$€]/i);
    const mileageMatch = rawText.match(/(?:Пробег|Пробіг)[\s:-]*([\d\s]+)(?:км|тыс)/i);
    const fuelMatch = rawText.match(/(?:Топливо|Паливо)[\s:-]*([^\n]+)/i);
    const boxMatch = rawText.match(/(?:Коробка|Трансмиссия|Кпп)[\s:-]*([^\n]+)/i);
    
    const firstLine = rawText.split('\n')[0].replace(/[🚗🚘]/g, '').trim();
    const brandModel = firstLine.length < 50 ? firstLine : 'Неизвестно';
    
    const brandParts = brandModel.split(' ');
    const brand = brandParts[0] || 'Unknown';
    const model = brandParts.slice(1).join(' ') || brandModel;
    
    const images = [];
    const bgMatches = block.matchAll(/background-image:url\('([^']+)'\)/g);
    for (const match of bgMatches) {
        images.push(match[1]);
    }

    if (!yearMatch || !priceMatch) {
        continue;
    }

    const priceRaw = priceMatch[1].replace(/\s/g, '').replace(',', '.');
    const mileageRaw = mileageMatch ? mileageMatch[1].replace(/\s/g, '') : '0';

    cars.push({
        telegram_id: telegramId,
        telegram_url: telegramUrl,
        brand: brand,
        model: model,
        year: parseInt(yearMatch[1], 10),
        price: parseFloat(priceRaw),
        mileage: parseInt(mileageRaw, 10),
        fuel_type: fuelMatch ? fuelMatch[1].trim() : 'Не указано',
        transmission: boxMatch ? boxMatch[1].trim() : 'Не указано',
        description: rawText,
        images: images,
        status: 'available',
        location: 'Европа',
    });
  }
  return cars;
}

// Защита роута с помощью секретного ключа (чтобы кто угодно не мог запустить парсинг)
// Добавьте CRON_SECRET в .env.local
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const url = new URL(request.url);
    const secret = url.searchParams.get('secret') || authHeader?.replace('Bearer ', '');

    // Если секрет задан в окружении, проверяем его
    if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const html = await fetchTelegramChannel();
    const cars = parseCars(html);
    
    let addedCount = 0;

    for (const car of cars) {
      // Проверяем, есть ли уже такая машина
      const { data: existing } = await supabase
        .from('cars')
        .select('id')
        .eq('telegram_id', car.telegram_id)
        .single();
        
      if (!existing) {
        // Добавляем новую
        const { error } = await supabase.from('cars').insert(car);
        if (error) {
          console.error('Ошибка добавления машины из Telegram:', error);
        } else {
          addedCount++;
        }
      }
    }

    return NextResponse.json({ 
        success: true, 
        message: `Парсинг завершен. Найдено машин: ${cars.length}, добавлено новых: ${addedCount}` 
    });

  } catch (error: unknown) {
    console.error('Ошибка синхронизации Telegram:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
