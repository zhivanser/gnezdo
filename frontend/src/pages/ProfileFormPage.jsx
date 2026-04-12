import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function ProfileFormPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '', age: '', gender: 'мужчина', city: '', university: '', faculty: '', course: '1', housing_role: 'ищу соседа для совместной аренды',
    hard_filters: { co_living_gender: 'не имеет значения', alcohol: 'иногда', smoking: 'не курю, но не против', parties: 'нормально отношусь', guests: 'иногда' },
    rhythm_filters: { schedule: 'гибкий режим', sleep_time: '23:00–01:00', wake_time: '7:00–9:00', noise: 'умеренно', cleanliness: 'поддерживаю чистоту', chores: 'скорее да' },
    lifestyle_filters: { home_activities: [], free_time: [], has_pets: 'нет', pet_attitude: 'люблю' },
    character_filters: { self_traits: [], roommate_traits: [] },
    rent_duration: '6–12 месяцев', budget: '20–30 тыс ₽', district: '',
    hobbies: '', ideal_format: '', about_me: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile/me');
        const profile = response.data;
        
        setFormData({
          first_name: profile.first_name || '',
          age: profile.age || '',
          gender: profile.gender || 'мужчина',
          city: profile.city || '',
          university: profile.university || '',
          faculty: profile.faculty || '',
          course: profile.course || '1',
          housing_role: profile.housing_role || 'ищу соседа для совместной аренды',
          hard_filters: profile.hard_filters || formData.hard_filters,
          rhythm_filters: profile.rhythm_filters || formData.rhythm_filters,
          lifestyle_filters: profile.lifestyle_filters || formData.lifestyle_filters,
          character_filters: profile.character_filters || formData.character_filters,
          rent_duration: profile.rent_duration || '6–12 месяцев',
          budget: profile.budget || '20–30 тыс ₽',
          district: profile.district || '',
          hobbies: profile.hobbies || '',
          ideal_format: profile.ideal_format || '',
          about_me: profile.about_me || ''
        });
        setProfileExists(true);
      } catch (error) {
        if (error.response?.status === 404) {
          setProfileExists(false);
        } else {
          console.error("Ошибка загрузки профиля:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    if (!formData.first_name) {
      setError('Введите ваше имя');
      return;
    }
    
    setIsSaving(true);
    setError('');
    try {
      await api.post('/profile', formData);
      navigate('/feed');
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      setError('Ошибка при сохранении анкеты');
    } finally {
      setIsSaving(false);
    }
  };

  const totalSteps = 7;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const updateHardFilter = (key, value) => {
    setFormData({...formData, hard_filters: {...formData.hard_filters, [key]: value}});
  };

  const updateRhythmFilter = (key, value) => {
    setFormData({...formData, rhythm_filters: {...formData.rhythm_filters, [key]: value}});
  };

  const updateLifestyleFilter = (key, value) => {
    setFormData({...formData, lifestyle_filters: {...formData.lifestyle_filters, [key]: value}});
  };

  const SelectField = ({ label, value, onChange, options }) => (
    <div className="mb-4">
      <label className="text-sm font-bold text-gnezdo-brown/70 block mb-1">{label}</label>
      <select 
        value={value} 
        onChange={e => onChange(e.target.value)}
        className="w-full p-3 rounded-xl bg-gnezdo-bg border border-gnezdo-orange/30 text-gnezdo-brown"
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-70px)] flex items-center justify-center">
        <div className="text-gnezdo-orange font-bold animate-pulse">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-70px)] p-4 flex flex-col items-center">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-glass border border-white/50 mb-6">
        
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-gnezdo-brown tracking-tight">
            {profileExists ? 'Редактировать анкету' : 'Создать анкету'}
          </h2>
          <p className="text-xs font-semibold text-gnezdo-orange uppercase mt-1">
            Шаг {currentStep} из {totalSteps}
          </p>
          <div className="w-full bg-gnezdo-orange/20 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-gnezdo-orange h-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100/50 border border-red-500/20 text-red-600 text-sm p-3 rounded-xl mb-4 font-medium text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4 min-h-[300px]">
          
          {currentStep === 1 && (
            <div className="animate-fade-in space-y-4">
              <h3 className="font-bold text-gnezdo-brown mb-2">1. Обо мне</h3>
              <input type="text" placeholder="Имя *" className="w-full p-3 rounded-xl bg-gnezdo-bg border border-gnezdo-orange/30 text-gnezdo-brown"
                value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
              
              <input type="number" placeholder="Возраст" className="w-full p-3 rounded-xl bg-gnezdo-bg border border-gnezdo-orange/30 text-gnezdo-brown"
                value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
              
              <select className="w-full p-3 rounded-xl bg-gnezdo-bg border border-gnezdo-orange/30 text-gnezdo-brown"
                value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                <option value="мужчина">Мужчина</option>
                <option value="женщина">Женщина</option>
              </select>

              <input type="text" placeholder="Город" className="w-full p-3 rounded-xl bg-gnezdo-bg border border-gnezdo-orange/30 text-gnezdo-brown"
                value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />

              <input type="text" placeholder="Университет" className="w-full p-3 rounded-xl bg-gnezdo-bg border border-gnezdo-orange/30 text-gnezdo-brown"
                value={formData.university} onChange={e => setFormData({...formData, university: e.target.value})} />
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-fade-in space-y-4">
              <h3 className="font-bold text-gnezdo-brown mb-2">2. Жильё</h3>
              <select className="w-full p-3 rounded-xl bg-gnezdo-bg border border-gnezdo-orange/30 text-gnezdo-brown"
                value={formData.housing_role} onChange={e => setFormData({...formData, housing_role: e.target.value})}>
                <option value="ищу соседа для совместной аренды">Ищу соседа для совместной аренды</option>
                <option value="уже снимаю квартиру и ищу соседа">Уже снимаю квартиру и ищу соседа</option>
              </select>

              <SelectField 
                label="Срок аренды" 
                value={formData.rent_duration}
                onChange={v => setFormData({...formData, rent_duration: v})}
                options={[
                  {value: '1-3 месяца', label: '1-3 месяца'},
                  {value: '3-6 месяцев', label: '3-6 месяцев'},
                  {value: '6-12 месяцев', label: '6-12 месяцев'},
                  {value: 'более года', label: 'Более года'},
                ]}
              />

              <input type="text" placeholder="Район" className="w-full p-3 rounded-xl bg-gnezdo-bg border border-gnezdo-orange/30 text-gnezdo-brown"
                value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} />

              <input type="text" placeholder="Бюджет (напр. 20-30 тыс ₽)" className="w-full p-3 rounded-xl bg-gnezdo-bg border border-gnezdo-orange/30 text-gnezdo-brown"
                value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
            </div>
          )}

          {currentStep === 3 && (
            <div className="animate-fade-in space-y-4">
              <h3 className="font-bold text-gnezdo-brown mb-2">3. Жёсткие правила</h3>
              
              <SelectField 
                label="Курение" 
                value={formData.hard_filters.smoking}
                onChange={v => updateHardFilter('smoking', v)}
                options={[
                  {value: 'не курю и против курения дома', label: 'Не курю и против курения дома'},
                  {value: 'не курю, но не против', label: 'Не курю, но не против'},
                  {value: 'курю', label: 'Курю'},
                ]}
              />

              <SelectField 
                label="Алкоголь" 
                value={formData.hard_filters.alcohol}
                onChange={v => updateHardFilter('alcohol', v)}
                options={[
                  {value: 'не пью', label: 'Не пью'},
                  {value: 'иногда', label: 'Иногда'},
                  {value: 'часто', label: 'Часто'},
                ]}
              />

              <SelectField 
                label="Вечеринки" 
                value={formData.hard_filters.parties}
                onChange={v => updateHardFilter('parties', v)}
                options={[
                  {value: 'не люблю', label: 'Не люблю'},
                  {value: 'нормально отношусь', label: 'Нормально'},
                  {value: 'люблю', label: 'Люблю'},
                ]}
              />

              <SelectField 
                label="Гости" 
                value={formData.hard_filters.guests}
                onChange={v => updateHardFilter('guests', v)}
                options={[
                  {value: 'редко', label: 'Редко'},
                  {value: 'иногда', label: 'Иногда'},
                  {value: 'часто', label: 'Часто'},
                ]}
              />
            </div>
          )}

          {currentStep === 4 && (
            <div className="animate-fade-in space-y-4">
              <h3 className="font-bold text-gnezdo-brown mb-2">4. Режим дня</h3>
              
              <SelectField 
                label="График" 
                value={formData.rhythm_filters.schedule}
                onChange={v => updateRhythmFilter('schedule', v)}
                options={[
                  {value: 'ранний подъем', label: 'Ранний подъем (до 7:00)'},
                  {value: 'гибкий режим', label: 'Гибкий режим'},
                  {value: 'ночная жизнь', label: 'Ночная жизнь'},
                ]}
              />

              <SelectField 
                label="Время сна" 
                value={formData.rhythm_filters.sleep_time}
                onChange={v => updateRhythmFilter('sleep_time', v)}
                options={[
                  {value: 'до 23:00', label: 'До 23:00'},
                  {value: '23:00–01:00', label: '23:00–01:00'},
                  {value: 'после 01:00', label: 'После 01:00'},
                ]}
              />

              <SelectField 
                label="Время подъёма" 
                value={formData.rhythm_filters.wake_time}
                onChange={v => updateRhythmFilter('wake_time', v)}
                options={[
                  {value: 'до 7:00', label: 'До 7:00'},
                  {value: '7:00–9:00', label: '7:00–9:00'},
                  {value: 'после 9:00', label: 'После 9:00'},
                ]}
              />

              <SelectField 
                label="Уровень шума" 
                value={formData.rhythm_filters.noise}
                onChange={v => updateRhythmFilter('noise', v)}
                options={[
                  {value: 'тихий', label: 'Тихий'},
                  {value: 'умеренно', label: 'Умеренно'},
                  {value: 'шумный', label: 'Шумный'},
                ]}
              />
            </div>
          )}

          {currentStep === 5 && (
            <div className="animate-fade-in space-y-4">
              <h3 className="font-bold text-gnezdo-brown mb-2">5. Чистота и порядок</h3>
              
              <SelectField 
                label="Чистота" 
                value={formData.rhythm_filters.cleanliness}
                onChange={v => updateRhythmFilter('cleanliness', v)}
                options={[
                  {value: 'поддерживаю чистоту', label: 'Поддерживаю чистоту'},
                  {value: 'убираюсь регулярно', label: 'Убираюсь регулярно'},
                  {value: 'убираюсь редко', label: 'Убираюсь редко'},
                ]}
              />

              <SelectField 
                label="Домашние дела" 
                value={formData.rhythm_filters.chores}
                onChange={v => updateRhythmFilter('chores', v)}
                options={[
                  {value: 'скорее да', label: 'Скорее да'},
                  {value: 'скорее нет', label: 'Скорее нет'},
                  {value: 'зависит от настроения', label: 'Зависит от настроения'},
                ]}
              />

              <SelectField 
                label="Домашние животные" 
                value={formData.lifestyle_filters.has_pets}
                onChange={v => updateLifestyleFilter('has_pets', v)}
                options={[
                  {value: 'нет', label: 'Нет'},
                  {value: 'есть', label: 'Есть'},
                ]}
              />

              <SelectField 
                label="Отношение к питомцам" 
                value={formData.lifestyle_filters.pet_attitude}
                onChange={v => updateLifestyleFilter('pet_attitude', v)}
                options={[
                  {value: 'люблю', label: 'Люблю'},
                  {value: 'нейтрально', label: 'Нейтрально'},
                  {value: 'не люблю', label: 'Не люблю'},
                ]}
              />
            </div>
          )}

          {currentStep === 6 && (
            <div className="animate-fade-in space-y-4">
              <h3 className="font-bold text-gnezdo-brown mb-2">6. Хобби и интересы</h3>
              <input type="text" placeholder="Хобби (через запятую)" className="w-full p-3 rounded-xl bg-gnezdo-bg border border-gnezdo-orange/30 text-gnezdo-brown"
                value={formData.hobbies} onChange={e => setFormData({...formData, hobbies: e.target.value})} />
              
              <div className="p-3 bg-gnezdo-bg/50 rounded-xl text-sm text-gnezdo-brown/70">
                <p className="font-bold mb-2">Примеры:</p>
                <p>Спорт, музыка, кино, игры, чтение, готовка, путешествия, искусство</p>
              </div>
            </div>
          )}

          {currentStep === 7 && (
            <div className="animate-fade-in space-y-4">
              <h3 className="font-bold text-gnezdo-brown mb-2">7. О себе</h3>
              <textarea placeholder="Расскажите о себе (3-4 предложения)..." rows="4" className="w-full p-3 rounded-xl bg-gnezdo-bg border border-gnezdo-orange/30 text-gnezdo-brown resize-none"
                value={formData.about_me} onChange={e => setFormData({...formData, about_me: e.target.value})} />
              
              <textarea placeholder="Какой сосед вам идеален?" rows="3" className="w-full p-3 rounded-xl bg-gnezdo-bg border border-gnezdo-orange/30 text-gnezdo-brown resize-none"
                value={formData.ideal_format} onChange={e => setFormData({...formData, ideal_format: e.target.value})} />
            </div>
          )}

        </div>

        <div className="flex justify-between mt-6 pt-4 border-t border-gnezdo-orange/20">
          <button onClick={prevStep} disabled={currentStep === 1}
            className="px-4 py-2 font-bold text-gnezdo-brown/60 hover:text-gnezdo-brown disabled:opacity-30 transition-colors">
            Назад
          </button>
          
          {currentStep < totalSteps ? (
            <button onClick={nextStep}
              className="bg-gnezdo-orange text-white px-6 py-2 rounded-xl font-bold shadow-md hover:shadow-lg active:scale-95 transition-all">
              Далее
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={isSaving}
              className="bg-gradient-to-r from-gnezdo-orange to-gnezdo-yellow text-white px-6 py-2 rounded-xl font-bold shadow-md active:scale-95 transition-all">
              {isSaving ? 'Сохраняем...' : 'Завершить'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
