/** @type {import('tailwindcss').Config} */

// كل درجة تُبنى من متغير CSS واحد في src/style.css — غيّر القيمة هناك
// فقط لتغيير الثيم بالكامل. <alpha-value> يسمح باستخدام bg-primary-600/50 إلخ.
function themeColor(name) {
  return {
    50: `rgb(var(--color-${name}-50) / <alpha-value>)`,
    100: `rgb(var(--color-${name}-100) / <alpha-value>)`,
    200: `rgb(var(--color-${name}-200) / <alpha-value>)`,
    300: `rgb(var(--color-${name}-300) / <alpha-value>)`,
    400: `rgb(var(--color-${name}-400) / <alpha-value>)`,
    500: `rgb(var(--color-${name}-500) / <alpha-value>)`,
    600: `rgb(var(--color-${name}-600) / <alpha-value>)`,
    700: `rgb(var(--color-${name}-700) / <alpha-value>)`,
    800: `rgb(var(--color-${name}-800) / <alpha-value>)`,
    900: `rgb(var(--color-${name}-900) / <alpha-value>)`,
  }
}

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        page:    'rgb(var(--color-bg-page) / <alpha-value>)',
        surface: 'rgb(var(--color-bg-surface) / <alpha-value>)',
        // أسماء دلالية (يفضّل استخدامها بالكود الجديد)
        primary: themeColor('primary'),
        success: themeColor('success'),
        warning: themeColor('warning'),
        danger: themeColor('danger'),
        accent: themeColor('accent'),

        // نفس المتغيرات، بس تحت الأسماء الأصلية لـ Tailwind —
        // هذا يخلي كل bg-blue-600 / text-green-600 / إلخ الموجودة
        // فعلياً بالمشروع تتغيّر مع الثيم تلقائياً بدون تعديل أي ملف
        blue: themeColor('primary'),
        green: themeColor('success'),
        red: themeColor('danger'),
        yellow: themeColor('warning'),
        purple: themeColor('accent'),
      },
      fontFamily: {
        'sans-ar': ['"Noto Sans Arabic"', 'system-ui', 'sans-serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
