/** @type {import('tailwindcss').Config} */
export default {
  // Usamos modo oscuro basado en clase 'dark' que se aplica al <html> o <body>
  darkMode: 'class',

  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      screens: {
        'xs': '475px',  // Breakpoint extra pequeño para móviles
      },
      colors: {
        primary: '#121212',        // Fondo oscuro principal
        secondary: '#1a1a1a',      // Fondo oscuro ligeramente más claro
        accent: '#ec4d58',         // Color rojo/acento
        highlight: '#00ffb3',      // Verde azulado para highlights
        gold: '#ffd700',           // Color dorado
        'highlight-5': 'rgba(0, 255, 179, 0.05)',
        'highlight-8': 'rgba(0, 255, 179, 0.08)',
        'highlight-10': 'rgba(0, 255, 179, 0.1)',
        // Colores específicos del tema oscuro
        'dark-bg': '#121212',
        'dark-card': '#1a1a1a',
        'dark-border': '#232323',
        'dark-text': '#ffffff',
        'dark-text-secondary': '#9ca3af',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        exo: ['Exo 2', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },

  plugins: [],
}
