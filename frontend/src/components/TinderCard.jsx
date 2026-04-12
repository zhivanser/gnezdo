import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

export default function TinderCard({ profile, onSwipe }) {
  const [exitX, setExitX] = useState(0);
  const x = useMotionValue(0);
  
  // Трансформации для физики Тиндера: при сдвиге по X карточка слегка поворачивается
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  // При сильном сдвиге карточка становится прозрачной
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event, info) => {
    const threshold = 100; // На сколько пикселей нужно сдвинуть для срабатывания свайпа
    
    if (info.offset.x > threshold) {
      setExitX(200); // Улетает вправо
      onSwipe(profile.id, true); // Передаем лайк наверх
    } else if (info.offset.x < -threshold) {
      setExitX(-200); // Улетает влево
      onSwipe(profile.id, false); // Передаем дизлайк наверх
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ x: exitX }}
      transition={{ duration: 0.3 }}
      // Стилизация: обтекаемые формы, эффект жидкого стекла и оранжево-желтый градиент
      className="absolute w-full max-w-sm h-[32rem] rounded-[2rem] p-4 cursor-grab active:cursor-grabbing 
                 border border-white/40 shadow-glass bg-gradient-to-br from-gnezdo-orange/20 to-gnezdo-yellow/20 
                 backdrop-blur-md flex flex-col justify-between overflow-hidden"
    >
      {/* Декоративный элемент: имитация листьев/веток из ТЗ на фоне */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-gnezdo-yellow/30 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-40 h-40 bg-gnezdo-orange/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 w-full h-1/2 rounded-[1.5rem] overflow-hidden shadow-inner mb-4 bg-gnezdo-bg">
        <img 
          src={profile.photo_url || "https://via.placeholder.com/400x500?text=Фото+профиля"} 
          alt={profile.first_name}
          className="w-full h-full object-cover pointer-events-none"
        />
        {/* Бейдж процента совместимости */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-gnezdo-brown px-3 py-1 rounded-full text-sm font-extrabold shadow-md border border-gnezdo-orange/30">
          85% Match
        </div>
      </div>

      <div className="relative z-10 text-gnezdo-brown flex-1 flex flex-col">
        <h2 className="text-3xl font-extrabold tracking-tight">
          {profile.first_name}, {profile.age}
        </h2>
        <p className="text-sm font-semibold opacity-80 mt-1">
          {profile.university} • {profile.course} курс
        </p>
        
        <div className="mt-3 flex-1">
          <p className="text-xs font-bold uppercase opacity-60 mb-1">О себе:</p>
          <p className="text-sm leading-tight line-clamp-2">{profile.about_me}</p>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {profile.hobbies && profile.hobbies.split(',').slice(0, 3).map((hobby, idx) => (
              <span key={idx} className="bg-white/60 px-3 py-1 rounded-xl text-xs font-semibold shadow-sm border border-white/50">
                {hobby.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Визуальные подсказки для новых пользователей */}
      <div className="relative z-10 flex justify-between w-full px-2 mt-2 text-gnezdo-brown/50 text-xs font-bold uppercase pointer-events-none">
        <span>← Пропустить</span>
        <span className="text-gnezdo-orange/70">Лайк →</span>
      </div>
    </motion.div>
  );
}