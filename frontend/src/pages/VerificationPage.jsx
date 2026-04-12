import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';

export default function VerificationPage() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setIsUploading(true);
    
    // Имитация отправки файла на наш FastAPI (в будущем тут будет FormData и api.post)
    setTimeout(() => {
      setIsUploading(false);
      setIsSuccess(true);
    }, 2500);
  };

  return (
    <div className="relative min-h-[calc(100vh-70px)] flex flex-col items-center justify-center p-4">
      
      <div className="w-full max-w-sm bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 shadow-glass border border-gnezdo-orange/30 text-center relative overflow-hidden">
        
        {/* Декорация */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gnezdo-orange/10 rounded-full blur-2xl"></div>

        {isSuccess ? (
          <div className="flex flex-col items-center animate-fade-in">
            <CheckCircle size={64} className="text-green-500 mb-4" />
            <h2 className="text-2xl font-extrabold text-gnezdo-brown mb-2">Документы на проверке</h2>
            <p className="text-sm font-medium text-gnezdo-brown/70">
              Наш алгоритм проверит данные в течение 10-15 минут. Вы получите уведомление, когда профиль будет верифицирован.
            </p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-gnezdo-orange/20 text-gnezdo-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={32} />
            </div>
            
            <h2 className="text-2xl font-extrabold text-gnezdo-brown mb-2 tracking-tight">Верификация</h2>
            <p className="text-sm font-medium text-gnezdo-brown/70 mb-6">
              Загрузите фото студенческого билета, справку из деканата или договор об аренде квартиры (если вы уже снимаете).
            </p>

            {/* Зона загрузки файла */}
            <div className="border-2 border-dashed border-gnezdo-orange/50 rounded-2xl p-6 mb-6 bg-gnezdo-bg transition-colors hover:bg-gnezdo-orange/5 relative">
              <input 
                type="file" 
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center pointer-events-none">
                <UploadCloud size={32} className="text-gnezdo-orange mb-2" />
                {file ? (
                  <p className="text-sm font-bold text-gnezdo-brown truncate w-full">{file.name}</p>
                ) : (
                  <p className="text-sm font-bold text-gnezdo-brown/60">Нажмите, чтобы выбрать файл</p>
                )}
                <p className="text-xs text-gnezdo-brown/40 mt-1">JPEG, PNG или PDF до 5 МБ</p>
              </div>
            </div>

            <button 
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="w-full bg-gnezdo-orange hover:bg-gnezdo-orange/90 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex justify-center items-center"
            >
              {isUploading ? (
                <span className="animate-pulse">Загрузка файла...</span>
              ) : (
                'Отправить на проверку'
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}