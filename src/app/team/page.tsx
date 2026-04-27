'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function TeamPage() {
  const teamMembers: { name: string; image: string }[] = [
    { name: 'Андрей Смирнов', image: '/team/andrey_smirnov.jpg' },
    { name: 'Ольга Макарова', image: '/team/olga_makarova.jpg' },
    { name: 'Ковалёва Екатерина', image: '/team/kovaleva_ekaterina.jpg' },
    { name: 'Марьенков Аркадий', image: '/team/maryenkov_arkadiy.jpg' },
    { name: 'Андрей Олейник', image: '/team/andrey_oleynik.jpg' },
    { name: 'Акимов Максим', image: '/team/akimov_maksim.jpg' },
    { name: 'Шечков Андрей', image: '/team/shechkov_andrey.jpg' },
    { name: 'Дмитрий Стебельков', image: '/team/dmitriy_stebelkov.jpg' },
    { name: 'Алексей Карташов', image: '/team/aleksey_kartashov.jpg' },
    { name: 'Глазунов Данил', image: '/team/glazunov_danil.jpg' },
    { name: 'Голубкин Александр', image: '/team/golubkin_aleksandr.jpg' },
    { name: 'Андрей Рублев', image: '/team/andrey_rublev.jpg' },
    { name: 'Юлия Орлова', image: '/team/yuliya_orlova.jpg' },
    { name: 'Юлия Смирнова', image: '/team/yuliya_smirnova.jpg' },
    { name: 'Яна Зайцева', image: '/team/yana_zaytseva.jpg' },
    { name: 'Никита Морозов', image: '/team/nikita_morozov.jpg' },
    { name: 'Романов Руслан', image: '/team/romanov_ruslan.jpg' },
    { name: 'Андрей Мальков', image: '/team/andrey_malkov.jpg' },
    { name: 'Краснова Татьяна', image: '/team/krasnova_tatyana.jpg' },
    { name: 'Гаврилов Денис', image: '/team/gavrilov_denis.jpg' },
    { name: 'Коршунов Антон', image: '/team/korshunov_anton.jpg' },
    { name: 'Горохов Давид', image: '/team/gorokhov_david.jpg' },
    { name: 'Забара Максим Дмитревич', image: '/team/zabara_maksim.jpg' },
    { name: 'Корев Александр Сергеевич', image: '/team/korev_aleksandr.jpg' },
    { name: 'Власова Анастасия Олеговна', image: '/team/vlasova_anastasiya.jpg' }
  ];

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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">КОМАНДА</h1>
            <p className="text-gray-700 max-w-2xl mx-auto text-lg">
              Профессионалы, которые делают покупку авто простой и безопасной.
            </p>
          </div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="py-20 px-8 bg-card border-y border-gray-100 relative flex-grow">
        
        <div className="max-w-screen-2xl mx-auto relative z-10">
          {teamMembers.length > 0 ? (
            <>
              {/* All team members in a 5-column grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex flex-col items-center glass-panel border-gray-200 rounded-3xl p-6 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] group">
                    <div className="w-48 h-48 rounded-full overflow-hidden mb-6 border-4 border-gray-100 group-hover:border-primary/50 transition-colors duration-500 relative">
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      </div>
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 text-center">
                      {member.name}
                    </h3>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-20">
              <h2 className="text-2xl font-medium text-gray-500 tracking-wide">
                Состав команды обновляется...
              </h2>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
