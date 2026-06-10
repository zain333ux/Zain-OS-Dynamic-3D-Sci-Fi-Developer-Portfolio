/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDark: "#0D1315",
        cardBg: "rgba(22, 31, 34, 0.6)",
        cardBorder: "#273338",
        textPrimary: "#ECEFF1",
        textMuted: "#738587",
        accentPurple: "#9CB080", // Sage Green (Phosphor Primary)
        accentCyan: "#618764",   // Forest Green (Phosphor Secondary)
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        heading: ["Syne", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      boxShadow: {
        glowPurple: "0 0 15px rgba(156, 176, 128, 0.22)",
        glowCyan: "0 0 15px rgba(97, 135, 100, 0.22)",
      },
      animation: {
        'marquee-scroll': 'marquee-scroll 60s linear infinite',
      },
      keyframes: {
        'marquee-scroll': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-33.333333%)' }
        }
      }
    },
  },
  plugins: [],
}
