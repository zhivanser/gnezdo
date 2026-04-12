import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (userEmail, userPassword) => {
    const formData = new FormData();
    formData.append('username', userEmail);
    formData.append('password', userPassword);

    const response = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    localStorage.setItem('access_token', response.data.access_token);
    
    const userResponse = await api.get('/auth/me');
    login(userResponse.data);
    
    return response.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!isLogin) {
        await api.post('/auth/register', { email, password });
        await handleLogin(email, password);
        navigate('/profile');
      } else {
        await handleLogin(email, password);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Произошла ошибка при подключении к серверу');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-70px)] flex flex-col items-center justify-center p-4 overflow-hidden">
      
      <div className="absolute top-0 right-10 w-48 h-48 bg-gnezdo-yellow/30 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-sm bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-glass border border-white/50">
        
        <h2 className="text-3xl font-extrabold text-gnezdo-brown mb-2 tracking-tight">
          {isLogin ? 'С возвращением' : 'Создать аккаунт'}
        </h2>
        <p className="text-sm font-medium text-gnezdo-brown/70 mb-8">
          {isLogin 
            ? 'Войдите, чтобы продолжить поиск' 
            : 'Зарегистрируйтесь и получите 24 часа подписки бесплатно'}
        </p>

        {error && (
          <div className="bg-red-100/50 border border-red-500/20 text-red-600 text-sm p-3 rounded-xl mb-6 font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-gnezdo-brown/60 ml-1">
              Email
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.ru"
              required
              className="bg-white/50 border border-gnezdo-orange/30 text-gnezdo-brown rounded-xl px-4 py-3 focus:outline-none focus:border-gnezdo-orange focus:ring-1 focus:ring-gnezdo-orange/50 transition-all font-medium"
            />
          </div>

          <div className="flex flex-col gap-1 mb-2">
            <label className="text-xs font-bold uppercase text-gnezdo-brown/60 ml-1">
              Пароль
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength="6"
              className="bg-white/50 border border-gnezdo-orange/30 text-gnezdo-brown rounded-xl px-4 py-3 focus:outline-none focus:border-gnezdo-orange focus:ring-1 focus:ring-gnezdo-orange/50 transition-all font-medium"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-gnezdo-orange to-gnezdo-yellow hover:opacity-90 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {isLoading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-sm font-bold text-gnezdo-orange hover:text-gnezdo-brown transition-colors"
          >
            {isLogin ? 'Нет аккаунта? Создать' : 'Уже есть аккаунт? Войти'}
          </button>
        </div>

      </div>
    </div>
  );
}
