/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './hooks/**/*.{js,jsx}',
    './data/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        night: '#080a10',
        pulse: '#1db954',
        neonPink: '#ff3df2',
        neonBlue: '#39d0ff',
        violet: '#8b5cf6',
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(30, 215, 96, 0.22)',
        pinkGlow: '0 0 44px rgba(255, 61, 242, 0.18)',
      },
      backgroundImage: {
        'radial-grid': 'radial-gradient(circle at top left, rgba(57, 208, 255, 0.22), transparent 26%), radial-gradient(circle at 80% 20%, rgba(255, 61, 242, 0.18), transparent 28%), radial-gradient(circle at 50% 90%, rgba(30, 215, 96, 0.14), transparent 28%)',
      },
    },
  },
  plugins: [],
};
