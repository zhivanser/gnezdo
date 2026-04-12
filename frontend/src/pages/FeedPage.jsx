import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, X, Sparkles } from 'lucide-react';
import api from '../api';

const TinderCard = ({ profile, onSwipe }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event, info) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onSwipe(profile.id, true);
    } else if (info.offset.x < -threshold) {
      onSwipe(profile.id, false);
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute w-full max-w-sm h-[32rem] rounded-[2rem] p-4 cursor-grab active:cursor-grabbing 
                 border border-white/40 shadow-glass bg-gradient-to-br from-gnezdo-orange/20 to-gnezdo-yellow/20 
                 backdrop-blur-md flex flex-col justify-between overflow-hidden"
    >
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-gnezdo-yellow/30 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-40 h-40 bg-gnezdo-orange/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 w-full h-1/2 rounded-[1.5rem] overflow-hidden shadow-inner bg-gnezdo-bg flex items-center justify-center">
        <span className="text-6xl font-extrabold text-gnezdo-orange/30">
          {profile.first_name?.[0] || '?'}
        </span>
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-gnezdo-brown px-3 py-1 rounded-full text-sm font-extrabold shadow-md border border-gnezdo-orange/30">
          85% Match
        </div>
      </div>

      <div className="relative z-10 text-gnezdo-brown flex-1 flex flex-col">
        <h2 className="text-3xl font-extrabold tracking-tight">
          {profile.first_name}, {profile.age}
        </h2>
        <p className="text-sm font-semibold opacity-80 mt-1">
          {profile.university || 'Университет не указан'}
        </p>
        <p className="text-sm text-gnezdo-brown/70 mt-1">
          {profile.city} • {profile.district || 'Район не указан'}
        </p>
        
        <div className="mt-3 flex-1 overflow-hidden">
          <p className="text-xs font-bold uppercase opacity-60 mb-1">О себе:</p>
          <p className="text-sm leading-tight line-clamp-3">{profile.about_me || 'Нет описания'}</p>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {profile.hobbies && profile.hobbies.split(',').slice(0, 3).map((hobby, idx) => (
              <span key={idx} className="bg-white/60 px-3 py-1 rounded-xl text-xs font-semibold shadow-sm border border-white/50">
                {hobby.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="relative z-10 flex justify-between w-full px-2 mt-2 text-gnezdo-brown/50 text-xs font-bold uppercase pointer-events-none">
        <span>← Пропустить</span>
        <span className="text-gnezdo-orange/70">Лайк →</span>
      </div>
    </motion.div>
  );
};

const MatchModal = ({ contact, peerName, onClose }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-2xl font-extrabold text-gnezdo-brown mb-2">Мэтч!</h2>
      <p className="text-gnezdo-brown/70 mb-6">Вы понравились друг другу!</p>
      <div className="bg-gnezdo-bg rounded-xl p-4 mb-6">
        <p className="text-sm text-gnezdo-brown/60 mb-1">Контакт соседа:</p>
        <p className="font-bold text-gnezdo-orange">{contact}</p>
      </div>
      <button onClick={onClose} className="w-full bg-gnezdo-orange text-white font-bold py-3 rounded-xl">
        Отлично!
      </button>
    </div>
  </div>
);

export default function FeedPage() {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [matchData, setMatchData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await api.get('/profile/feed');
        setProfiles(response.data);
      } catch (err) {
        console.error("Ошибка загрузки ленты:", err);
        if (err.response?.status === 400) {
          setError('Сначала заполните анкету');
        } else if (err.response?.status === 401) {
          navigate('/auth');
        } else {
          setError('Ошибка загрузки');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeed();
  }, [navigate]);

  const handleSwipe = async (targetId, isLike) => {
    setProfiles((prev) => prev.filter(p => p.id !== targetId));

    try {
      const response = await api.post('/swipes', { target_id: targetId, is_like: isLike });
      
      if (response.data.mutual_match) {
        setMatchData({
          contact: response.data.contact,
          peerName: "новым соседом",
        });
      }
    } catch (error) {
      console.error("Ошибка при свайпе:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-70px)] flex items-center justify-center">
        <div className="text-gnezdo-orange font-bold animate-pulse text-xl">Ищем идеальных соседей...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-70px)] flex flex-col items-center justify-center p-4">
        <div className="text-center p-8 bg-white/50 backdrop-blur-md rounded-3xl border border-gnezdo-orange/20 shadow-inner max-w-sm">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gnezdo-brown mb-2">Что-то пошло не так</h3>
          <p className="text-gnezdo-brown/70 text-sm mb-4">{error}</p>
          <button 
            onClick={() => navigate('/profile')}
            className="bg-gnezdo-orange text-white font-bold py-3 px-6 rounded-xl"
          >
            Заполнить анкету
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-70px)] flex flex-col items-center justify-center p-4 overflow-hidden">
      
      {profiles.length > 0 && (
        <div className="relative w-full max-w-sm h-[32rem] flex items-center justify-center">
          {profiles.map((profile, index) => (
            <TinderCard 
              key={profile.id || index} 
              profile={profile} 
              onSwipe={handleSwipe} 
              style={{ zIndex: profiles.length - index }} 
            />
          ))}
        </div>
      )}

      {profiles.length === 0 && (
        <div className="text-center p-8 bg-white/50 backdrop-blur-md rounded-3xl border border-gnezdo-orange/20 shadow-inner">
          <div className="text-4xl mb-4">🍃</div>
          <h3 className="text-xl font-bold text-gnezdo-brown mb-2">Анкеты закончились</h3>
          <p className="text-gnezdo-brown/70 text-sm">
            Мы оповестим вас, когда появятся новые кандидаты.
          </p>
        </div>
      )}

      {matchData && (
        <MatchModal 
          contact={matchData.contact} 
          peerName={matchData.peerName} 
          onClose={() => setMatchData(null)} 
        />
      )}

    </div>
  );
}
