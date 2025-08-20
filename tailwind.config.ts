// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        testcolor: '#ff0000',
        red: {
          primary: '#dc2626',    // red-600
          text: '#ef4444',       // red-500
          hover: '#f87171',      // red-400
        },
        white: {
          primary: '#ffffffff',                  // white
          secondary: 'rgba(255, 255, 255, 0.9)', // white/90
          muted: 'rgba(250, 250, 250, 0.7)',     // white/70
          subtle: 'rgba(255, 255, 255, 0.4)',    // white/40
        },
        twitch: {
          primary: '#9333ea',    // purple-600
          hover: '#8b5cf6',      // purple-500
        },
        discord: {
          primary: '#4f46e5',    // indigo-600
          hover: '#6366f1',      // indigo-500
        },
        x: {
          primary: '#3b82f6',    // blue-600
          hover: '#60a5fa',      // blue-500
        },
        github: {
          primary: 'rgba(255, 255, 255, 0.9)',   // white/90
          hover: 'rgba(250, 250, 250, 0.7)',     // white/70
        },
        steam: {
          primary: '#3b82f6',    // blue-600
          hover: '#60a5fa',      // blue-500
        },
      },
    },
  },
  plugins: [],
};

export default config;