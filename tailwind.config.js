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
        sans: ['var(--font-raleway)'],
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
daisyui: {
    themes: [
      'garden',
      'dim',
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

  plugins: [require('@tailwindcss/typography'), require("daisyui")],
}
