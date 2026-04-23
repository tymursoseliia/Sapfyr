import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Сюда Telegram будет присылать обновления в реальном времени
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Проверяем, что это сообщение из канала
    const channelPost = body.channel_post;
    if (!channelPost) {
      return NextResponse.json({ status: 'ignored', reason: 'not a channel post' });
    }

    // Проверяем, из нужного ли канала пришло сообщение
    // (опционально: можно проверять ID канала, если вы знаете его ID)
    const chatUsername = channelPost.chat?.username; // 'Euro_avto_tut'
    if (chatUsername && chatUsername !== 'Euro_avto_tut') {
       return NextResponse.json({ status: 'ignored', reason: 'wrong channel' });
    }

    const messageId = channelPost.message_id.toString();
    const text = channelPost.text || channelPost.caption || '';
    
    if (!text) {
      return NextResponse.json({ status: 'ignored', reason: 'no text' });
    }

    // Пропускаем отзывы (содержит "отзыв", но не содержит "год")
    if (text.toLowerCase().includes('отзыв') && !text.toLowerCase().includes('год')) {
      return NextResponse.json({ status: 'ignored', reason: 'is review' });
    }

    // Парсим текст
    const yearMatch = text.match(/(?:Год|Рік)[\s:-]*(\d{4})/i);
    const priceMatch = text.match(/(?:Цена|Ціна)[\s:-]*([\d\s,.]+)[$€]/i);
    const mileageMatch = text.match(/(?:Пробег|Пробіг)[\s:-]*([\d\s]+)(?:км|тыс)/i);
    const fuelMatch = text.match(/(?:Топливо|Паливо)[\s:-]*([^\n]+)/i);
    const boxMatch = text.match(/(?:Коробка|Трансмиссия|Кпп)[\s:-]*([^\n]+)/i);

    // Если нет года или цены, это не объявление о машине
    if (!yearMatch || !priceMatch) {
      return NextResponse.json({ status: 'ignored', reason: 'no year or price' });
    }

    const firstLine = text.split('\n')[0].replace(/[🚗🚘]/g, '').trim();
    const brandModel = firstLine.length < 50 ? firstLine : 'Неизвестно';
    const brandParts = brandModel.split(' ');
    const brand = brandParts[0] || 'Unknown';
    const model = brandParts.slice(1).join(' ') || brandModel;

    const priceRaw = priceMatch[1].replace(/\s/g, '').replace(',', '.');
    const mileageRaw = mileageMatch ? mileageMatch[1].replace(/\s/g, '') : '0';

    const images = [];
    if (channelPost.photo && channelPost.photo.length > 0) {
      // Берем самое большое фото (последнее в массиве)
      const fileId = channelPost.photo[channelPost.photo.length - 1].file_id;
      
      const botToken = process.env.TELEGRAM_PARSER_BOT_TOKEN;
      if (botToken) {
        // Получаем путь к файлу
        try {
          const fileRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
          const fileData = await fileRes.json();
          if (fileData.ok && fileData.result.file_path) {
             const imageUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
             images.push(imageUrl);
          }
        } catch (e) {
          console.error('Ошибка получения фото:', e);
        }
      }
    }

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
    const { data: existing } = await supabase
      .from('cars')
      .select('id')
      .eq('telegram_id', messageId)
      .single();

    if (!existing) {
      // Добавляем
      const { error } = await supabase.from('cars').insert(carData);
      if (error) {
        console.error('Webhook insert error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: 'Car added from webhook' });
  } catch (error: unknown) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
