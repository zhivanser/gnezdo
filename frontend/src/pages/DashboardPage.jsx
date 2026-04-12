import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, ShieldCheck, LogOut, Edit3, Heart, Mail, MapPin, GraduationCap, X, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMatches, setShowMatches] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await api.get('/profile/me');
        setProfile(profileRes.data);
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error("Ошибка загрузки профиля:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (showMatches) {
      fetchMatches();
    }
  }, [showMatches]);

  const fetchMatches = async () => {
    try {
      const response = await api.get('/swipes/matches');
      setMatches(response.data);
    } catch (error) {
      console.error("Ошибка загрузки мэтчей:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-70px)] flex items-center justify-center">
        <div className="text-gnezdo-orange font-bold animate-pulse">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-70px)] p-4 overflow-y-auto">
      
      <div className="absolute top-10 right-0 w-64 h-64 bg-gnezdo-yellow/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-md mx-auto space-y-4">
        
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-glass border border-white/50 flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gnezdo-orange/20 flex items-center justify-center shadow-sm border-2 border-gnezdo-orange/20">
            <span className="text-3xl font-extrabold text-gnezdo-orange">
              {profile?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold text-gnezdo-brown">{profile?.first_name || 'Новый пользователь'}</h2>
            <p className="text-sm font-medium text-gnezdo-brown/70">
              {profile?.city || 'Город не указан'}
            </p>
            
            <div className="mt-2 flex items-center gap-1 text-sm font-bold">
              {user?.is_premium ? (
                <span className="text-green-600 flex items-center gap-1"><ShieldCheck size={16}/> Премиум</span>
              ) : (
                <span className="text-gnezdo-orange flex items-center gap-1"><Clock size={16}/> Пробный период</span>
              )}
            </div>
          </div>
        </div>

        {!profile ? (
          <div className="bg-gradient-to-br from-gnezdo-orange/10 to-gnezdo-yellow/10 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border border-gnezdo-orange/20 text-center">
            <h3 className="text-lg font-bold text-gnezdo-brown mb-2">Добро пожаловать!</h3>
            <p className="text-gnezdo-brown/70 mb-4">Заполните анкету, чтобы начать искать соседей</p>
            <Link to="/profile" className="block w-full bg-gnezdo-orange hover:bg-gnezdo-orange/90 text-white font-black uppercase tracking-wider py-4 px-6 rounded-2xl shadow-lg active:scale-95 transition-all">
              Создать анкету
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-gnezdo-orange/10 to-gnezdo-yellow/10 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border border-gnezdo-orange/20 text-center">
              <div className="flex justify-around mb-4">
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-gnezdo-orange">{matches.length}</div>
                  <div className="text-xs text-gnezdo-brown/60 font-medium">Мэтчей</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-gnezdo-orange">{profile?.housing_role?.includes('ищу') ? 'Ищу' : 'Сдаю'}</div>
                  <div className="text-xs text-gnezdo-brown/60 font-medium">Статус</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-gnezdo-orange">{profile?.age || '-'}</div>
                  <div className="text-xs text-gnezdo-brown/60 font-medium">Лет</div>
                </div>
              </div>
              
              <button 
                onClick={() => setShowMatches(true)}
                className="w-full mb-3 bg-pink-500 hover:bg-pink-600 text-white font-black uppercase tracking-wider py-4 px-6 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Heart size={20} />
                Мои мэтчи ({matches.length})
              </button>
              
              <Link to="/feed" className="block w-full bg-gnezdo-orange hover:bg-gnezdo-orange/90 text-white font-black uppercase tracking-wider py-4 px-6 rounded-2xl shadow-lg active:scale-95 transition-all">
                Искать соседей
              </Link>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-glass border border-white/50">
              <h3 className="text-lg font-bold text-gnezdo-brown mb-4 flex items-center gap-2">
                <Edit3 size={18} className="text-gnezdo-orange" />
                Моя анкета
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gnezdo-bg/50 rounded-xl">
                  <span className="text-sm text-gnezdo-brown/70">Университет</span>
                  <span className="text-sm font-bold text-gnezdo-brown">{profile.university || 'Не указан'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gnezdo-bg/50 rounded-xl">
                  <span className="text-sm text-gnezdo-brown/70">Район</span>
                  <span className="text-sm font-bold text-gnezdo-brown">{profile.district || 'Не указан'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gnezdo-bg/50 rounded-xl">
                  <span className="text-sm text-gnezdo-brown/70">Бюджет</span>
                  <span className="text-sm font-bold text-gnezdo-brown">{profile.budget || 'Не указан'}</span>
                </div>
              </div>

              <Link to="/profile" className="mt-4 block w-full text-center bg-gnezdo-orange/10 hover:bg-gnezdo-orange/20 text-gnezdo-orange font-bold py-3 px-6 rounded-xl transition-all">
                Редактировать анкету
              </Link>
            </div>
          </>
        )}

        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-glass border border-white/50">
          <h3 className="text-lg font-bold text-gnezdo-brown mb-4">Аккаунт</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gnezdo-bg/50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-gnezdo-orange/20 flex items-center justify-center">
                <Mail size={18} className="text-gnezdo-orange" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-gnezdo-brown">Email</div>
                <div className="text-xs text-gnezdo-brown/60">{user?.email}</div>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <LogOut size={18} className="text-red-500" />
              </div>
              <span className="text-sm font-bold text-red-500">Выйти</span>
            </button>
          </div>
        </div>

      </div>

      {showMatches && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-t-[2rem] p-6 max-h-[80vh] overflow-y-auto animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-extrabold text-gnezdo-brown flex items-center gap-2">
                <Heart className="text-pink-500" size={24} />
                Мои мэтчи
              </h2>
              <button onClick={() => setShowMatches(false)} className="p-2 hover:bg-gnezdo-bg rounded-full">
                <X size={24} className="text-gnezdo-brown" />
              </button>
            </div>
            
            {matches.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">💔</div>
                <p className="text-gnezdo-brown/70">Пока нет мэтчей</p>
                <p className="text-gnezdo-brown/50 text-sm mt-2">Свайпайте анкеты, чтобы найти соседа!</p>
                <Link 
                  to="/feed"
                  onClick={() => setShowMatches(false)}
                  className="mt-4 inline-block bg-gnezdo-orange text-white font-bold py-3 px-6 rounded-xl"
                >
                  Найти соседей
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((match, index) => (
                  <div key={match.user_id || index} className="bg-gradient-to-br from-pink-50 to-orange-50 p-4 rounded-2xl border border-pink-100">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-14 h-14 rounded-full bg-pink-200 flex items-center justify-center">
                        <span className="text-2xl font-extrabold text-pink-600">
                          {match.first_name?.[0] || '?'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gnezdo-brown">{match.first_name}</h3>
                        {match.city && (
                          <p className="text-sm text-gnezdo-brown/60 flex items-center gap-1">
                            <MapPin size={12} /> {match.city}
                          </p>
                        )}
                        {match.university && (
                          <p className="text-sm text-gnezdo-brown/60 flex items-center gap-1">
                            <GraduationCap size={12} /> {match.university}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-white/80 rounded-xl p-3 mb-3">
                      <p className="text-xs text-gnezdo-brown/60 mb-1">📧 Контакт для связи:</p>
                      <a href={`mailto:${match.email}`} className="font-bold text-gnezdo-orange hover:underline break-all">
                        {match.email}
                      </a>
                    </div>
                    
                    <a 
                      href={`mailto:${match.email}`}
                      className="w-full flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                      <MessageCircle size={18} />
                      Написать
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
