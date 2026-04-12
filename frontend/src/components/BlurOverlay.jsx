import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function BlurOverlay({ 
  message = "Зарегистрируйтесь, чтобы просматривать анкеты", 
  buttonText = "Попробовать бесплатно на 24 часа",
  redirectPath = "/about" // В MVP можно вести на страницу авторизации/регистрации
}) {
  return (
    // Абсолютное позиционирование, чтобы перекрыть родительский элемент (например, карточку)
    // Сильное размытие фона (backdrop-blur-xl)
    <div className="absolute inset-0 z-20 flex items-center justify-center backdrop-blur-xl bg-white/40 rounded-[2rem] p-4">
      
      {/* Плашка с призывом к действию в стиле "жидкого стекла" */}
      <div className="bg-white/90 p-6 rounded-3xl shadow-2xl text-center max-w-[85%] border border-gnezdo-orange/40 flex flex-col items-center">
        
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
          <Lock className="text-red-500" size={24} />
        </div>

        <h3 className="text-lg font-extrabold text-gnezdo-brown leading-tight mb-2">
          Доступ закрыт
        </h3>
        
        <p className="text-sm font-medium text-gnezdo-brown/80 mb-5">
          {message}
        </p>
        
        <Link 
          to={redirectPath} 
          className="w-full bg-gradient-to-r from-gnezdo-orange to-gnezdo-yellow text-white px-4 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all text-sm active:scale-95"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}