import Link from 'next/link';
import { Send, MessageCircle, Clock, MessageSquare, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-gray-200 pt-16 pb-8 relative overflow-hidden mt-auto">
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
      
      <div className="max-w-screen-2xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block group mb-6 hover:opacity-80 transition-opacity">
              <img src="/photo_2026-04-21_12-30-15-removebg-preview.png" alt="Sapfyr" className="h-24 w-auto object-contain rounded-md" />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-sm">
              Мы — ваш надёжный партнёр по покупке и доставке лучших автомобилей из Европы. Премиальный сервис без компромиссов.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://t.me/OOO_Sapphire" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-transparent hover:border-[#0088cc] hover:bg-[#0088cc]/10 hover:text-[#0088cc] text-gray-600 transition-all">
                <Send className="w-4 h-4 ml-0.5" />
              </a>

            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="text-gray-900 font-bold mb-6 tracking-wide text-sm uppercase">Навигация</h4>
            <ul className="space-y-3">
              {[
                { name: 'Главная', href: '/' },
                { name: 'О нас', href: '/about' },
                { name: 'Рассрочка', href: '/installment' },
                { name: 'Команда', href: '/team' },
                { name: 'Отзывы', href: '/reviews' }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-600 hover:text-primary text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-0 overflow-hidden group-hover:w-2 transition-all block h-[1px] bg-primary"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts Column */}
          <div>
            <h4 className="text-gray-900 font-bold mb-6 tracking-wide text-sm uppercase">Контакты</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+74951780520" className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-transparent group-hover:border-primary/50 transition-colors shrink-0">
                    <MessageCircle className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-0.5">Телефон</div>
                    <div className="text-gray-700 group-hover:text-gray-900 text-sm font-medium transition-colors">+7 (495) 178-05-20</div>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:info@support-sapffir.ru" className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-transparent group-hover:border-primary/50 transition-colors shrink-0">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-0.5">Email</div>
                    <div className="text-gray-700 group-hover:text-gray-900 text-sm font-medium transition-colors">info@support-sapffir.ru</div>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-transparent group-hover:border-primary/50 transition-colors shrink-0">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-0.5">Режим работы</div>
                  <div className="text-gray-700 group-hover:text-gray-900 text-sm font-medium transition-colors">
                    Будни: 8:00 - 18:00<br/>
                    Сб: 9:00 - 13:00<br/>
                    Вс: выходной
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Sapfyr. Все права защищены.
        </p>
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 text-sm">
          <Link href="/privacy" className="text-gray-500 hover:text-gray-900 transition-colors">
            Политика конфиденциальности
          </Link>
          <Link href="/terms" className="text-gray-500 hover:text-gray-900 transition-colors">
            Пользовательское соглашение
          </Link>
        </div>
      </div>
    </div>
  </footer>
  );
}
