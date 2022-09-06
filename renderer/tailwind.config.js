/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = {
  content: [
    "./renderer/pages/**/*.{js,ts,jsx,tsx}",
    "./renderer/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/daisyui/dist/**/*.js",
    "./node_modules/react-daisyui/dist/**/*.js",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          "base-100": "#F9F9FA",
          "base-content": "#141426",
        },
      },
      {
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          "base-100": "#44454A",
        },
      },
    ],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
}
