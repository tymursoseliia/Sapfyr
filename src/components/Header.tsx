'use client';

import Link from 'next/link';
import { Send, MessageCircle, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full flex justify-center ${scrolled ? 'bg-background/80 backdrop-blur-lg border-b border-gray-200 py-3 shadow-sm' : 'bg-transparent py-5'}`}>
      <div className="w-full max-w-screen-2xl px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/photo_2026-04-21_12-30-15-removebg-preview.png" alt="Sapfyr" className="h-20 w-auto object-contain rounded-md shadow-sm group-hover:shadow-md transition-shadow" />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex xl:gap-8 gap-5 items-center">
          {[
            { name: 'Главная', href: '/' },
            { name: 'О нас', href: '/about' },
            { name: 'Рассрочка', href: '/installment' },
            { name: 'Команда', href: '/team' },
            { name: 'Отзывы', href: '/reviews' }
          ].map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors relative group py-2"
            >
              {item.name}
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-primary to-blue-400 scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-300 ease-out" />
            </Link>
          ))}
        </nav>

        {/* Contact Buttons */}
        <div className="flex items-center gap-4">
          <a
            href="https://t.me/LTSPRigon"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 border border-transparent flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-primary/50 group"
            title="Наш Telegram канал"
          >
            <Send className="w-4 h-4 text-gray-600 group-hover:text-[#0088cc] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
          </a>
          <a
            href="https://max.ru/u/f9LHodD0cOLd_wpVLKdoX-6cYVQPnzVsKXfd4Yyv1T741m3KQNI63EzYpvY"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 border border-transparent flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-primary/50 group"
            title="Наш MAX мессенджер"
          >
            <MessageSquare className="w-4 h-4 text-gray-600 group-hover:text-[#0088cc] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
          </a>
          <a
            href="tel:+79383591091"
            className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white px-5 py-2.5 rounded-full font-medium shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transform hover:-translate-y-0.5 whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm tracking-wide">+7(938)359-10-91</span>
          </a>
        </div>
      </div>
    </header>
  );
}
