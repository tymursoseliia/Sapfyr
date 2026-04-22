import { supabase } from '../src/lib/supabase';

// URL канала для веба
const CHANNEL_URL = 'https://t.me/s/Euro_avto_tut';

async function fetchTelegramChannel() {
  console.log(`Загружаем данные из ${CHANNEL_URL}...`);
  const response = await fetch(CHANNEL_URL);
  if (!response.ok) {
    throw new Error(`Ошибка загрузки: ${response.statusText}`);
  }
  const html = await response.text();
  return html;
}

function parseCars(html: string) {
  const cars = [];
  
  // Регулярные выражения для поиска сообщений
  // Ищем блоки tgme_widget_message_text
  const messageRegex = /<div class="tgme_widget_message_text[^>]*>(.*?)<\/div>/gs;
  const urlRegex = /<a class="tgme_widget_message_date" href="(https:\/\/t\.me\/Euro_avto_tut\/(\d+))"/g;
  
  // К сожалению, регулярками парсить HTML сложно, используем более простой подход:
  // Разбиваем HTML на куски по <div class="tgme_widget_message "
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
    
    // Убираем HTML теги и <br>
    let rawText = textMatch[1].replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim();
    
    // Проверка, что это объявление о машине, а не отзыв
    // Отзывы обычно содержат слова "отзыв", "клиент" и не содержат "Год:" или "Коробка:"
    if (rawText.toLowerCase().includes('отзыв') && !rawText.toLowerCase().includes('год')) {
        continue;
    }
    
    // Парсим поля
    const yearMatch = rawText.match(/(?:Год|Рік)[\s:-]*(\d{4})/i);
    const priceMatch = rawText.match(/(?:Цена|Ціна)[\s:-]*([\d\s,.]+)[$€]/i);
    const mileageMatch = rawText.match(/(?:Пробег|Пробіг)[\s:-]*([\d\s]+)(?:км|тыс)/i);
    const fuelMatch = rawText.match(/(?:Топливо|Паливо)[\s:-]*([^\n]+)/i);
    const boxMatch = rawText.match(/(?:Коробка|Трансмиссия|Кпп)[\s:-]*([^\n]+)/i);
    
    // Первую строку обычно используют для марки и модели
    const firstLine = rawText.split('\n')[0].replace(/[🚗🚘]/g, '').trim();
    const brandModel = firstLine.length < 50 ? firstLine : 'Неизвестно';
    
    // Разделяем бренд и модель (просто первое слово как бренд)
    const brandParts = brandModel.split(' ');
    const brand = brandParts[0] || 'Unknown';
    const model = brandParts.slice(1).join(' ') || brandModel;
    
    // Изображения: ищем background-image:url('...') в фото-обертках
    const images = [];
    const bgMatches = block.matchAll(/background-image:url\('([^']+)'\)/g);
    for (const match of bgMatches) {
        images.push(match[1]);
    }

    // Если нет цены или года, скорее всего это не машина
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

async function run() {
    try {
        const html = await fetchTelegramChannel();
        const cars = parseCars(html);
        console.log(`Найдено ${cars.length} машин в канале.`);
        
        for (const car of cars) {
            console.log(`\nОбнаружена машина: ${car.brand} ${car.model} (${car.year})`);
            console.log(`Цена: ${car.price}, Пробег: ${car.mileage}`);
            console.log(`Ссылка: ${car.telegram_url}`);
            
            // Проверяем, есть ли уже такая машина в БД
            const { data: existing } = await supabase
                .from('cars')
                .select('id')
                .eq('telegram_id', car.telegram_id)
                .single();
                
            if (existing) {
                console.log(`Машина ${car.telegram_id} уже есть в базе.`);
                continue;
            }
            
            console.log(`Добавляем новую машину...`);
            /* Раскомментируйте этот блок после добавления колонки telegram_id в Supabase
            const { error } = await supabase.from('cars').insert(car);
            if (error) {
                console.error('Ошибка добавления:', error);
            } else {
                console.log('Успешно добавлено!');
            }
            */
        }
    } catch (e) {
        console.error('Ошибка работы парсера:', e);
    }
}

// Если запускаем файл напрямую (например, через tsx или bun)
if (require.main === module) {
    run();
}

export { fetchTelegramChannel, parseCars };
