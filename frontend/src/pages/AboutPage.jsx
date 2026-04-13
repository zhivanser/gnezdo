import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OnboardingTooltip from '../components/OnboardingTooltip';

export default function AboutPage() {
  const [showTooltip, setShowTooltip] = useState(false);

  // Запускаем обучение со стрелочкой через секунду после загрузки страницы
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-70px)] flex flex-col items-center justify-center p-4 overflow-hidden">
      
      {/* Обучающая подсказка со стрелочкой (позиционируем так, чтобы указывала на шапку) */}
      {showTooltip && (
        <OnboardingTooltip 
          text="Тут заполни анкету" 
          positionClass="fixed top-16 left-1/3 transform -translate-x-4"
          onNext={() => setShowTooltip(false)} 
        />
      )}

      {/* Декоративный фон: природные мотивы и градиенты */}
      <div className="absolute top-10 right-0 w-64 h-64 bg-gnezdo-yellow/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-0 w-64 h-64 bg-gnezdo-orange/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Главная карточка-презентация (Жидкое стекло) */}
      <div className="relative z-10 w-full max-w-sm bg-white/60 backdrop-blur-xl rounded-[2rem] p-8 shadow-glass border border-white/50 text-center">
        
        <div className="w-20 h-20 bg-gradient-to-tr from-gnezdo-orange to-gnezdo-yellow rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <span className="text-4xl">🪹</span>
        </div>

        <h1 className="text-4xl font-extrabold text-gnezdo-brown mb-4 tracking-tight leading-tight">
          Добро пожаловать в Гнездо
        </h1>
        
        <p className="text-gnezdo-brown/80 font-medium mb-8 leading-relaxed">
          Сервис поиска идеального соседа. 
          Заполняй анкету, свайпай кандидатов и находи тех, с кем комфортно жить.
        </p>

        <div className="space-y-4">
          <Link 
            to="/auth" 
            className="block w-full bg-gnezdo-orange hover:bg-gnezdo-orange/90 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-md active:scale-95 text-lg"
          >
            Начать поиск
          </Link>
          
          <p className="text-xs text-gnezdo-brown/60 font-semibold uppercase tracking-wide">
            При регистрации дарим 24 часа бесплатно
          </p>
        </div>
      </div>
    </div>
  );
}