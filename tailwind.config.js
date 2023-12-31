/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ], 
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
daisyui: {
    themes: 
    [
      'light',
      'autumn',
      'retro',
      'cupcake',
      'emerald',
      'lofi',
      'garden',
      'cmyk',
      'pastel',
      'winter',
      'nord',
      'dark',
      'synthwave',
      'dracula',
      'black',
      'night',
      'dim',
      'sunset',
      'business',
      'cyberpunk',
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "mediumseagreen",
          secondary: "darkslategrey",
        },
      },
      {
        mytheme: {
          "primary": "#22c55e",
          "secondary": "#22d3ee",
          "accent": "#fbbf24",
          "neutral": "#222222",
          "base-100": "#020202",
          "base-200": "#111111",
          "base-300": "#333333",
          "info": "#67e8f9",
          "success": "#a3e635",
          "warning": "#fb923c",
          "error": "#ef4444",
        },
      },
    ],
  },

  plugins: [require('@tailwindcss/typography'), require('tailwindcss-neumorphism'), require("daisyui")],
}
