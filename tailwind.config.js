/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDark: "#0B0F19",
        cardBg: "rgba(255, 255, 255, 0.04)",
        cardBorder: "rgba(255, 255, 255, 0.08)",
        textPrimary: "#F8FAFC",
        textMuted: "#94A3B8",
        accentPurple: "#7C3AED",
        accentCyan: "#06B6D4",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Outfit", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glowPurple: "0 0 15px rgba(124, 58, 237, 0.15)",
        glowCyan: "0 0 15px rgba(6, 182, 212, 0.15)",
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
