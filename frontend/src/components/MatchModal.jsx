import React from 'react';

export default function MatchModal({ contact, peerName, onClose }) {
  if (!contact) return null;

  return (
    // Оверлей на весь экран с сильным размытием фона
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gnezdo-brown/40 backdrop-blur-md p-4">
      
      <div className="w-full max-w-sm bg-white rounded-[2rem] p-8 text-center shadow-2xl relative overflow-hidden border border-gnezdo-orange/30">
        
        {/* Декоративный градиентный круг на фоне */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-gnezdo-orange/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-gnezdo-yellow/30 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-gnezdo-orange to-gnezdo-yellow rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-white">
            <span className="text-4xl">🎉</span>
          </div>

          <h2 className="text-3xl font-extrabold text-gnezdo-brown mb-2 tracking-tight">
            It's a Match!
          </h2>
          
          <p className="text-gnezdo-brown/80 mb-6 font-medium">
            У вас взаимная симпатия с <span className="font-bold">{peerName}</span>! 
            Теперь предстоит встретиться и проверить мэтч вживую.
          </p>

          <div className="bg-gnezdo-bg border border-gnezdo-orange/20 rounded-2xl p-4 mb-6 shadow-inner">
            <p className="text-xs text-gnezdo-brown/60 uppercase font-bold mb-1">Контакт для связи:</p>
            <p className="text-xl font-bold text-gnezdo-orange select-all">
              {contact}
            </p>
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-gnezdo-orange hover:bg-gnezdo-orange/90 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-95"
          >
            Отлично, пишу!
          </button>
        </div>
      </div>
    </div>
  );
}