/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        gray: {
          default: "#F3EFE3",
          light: "#DAE5DF",
          dark: "#707070",
          input: "#EBEAED",
          card: "#f6f6f6",
          placeholder: "#5C5C5C",
        },
        yellow: {
          light: "#FFD801",
          dark: "#F6BF00",
        },
        green: {
          default: "#2B4B40",
          light: "#4B6558",
          dark: "#13261F",
        },
        default: "#DAE5DF",
      },
    },
  },
  plugins: [
    import("tailwindcss-animate"),
    function ({ addVariant }) {
      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
    },
  ],
};
