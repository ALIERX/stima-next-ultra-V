// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#0B0C0D",       // sfondo principale
        panel: "#212426",     // card Synth
        graphite: "#343739",
        white3: "#8C8E8F",
        copper: {
          300: "#F9D3B4",
          400: "#D9896A",
          600: "#945439",
        },
        emerald: "#BDD253",
      },
      boxShadow: {
        "neu-out": "-6px -6px 12px rgba(255,255,255,0.04), 6px 6px 12px rgba(0,0,0,0.16)",
        "neu-in": "inset -4px -4px 8px rgba(255,255,255,0.02), inset 4px 4px 12px rgba(0,0,0,0.32)",
      },
      borderRadius: {
        pill: "100px",
      },
      backdropBlur: {
        synth: "6px",
      },
    },
  },
  plugins: [],
}
