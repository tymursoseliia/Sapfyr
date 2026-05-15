'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase, type VideoReview } from '@/lib/supabase';
import { ContactDialog } from '@/components/ContactDialog';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function ReviewsPage() {
  const [videoReviews, setVideoReviews] = useState<VideoReview[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [photoReviews, setPhotoReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      const { data: videoData, error: videoError } = await supabase
        .from('video_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (videoError) throw videoError;
      setVideoReviews(videoData || []);

      const { data: photoData, error: photoError } = await supabase
        .from('photo_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (photoError) throw photoError;
      setPhotoReviews(photoData || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }

  // Функция для получения embed URL
  const getEmbedUrl = (videoUrl: string, platform: 'rutube' | 'youtube') => {
    if (platform === 'rutube') {
      try {
        const urlObj = new URL(videoUrl);
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        const isPrivate = pathParts.includes('private');
        let videoId = '';
        if (isPrivate) {
            videoId = pathParts[pathParts.indexOf('private') + 1];
        } else {
            videoId = pathParts[pathParts.indexOf('video') + 1];
        }
        if (!videoId) return '';
        
        const pParam = urlObj.searchParams.get('p');
        return pParam ? `https://rutube.ru/play/embed/${videoId}?p=${pParam}` : `https://rutube.ru/play/embed/${videoId}`;
      } catch (e) {
        return '';
      }
    } else {
      // YouTube URL format: https://youtube.com/watch?v=ID
      const videoId = videoUrl.split('v=')[1]?.split('&')[0];
      if (!videoId) {
        return '';
      }
      return `https://www.youtube.com/embed/${videoId}`;
    }
  };

  const initialVideoReviews = [
    { id: 'v1', video_url: 'https://rutube.ru/video/private/45ffb04045fe52abb006abb79a4d8eab/?p=HudelEPjoGBTHcC9Xyd65g', platform: 'rutube', title: 'Видеоотзыв 1' },
    { id: 'v2', video_url: 'https://rutube.ru/video/private/49cb128b777f38e706bb162574976d1e/?p=QZS-1ZCdKHk3W6p1Uwhu-Q', platform: 'rutube', title: 'Видеоотзыв 2' },
    { id: 'v3', video_url: 'https://rutube.ru/video/private/f3e520652d9f0ce6fda5a0d08ef70b9e/?p=l8T1amHPgsFv4pZOV2IePQ', platform: 'rutube', title: 'Видеоотзыв 3' },
    { id: 'v4', video_url: 'https://rutube.ru/video/private/80caa55290c6aa721a03ae5fc2a6a804/?p=-9p_HCV7mXDesh6bapMDSQ', platform: 'rutube', title: 'Видеоотзыв 4' },
    { id: 'v5', video_url: 'https://rutube.ru/video/private/f76b9ad0c0ed93e20d7c029467c91f91/?p=94R5q5T9VzHZQhDO_frLVA', platform: 'rutube', title: 'Видеоотзыв 5' },
    { id: 'v6', video_url: 'https://rutube.ru/video/private/ce7c9067c3a0d486a65e5abecc5c82d8/?p=BFSTHkjDKYjULHmogG80cw', platform: 'rutube', title: 'Видеоотзыв 6' },
    { id: 'v7', video_url: 'https://rutube.ru/video/private/7161795f0a2f7f8a86a8e1b2b201c0e9/?p=APMFrLaSEHmPD0ztckH9rw', platform: 'rutube', title: 'Видеоотзыв 7' },
    { id: 'v8', video_url: 'https://rutube.ru/video/private/c22ff8b57fc07a04388fb7d69c054414/?p=CMm6cOBkLvogivQyh6Dgxw', platform: 'rutube', title: 'Видеоотзыв 8' },
    { id: 'v9', video_url: 'https://rutube.ru/video/private/b5015ad81c26776929ca309a57ab9937/?p=NyffAji0ylH2hhyly3e9Tg', platform: 'rutube', title: 'Видеоотзыв 9' },
    { id: 'v10', video_url: 'https://rutube.ru/video/private/f9143f20ba505f256298ded858627fc3/?p=YStWIGpEbhCDOXFVpBTULg', platform: 'rutube', title: 'Видеоотзыв 10' },
  ];

  const textReviews = [
    {
      name: "Павел Д.",

      text: "Все прошло на высшем уровне. Доставили быстро, авто в идеальном состоянии, документы оформлены без задержек. Приятно, когда люди следуют выполненным сроках!",
      carImage: "https://i.ibb.co/yB7vDp2c/photo-2026-01-14-12-40-23.jpg",
      platform: "2gis",
      rating: 5.0
    },
    {
      name: "Екатерина Л.",

      text: "Получила свою новую машину, как и планировала! Довольна качеством и состоянием авто, а также отличным сервисом и четкостью на всех этапах. Все организовано быстро и удобно.",
      carImage: "https://i.ibb.co/qMSXBdFL/photo-2026-01-14-12-40-43.jpg",
      platform: "2gis",
      rating: 4.9
    },
    {
      name: "Максим Р.",

      text: "Решил купить авто из Европы и не ошибся. Все расходы и этапы были прозрачны, заранее, и автомобиль доставили вовремя. Очень рад, что выбрал вас!",
      carImage: "https://i.ibb.co/4GYrgJb/photo-2026-01-14-12-40-55.jpg",
      platform: "yandex",
      rating: 5.0
    },
    {
      name: "Виктор С.",

      text: "Очень рекомендую этот способ покупки! Автомобиль пригнали в отличном виде, документы в порядке. Профессиональная команда, с которой приятно работать.",
      carImage: "https://i.ibb.co/j9jbH9vJ/photo-2026-01-19-12-55-04.jpg",
      platform: "yandex",
      rating: 5.0
    },
    {
      name: "Лариса Д.",

      text: "Автомобиль приехал в отличном состоянии. Как и обещали, проверка была быстрой. Весь процесс прошел гладко и без каких-либо сюрпризов.",
      carImage: "https://i.ibb.co/SDSkFmCB/photo-2026-01-19-13-00-11.jpg",
      platform: "2gis",
      rating: 5.0
    },
    {
      name: "Федор П.",

      text: "Спасибо за честность и профессионализм! Машина соответствует всем заявленным характеристикам. Процесс был прозрачным от начала до конца.",
      carImage: "https://i.ibb.co/dJfRt4YZ/photo-2026-01-26-17-10-30.jpg",
      platform: "yandex",
      rating: 5.0
    },
    {
      name: "Дмитрий В.",

      text: "Очень доволен качеством подбора и скоростью доставки. Цена действительно выгоднее, чем у дилеров. Получил именно то, что хотел!",
      carImage: "https://i.ibb.co/GLyBZ69/photo-2026-01-26-17-33-52.jpg",
      platform: "2gis",
      rating: 5.0
    },
    {
      name: "Сергей М.",

      text: "Отличный сервис! Помогли с выбором, организовали доставку, оформили все документы. Рекомендую всем, кто хочет купить авто из Европы.",
      carImage: "https://i.ibb.co/sJssx8HP/photo-2026-01-27-15-36-53.jpg",
      platform: "yandex",
      rating: 4.9
    },
    {
      name: "Алексей Т.",

      text: "Машина пришла в идеальном состоянии! Все как в описании. Спасибо за профессиональную работу и внимание к деталям.",
      carImage: "https://i.ibb.co/HLsdvDM2/photo-2026-01-30-13-27-51.jpg",
      platform: "2gis",
      rating: 5.0
    },
    {
      name: "Игорь П.",

      text: "Весь процесс занял меньше месяца. Отличная поддержка на всех этапах. Автомобиль полностью соответствует ожиданиям!",
      carImage: "https://i.ibb.co/TxzYwpTG/photo-2026-01-30-13-27-52.jpg",
      platform: "yandex",
      rating: 5.0
    },
    {
      name: "Анна В.",

      text: "Качество подбора на высоте, все документы в порядке. Очень довольна сотрудничеством! Автомобиль мечты получен.",
      carImage: "https://i.ibb.co/JWkRjMk2/photo-2026-02-05-13-08-15-2.jpg",
      platform: "2gis",
      rating: 5.0
    },
    {
      name: "Андрей Л.",

      text: "Профессиональный подход, честные цены, быстрая доставка. Всё на высшем уровне! Буду рекомендовать друзьям.",
      carImage: "https://i.ibb.co/Q3qS7MMH/photo-2026-02-05-13-08-15.jpg",
      platform: "yandex",
      rating: 4.9
    },
    {
      name: "Ельвира К.",

      text: "Получила автомобиль точно в срок. Вся информация была предоставлена заранее. Никаких скрытых платежей. Отличная работа!",
      carImage: "https://i.ibb.co/h1wMxhr0/photo-2026-02-12-13-08-08.jpg",
      platform: "2gis",
      rating: 5.0
    },
    {
      name: "Владимир Б.",

      text: "Очень доволен покупкой! Автомобиль в отличном состоянии, все документы оформлены правильно. Спасибо за качественную работу!",
      carImage: "https://i.ibb.co/213tpzZq/photo-2026-02-12-13-08-12.jpg",
      platform: "yandex",
      rating: 5.0
    },
    {
      name: "Константин Д.",

      text: "Приятно удивлен качеством сервиса. Весь процесс был прозрачным и понятным. Автомобиль соответствует всем ожиданиям!",
      carImage: "https://i.ibb.co/4BKx44M/photo-2026-02-03-13-15-49.jpg",
      platform: "2gis",
      rating: 5.0
    },
    {
      name: "Николай П.",

      text: "Превосходный опыт покупки! Команда профессионалов сделала всё быстро и качественно. Автомобиль мечты теперь у меня!",
      carImage: "https://i.ibb.co/DDf4dP2V/photo-2026-02-12-13-10-04.jpg",
      platform: "2gis",
      rating: 5.0
    }
  ];

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative bg-background overflow-hidden border-b border-gray-100">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          
          
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" />
        </div>

        <div className="relative z-10 px-8 py-16 pt-32">
          <div className="max-w-screen-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">ОТЗЫВЫ КЛИЕНТОВ</h1>
            <p className="text-gray-700 max-w-2xl mx-auto text-lg">
              Мы гордимся доверием наших клиентов. Узнайте, что говорят о работе с Sapfyr.
            </p>
          </div>
        </div>
      </section>

      {/* Video Reviews Grid */}
      <section className="py-20 px-8 bg-card border-y border-gray-100 relative">
        
        <div className="max-w-screen-2xl mx-auto relative z-10">
          {loading ? (
            <div className="text-center py-20 glass-panel border-gray-200 rounded-2xl">
              <div className="text-xl text-gray-500">Загрузка видео-отзывов...</div>
            </div>
          ) : [...videoReviews, ...initialVideoReviews].length === 0 ? (
            <div className="text-center py-20 glass-panel border-gray-200 border-dashed rounded-2xl">
              <div className="text-6xl mb-6">🎥</div>
              <p className="text-gray-900 text-2xl font-bold mb-4">Пока нет видео-отзывов</p>
              <p className="text-gray-500 text-lg">
                Добавьте первое видео через админ панель
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...videoReviews, ...initialVideoReviews].map((video) => (
                <div
                  key={video.id}
                  className="relative aspect-video bg-white rounded-2xl overflow-hidden glass-panel border-gray-200 group hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
                >
                  <iframe
                    src={getEmbedUrl(video.video_url, video.platform as 'rutube' | 'youtube')}
                    title={video.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Text Reviews Section */}
      <section className="py-20 px-8 bg-background relative">
        
        <div className="max-w-screen-2xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              ТЕКСТОВЫЕ ОТЗЫВЫ КЛИЕНТОВ
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => scroll('left')}
                className="w-14 h-14 bg-gray-100 border border-gray-200 hover:bg-primary hover:border-primary text-gray-900 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
              >
                ←
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-14 h-14 bg-gray-100 border border-gray-200 hover:bg-primary hover:border-primary text-gray-900 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
              >
                →
              </button>
            </div>
          </div>

            <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-8 px-4 -mx-4 items-stretch"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[...photoReviews.map(r => ({ name: r.name, text: r.text, carImage: r.image_url, platform: 'yandex', rating: r.rating })), ...textReviews].map((review, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-80 lg:w-96 glass-panel border-gray-200 rounded-2xl flex flex-col hover:border-primary/30 transition-colors duration-300 p-6 shadow-xl"
              >
                {/* Header with name */}
                <div className="mb-4">
                  <h4 className="font-bold text-lg text-gray-900">{review.name}</h4>
                </div>

                {/* Review text */}
                <div className="mb-6 flex-grow">
                  <p className="text-sm text-gray-600 leading-relaxed italic border-l-2 border-primary/50 pl-4">
                    "{review.text}"
                  </p>
                </div>

                {/* Car image */}
                <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={review.carImage}
                    alt={`${review.name}'s car`}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Footer with platform and rating */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
                  <div className="flex items-center gap-3">
                    {review.platform === '2gis' ? (
                      <div className="bg-[#A4C400]/20 text-[#A4C400] border border-[#A4C400]/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        2ГИС
                      </div>
                    ) : (
                      <div className="bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Яндекс
                      </div>
                    )}
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < Math.floor(review.rating) ? 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]' : 'text-gray-300'}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 drop-shadow-md">
                    {review.rating.toFixed(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Contact Dialog */}
      <ContactDialog open={contactDialogOpen} onOpenChange={setContactDialogOpen} />
    </div>
  );
}
