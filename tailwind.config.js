import { transform } from 'framer-motion';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "2rem",
        xl: "3rem",
        "2xl": "4rem",
      },
    },
    extend: {
      animation: {
        "loop-scroll": "loop-scroll 70s linear infinite",
        "ping-custom": "ping-custom 1.5s ease-in-out infinite",
        'scroll-appear': 'scroll-appear linear',
      },
      keyframes: {
        "loop-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
        "ping-custom": { 
          "0%, 100%": {
            transform: "scale(0.8)",
            backgroundColor: "#b3d4fc",
            boxShadow: "0 0 0 0 rgba(178, 212, 252, 0.7)",
          },
          "50%": {
            transform: "scale(1.2)",
            backgroundColor: "#6793fb",
            boxShadow: "0 0 0 10px rgba(178, 212, 252, 0)",
          },
        },
        'scroll-appear': {
          '0%': {
            opacity: '0',
            clipPath: 'inset(100% 100% 100% 100%)',
          },
          '100%': {
            opacity: '100',
            clipPath: 'inset(0 0 0 0)',
          },
        },
      },
       colors: {
        // 🔵 Primary Theme
        primary: '#2a56d1', // Main brand color - header, active items
        primaryDark: '#173eac', // For hover, active states, buttons
        primaryLight: '#E0F0FF', // Light background with tint of blue
        hoverPrimary:'#1944bf',
        // 🟠 Accent / Secondary
        secondary: '#F59E0B', // Call-to-action buttons, highlights (orange)
        secondaryLight: '#FFF5E5', // Light orange background for cards, notices

        // ⚪ Backgrounds
        background: '#FFFFFF', // Main app background
        backgroundLight: '#F3F4F6', // For cards, form backgrounds
        backgroundDark: '#D1D5DB', // For borders, dividers

        // 🔤 Text
        textWhite: '#FFFFFF',
        textDark: '#1F2937', // Headings, primary body text
        textLight: '#6B7280',
        iconColor:'#1D4ED8', // Subtext, placeholder text

        // ❗ Status Colors
        success: '#10B981', // Green - success messages
        warning: '#FBBF24', // Yellow - warnings
        danger: '#FB4141', // Red - errors, critical alerts
        info: '#60A5FA', // Light blue - informational messages

        // 🎨 Utility
        muted: '#9CA3AF', // Muted gray text
        border: '#E5E7EB', // Default border color
      },
      // colors: {
      //   // schoolTitle: "var(--school-title)",
      //   // schoolAddress: "var(--school-address)",
      //   // sidebarBg: "var(--sidebar-bg)",
      //   // sischoolTitledebarText: "var(--sidebar-text)",
      //   // sidebarHover: "var(--sidebar-hover)",
      //   // sidebarIcon: "var(--sidebar-icon)",
      //   // generalBG: "var(--general-bg)",
      //   // secondaryBG: "var(--secondary-bg)",
      //   // whiteBg: "var(--white-bg)",
      //   // primary: "var(--primary)",
      //   // secondary: "var(--secondary)",
      //   // third: "var(--third)",
      //   // title: "var(--title)",
      //   // subTitle: "var(--sub-title)",
      //   // tWhite: "var(--t-white)",
      //   // tGray: "var(--t-gray)",
      //   // btBG: "var(--bt-bg)",
      //   // presentColor: "var(--present-color)",
      //   // absentColor: "var(--absent-color)",
      //   // boysColor: "var(--boys-color)",
      //   // girlsColor: "var(--girls-color)",
      // },
      fontFamily: {
        sans: ["Outfit","Inter", "Roboto", "sans-serif"],
        Caveat: ["Caveat"],
        Outfit: ["Outfit", "sans-serif"],
        serif: ["Merriweather", "serif"],
        mono: ["Fira Code", "monospace"],
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem",
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px",
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [
 
  ],
};
