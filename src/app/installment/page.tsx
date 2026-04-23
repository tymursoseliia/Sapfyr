'use client';

import { Calculator, CheckCircle2, Clock, CreditCard, FileText, Send } from 'lucide-react';
import Link from 'next/link';

export default function InstallmentPage() {
  const benefits = [
    {
      icon: <CreditCard className="w-8 h-8 text-[#0088cc]" />,
      title: 'Работаем без взноса',
      description: 'Возможно оформление рассрочки без первоначального взноса.'
    },
    {
      icon: <Clock className="w-8 h-8 text-[#0088cc]" />,
      title: 'Срок до 3 лет',
      description: 'Удобные сроки погашения от 6 до 36 месяцев на ваш выбор.'
    },
    {
      icon: <FileText className="w-8 h-8 text-[#0088cc]" />,
      title: 'По 2 документам',
      description: 'Для оформления нужен только паспорт и водительское удостоверение.'
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-[#0088cc]" />,
      title: 'Без справок',
      description: 'Не требуем 2-НДФЛ и подтверждения официального дохода.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Оставляете заявку',
      description: 'Свяжитесь с нами через мессенджеры для предварительной консультации.'
    },
    {
      number: '02',
      title: 'Подбор условий',
      description: 'Наш менеджер подберет оптимальную программу кредитования или рассрочки от банков-партнеров.'
    },
    {
      number: '03',
      title: 'Одобрение за 1 час',
      description: 'Отправляем заявку сразу в несколько банков для получения лучшего процента.'
    },
    {
      number: '04',
      title: 'Покупка авто',
      description: 'После одобрения мы заключаем договор и начинаем процесс доставки вашего автомобиля.'
    }
  ];

  return (
    <main className="flex-1 w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full pt-32 pb-20 px-6 relative overflow-hidden bg-card">
        
        <div className="w-full max-w-screen-xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
            <Calculator className="w-4 h-4" />
            Выгодные условия
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            Автомобиль из Европы <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">в рассрочку</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
            Осуществите мечту об идеальном автомобиле уже сегодня! Прозрачные условия, 
            одобрение за 1 час и ставка, которая вас приятно удивит.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://t.me/OOO_Sapphire"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-primary hover:bg-primary/90 text-gray-900 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] w-full sm:w-auto"
            >
              <Send className="w-5 h-5" />
              Рассчитать рассрочку
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-20 px-6 bg-background relative border-y border-gray-100">
        <div className="w-full max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Наши преимущества</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Сотрудничаем с ведущими банками для предоставления лучших условий финансирования.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-card border border-gray-200 rounded-2xl p-8 hover:bg-gray-100 transition-colors relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  {benefit.icon}
                </div>
                <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 border border-primary/20">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full py-24 px-6 bg-card relative">
        <div className="w-full max-w-screen-xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/3">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Как оформить<br />рассрочку?</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Процесс оформления максимально упрощен и не требует вашего присутствия в банке. 
                Мы берем всю бюрократию на себя, чтобы вы могли просто выбрать автомобиль.
              </p>
              <a 
                href="https://t.me/OOO_Sapphire"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-300 rounded-xl font-semibold inline-flex items-center gap-2 transition-all"
              >
                Связаться с менеджером
              </a>
            </div>
            
            <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {steps.map((step, index) => (
                <div key={index} className="bg-background border border-gray-100 rounded-2xl p-8 relative">
                  <span className="absolute -top-4 -right-4 text-7xl font-black text-gray-100 z-0">
                    {step.number}
                  </span>
                  <div className="relative z-10">
                    <div className="text-primary font-black text-xl mb-2">{step.number}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-24 px-6 bg-gradient-to-br from-primary/20 via-background to-background relative border-t border-gray-200">
        <div className="w-full max-w-4xl mx-auto text-center bg-card border border-gray-200 rounded-3xl p-10 md:p-16 shadow-2xl relative overflow-hidden">
          
          
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 relative z-10">Остались вопросы?</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto relative z-10">
            Напишите нам, и мы бесплатно рассчитаем ежемесячный платеж для интересующего вас автомобиля.
          </p>
          <div className="flex justify-center gap-4 relative z-10">
            <a 
              href="https://t.me/OOO_Sapphire"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#0088cc] hover:bg-[#0088cc]/90 text-gray-900 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,136,204,0.3)] hover:scale-105"
            >
              <Send className="w-5 h-5" />
              Написать в Telegram
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
