-- Создание таблицы для фото-отзывов
create table if not exists public.photo_reviews (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name varchar(100) not null,
  text text not null,
  rating integer default 5 not null,
  image_url text not null
);

-- Включаем Row Level Security
alter table public.photo_reviews enable row level security;

-- Политики безопасности для таблицы
create policy "Все могут просматривать фото-отзывы" on public.photo_reviews for select using (true);
create policy "Только авторизованные могут добавлять фото-отзывы" on public.photo_reviews for insert with check (auth.role() = 'authenticated');
create policy "Только авторизованные могут обновлять фото-отзывы" on public.photo_reviews for update using (auth.role() = 'authenticated');
create policy "Только авторизованные могут удалять фото-отзывы" on public.photo_reviews for delete using (auth.role() = 'authenticated');

-- Создание хранилища для фото отзывов
insert into storage.buckets (id, name, public)
values ('review-images', 'review-images', true)
on conflict do nothing;

-- Политики для бакета
create policy "Все могут загружать фото отзывов" on storage.objects for insert with check (bucket_id = 'review-images');
create policy "Все могут просматривать фото отзывов" on storage.objects for select using (bucket_id = 'review-images');
create policy "Все могут удалять фото отзывов" on storage.objects for delete using (bucket_id = 'review-images');

-- Перенос старых отзывов в базу данных
insert into public.photo_reviews (name, text, rating, image_url)
values
  ('Павел Д.', 'Все прошло на высшем уровне. Доставили быстро, в идеальном состоянии, документы оформлены без задержек. Приятно, когда люди следуют выполненным срокам!', 5, 'https://i.ibb.co/yB7vDp2c/photo-2026-01-14-12-40-23.jpg'),
  ('Екатерина Л.', 'Приехала на свою новую покупку, как только планировала! Довольна качеством и состоянием, а также отличным сервисом и четкостью на всех этапах.', 5, 'https://i.ibb.co/qMSXBdFL/photo-2026-01-14-12-40-43.jpg'),
  ('Максим Р.', 'Решил купить из Европы и не ошибся. Все расходы и этапы были прозрачны заранее, и доставили вовремя. Очень рад, что выбрал вас!', 5, 'https://i.ibb.co/4GYrgJb/photo-2026-01-14-12-40-55.jpg'),
  ('Виктор С.', 'Очень рекомендую этот способ покупки! Пригнали в отличном виде, документы в порядке. Профессиональная команда!', 5, 'https://i.ibb.co/j9jbH9vJ/photo-2026-01-19-12-55-04.jpg'),
  ('Лариса Д.', 'Автомобиль приехал в отличном состоянии. Как и обещали, проверка была быстрой. Весь процесс прошел гладко!', 5, 'https://i.ibb.co/SDSkFmCB/photo-2026-01-19-13-00-11.jpg'),
  ('Федор П.', 'Спасибо за честность и профессионализм! Соответствует всем заявленным характеристикам. Процесс был прозрачным от начала до конца.', 5, 'https://i.ibb.co/dJfRt4YZ/photo-2026-01-26-17-10-30.jpg'),
  ('Дмитрий В.', 'Очень доволен качеством подбора и скоростью доставки. Цена действительно выгоднее, чем у дилеров.', 5, 'https://i.ibb.co/GLyBZ69/photo-2026-01-26-17-33-52.jpg'),
  ('Сергей М.', 'Отличный сервис! Помогли с выбором, организовали доставку, оформили все документы. Рекомендую всем!', 5, 'https://i.ibb.co/sJssx8HP/photo-2026-01-27-15-36-53.jpg'),
  ('Алексей Т.', 'Пришло в идеальном состоянии! Все как в описании. Спасибо за профессиональную работу и внимание к деталям.', 5, 'https://i.ibb.co/HLsdvDM2/photo-2026-01-30-13-27-51.jpg'),
  ('Игорь П.', 'Весь процесс занял меньше месяца. Отличная поддержка на всех этапах. Полностью соответствует ожиданиям!', 5, 'https://i.ibb.co/TxzYwpTG/photo-2026-01-30-13-27-52.jpg'),
  ('Анна В.', 'Качество подбора на высоте, все документы в порядке. Очень довольна сотрудничеством!', 5, 'https://i.ibb.co/JWkRjMk2/photo-2026-02-05-13-08-15-2.jpg'),
  ('Андрей Л.', 'Профессиональный подход, честные цены, быстрая доставка. Всё на высшем уровне! Буду рекомендовать друзьям.', 5, 'https://i.ibb.co/Q3qS7MMH/photo-2026-02-05-13-08-15.jpg'),
  ('Ельвира К.', 'Получил точно в срок. Вся информация была предоставлена заранее. Никаких скрытых платежей. Отличная работа!', 5, 'https://i.ibb.co/h1wMxhr0/photo-2026-02-12-13-08-08.jpg'),
  ('Владимир Б.', 'Очень доволен покупкой! В отличном состоянии, все документы оформлены правильно. Спасибо за качественную работу!', 5, 'https://i.ibb.co/213tpzZq/photo-2026-02-12-13-08-12.jpg'),
  ('Константин Д.', 'Приятно удивлен качеством сервиса. Весь процесс был прозрачным и понятным. Соответствует всем ожиданиям!', 5, 'https://i.ibb.co/4BKx44M/photo-2026-02-03-13-15-49.jpg'),
  ('Николай П.', 'Превосходный опыт покупки! Команда профессионалов сделала всё быстро и качественно. Теперь у меня!', 5, 'https://i.ibb.co/DDf4dP2V/photo-2026-02-12-13-10-04.jpg');
