import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function SupportModal({ isOpen, onClose }) {
  const [reportType, setReportType] = useState('bug'); // Тип обращения по умолчанию
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь в будущем будет API-запрос к нашему FastAPI бэкенду
    // Например: api.post('/support', { type: reportType, description })
    
    // Имитируем успешную отправку
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setDescription('');
      onClose();
    }, 3000);
  };

  return (
    // Оверлей на весь экран с размытием
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gnezdo-brown/40 backdrop-blur-sm p-4">
      
      {/* Контейнер модального окна в стиле "жидкого стекла" */}
      <div className="relative w-full max-w-sm bg-white/95 rounded-[2rem] p-6 shadow-2xl border border-gnezdo-orange/20 overflow-hidden">
        
        {/* Декоративные пятна на фоне */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gnezdo-yellow/20 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gnezdo-orange/10 rounded-full blur-2xl pointer-events-none -ml-10 -mb-10"></div>

        {/* Кнопка закрытия */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gnezdo-brown/50 hover:text-gnezdo-brown transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="relative z-10">
          <h2 className="text-2xl font-extrabold text-gnezdo-brown mb-1 tracking-tight">
            Поддержка
          </h2>
          <p className="text-sm font-medium text-gnezdo-brown/70 mb-5">
            Нашли ошибку или кто-то ведет себя неадекватно? Напишите нам.
          </p>

          {isSubmitted ? (
            // Состояние успешной отправки
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gnezdo-brown">Сообщение отправлено!</h3>
              <p className="text-sm text-gnezdo-brown/70 mt-2">Разработчики уже читают его.</p>
            </div>
          ) : (
            // Форма отправки репорта
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-gnezdo-brown/60">
                  Тема обращения
                </label>
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="bg-gnezdo-bg border border-gnezdo-orange/30 text-gnezdo-brown rounded-xl px-4 py-3 focus:outline-none focus:border-gnezdo-orange focus:ring-1 focus:ring-gnezdo-orange/50 transition-all font-medium appearance-none"
                >
                  {/* Окно сообщить об ошибке  */}
                  <option value="bug">Сообщить об ошибке (Баг)</option>
                  {/* Жалоба на неадекватное поведение  */}
                  <option value="report">Жалоба на пользователя</option>
                  {/* Окно написать в поддержку, если непонятна механика  */}
                  <option value="question">Непонятна механика сайта</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-gnezdo-brown/60">
                  Опишите проблему
                </label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Опишите проблему максимально подробно, чтобы мы могли помочь..."
                  required
                  rows="4"
                  className="bg-gnezdo-bg border border-gnezdo-orange/30 text-gnezdo-brown rounded-xl px-4 py-3 focus:outline-none focus:border-gnezdo-orange focus:ring-1 focus:ring-gnezdo-orange/50 transition-all font-medium resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-gnezdo-orange hover:bg-gnezdo-orange/90 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-95 mt-2"
              >
                Отправить напрямую
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}