/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0B',
        card: '#1E1E1F',
        gold: '#B48C58',
        platinum: '#6E7F8A',
        wine: '#722F37',
        petroleum: '#0F4C81',
        crypto: '#00FFD1',
        alert: '#FF3B3B'
      },
      backgroundImage: {
        'metal-gradient': 'linear-gradient(135deg, #1E1E1F 0%, #0A0A0B 100%)',
        'gold-sheen': 'linear-gradient(135deg, #B48C58 0%, #7a5d3b 100%)'
      }
    }
  },
  plugins: []
}
