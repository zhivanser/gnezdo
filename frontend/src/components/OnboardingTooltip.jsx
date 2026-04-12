import React from 'react';
import { motion } from 'framer-motion';

export default function OnboardingTooltip({ 
  text, 
  onNext, 
  positionClass = "top-16 left-4" // Позиция подсказки передается через классы Tailwind
}) {
  return (
    // Используем motion.div для красивого "выплывания" подсказки
    <motion.div 
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`absolute z-[60] ${positionClass} flex flex-col items-start`}
    >
      {/* Нарисованная от руки изогнутая стрелка (SVG) */}
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 100 100" 
        className="text-gnezdo-orange ml-4 mb-1 rotate-12 drop-shadow-md"
        fill="none" 
        stroke="currentColor" 
        strokeWidth="6" 
        strokeLinecap="round"
      >
        <path d="M10,90 Q30,10 90,10" />
        <path d="M70,10 L90,10 L90,30" />
      </svg>

      {/* Сама плашка с текстом */}
      <div className="bg-gnezdo-brown text-white p-4 rounded-2xl shadow-2xl w-56 border-2 border-gnezdo-orange/50 relative">
        <p className="text-sm font-bold mb-3 leading-snug">
          {text}
        </p>
        
        <div className="flex justify-end">
          <button 
            onClick={onNext} 
            className="text-xs bg-gnezdo-orange hover:bg-gnezdo-yellow hover:text-gnezdo-brown transition-colors px-4 py-1.5 rounded-lg font-extrabold shadow-sm active:scale-95"
          >
            Понятно
          </button>
        </div>
      </div>
    </motion.div>
  );
}