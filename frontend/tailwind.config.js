/** @type {import('tailwindcss').Config} */
export default {
  // Указываем Tailwind, где искать наши классы
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Подключаем "обтекаемый шрифт", который мы добавили в index.html
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      // Цветовая палитра из ТЗ: оранжево-желтое, коричневые и белые цвета
      colors: {
        gnezdo: {
          orange: '#FF8A00', // Яркий оранжевый для акцентов и кнопок мэтча
          yellow: '#FFC837', // Теплый желтый для градиентов
          brown: {
            light: '#8B5A2B',
            DEFAULT: '#5C3A21', // Основной коричневый для текста
            dark: '#3E2723',
          },
          white: '#FFFFFF',
          bg: '#FFFDF5', // Очень светлый желтоватый фон
        }
      },
      // Настраиваем тени для эффекта "жидкого стекла" (glassmorphism)
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(255, 138, 0, 0.15)', // Мягкая оранжевая тень
        'glass-card': '0 4px 15px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.3)',
      },
      // Кастомные классы размытия для "заблюренных" анкет без подписки
      blur: {
        'xs': '2px',
        'glass': '12px',
      }
    },
  },
  plugins: [],
}