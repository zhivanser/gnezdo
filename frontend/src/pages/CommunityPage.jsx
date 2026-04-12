import React, { useState } from 'react';
import { Users, CalendarDays, Coffee, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CommunityPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = () => {
    setIsLoading(true);
    // Здесь будет вызов API для оплаты/продления подписки на комьюнити
    setTimeout(() => {
      setIsLoading(false);
      alert("Добро пожаловать в комьюнити Гнезда! 🎉");
      navigate('/dashboard'); // Возвращаем в ЛК, где теперь будет новый тариф
    }, 2000);
  };

  return (
    <div className="relative min-h-[calc(100vh-70px)] flex flex-col items-center justify-center p-4 overflow-hidden">
      
      {/* Декоративный фон с природными мотивами (имитация солнца/веток через градиенты) */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-gnezdo-yellow/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gnezdo-orange/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-sm bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 shadow-glass border border-white/60">
        
        {/* Иконка успеха */}
        <div className="w-16 h-16 bg-gradient-to-tr from-green-400 to-green-300 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-white">
          <Sparkles size={32} />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-gnezdo-brown tracking-tight mb-2">
            Ура, вы съехались! 🏠
          </h1>
          <p className="text-sm font-bold text-gnezdo-brown/60 uppercase tracking-wide mb-4">
            Подписка на поиск закрыта
          </p>
          <h2 className="text-xl font-extrabold text-gnezdo-orange mb-3 leading-tight">
            Не теряйся! Мы создаем комьюнити студентов
          </h2>
          <p className="text-sm font-medium text-gnezdo-brown/80 leading-relaxed">
            Поиск жилья окончен, но студенческая жизнь только начинается. Оставайся с нами в закрытом клубе «Гнездо».
          </p>
        </div>

        {/* Список преимуществ */}
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3 bg-white/50 p-4 rounded-2xl border border-gnezdo-orange/10">
            <div className="bg-gnezdo-orange/10 p-2 rounded-xl text-gnezdo-orange mt-0.5">
              <CalendarDays size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gnezdo-brown text-sm">Лекции и воркшопы</h3>
              <p className="text-xs text-gnezdo-brown/70 font-medium">Мероприятия по адаптации в новом городе и самостоятельной жизни.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white/50 p-4 rounded-2xl border border-gnezdo-orange/10">
            <div className="bg-gnezdo-yellow/20 p-2 rounded-xl text-gnezdo-orange mt-0.5">
              <Users size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gnezdo-brown text-sm">Нетворк-сессии</h3>
              <p className="text-xs text-gnezdo-brown/70 font-medium">Закрытые встречи, где можно найти друзей со схожими интересами.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white/50 p-4 rounded-2xl border border-gnezdo-orange/10">
            <div className="bg-gnezdo-brown/5 p-2 rounded-xl text-gnezdo-brown/70 mt-0.5">
              <Coffee size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gnezdo-brown text-sm">Скидки от партнеров</h3>
              <p className="text-xs text-gnezdo-brown/70 font-medium">Промокоды на доставку еды, кофейни и сервисы уборки.</p>
            </div>
          </div>
        </div>

        {/* Кнопки действия */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={handleJoin}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-gnezdo-orange to-gnezdo-yellow hover:opacity-90 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-md active:scale-95 disabled:opacity-70"
          >
            {isLoading ? 'Оформляем...' : 'Продлить подписку — 299 ₽/мес'}
          </button>
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full text-center text-sm font-bold text-gnezdo-brown/50 hover:text-gnezdo-brown transition-colors py-2"
          >
            Нет, спасибо. Вернуться в ЛК
          </button>
        </div>

      </div>
    </div>
  );
}