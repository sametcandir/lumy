/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        plush: {
          50: '#fffbf5',
          100: '#fff5e6',
          200: '#fedfb2',
          300: '#fdc67d',
          400: '#fba548',
          500: '#f6841e',
          600: '#db6512',
          700: '#b44810',
          800: '#903914',
          900: '#753114',
        },
        teddy: {
          50: '#faf6f0',
          100: '#f2e9dc',
          200: '#e3d2be',
          300: '#d0b59b',
          400: '#bd9678',
          500: '#ad7e5f',
          600: '#9c6a51',
          700: '#7e5241',
          800: '#674438',
          900: '#553930',
        },
        pastel: {
          pink: '#FFE5EC',
          rose: '#FB6F92',
          yellow: '#FEF9D9',
          mint: '#D8F3DC',
          blue: '#E0F2FE',
          lavender: '#E8EAFF',
        }
      },
      fontFamily: {
        sans: ['var(--font-fredoka)', 'system-ui', '-apple-system', 'sans-serif'],
        bubble: ['var(--font-bubble)', 'cursive', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      boxShadow: {
        'soft': '0 10px 30px -5px rgba(235, 130, 60, 0.08), 0 5px 15px -3px rgba(0, 0, 0, 0.04)',
        'float': '0 20px 40px -10px rgba(246, 132, 30, 0.15)',
        'button': '0 8px 0px 0px rgba(219, 101, 18, 1)',
        'button-hover': '0 4px 0px 0px rgba(219, 101, 18, 1)',
      }
    },
  },
  plugins: [],
}
