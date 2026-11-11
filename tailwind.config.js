/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAF7F0',
          50: '#FDFCF9',
          100: '#FAF7F0',
          200: '#F4EFE3',
        },
        beige: {
          DEFAULT: '#EDE3D3',
          50: '#FAF6F0',
          100: '#F5EFE6',
          200: '#EDE3D3',
          300: '#DFD1BD',
          400: '#CFBDA5',
          500: '#B8A185',
        },
        sage: {
          DEFAULT: '#9CAF88',
          50: '#F4F7F2',
          100: '#E6EDE1',
          200: '#CCDCC2',
          300: '#B4CCA7',
          400: '#9CAF88',
          500: '#7E9568',
          600: '#627750',
          700: '#4B5C3D',
        },
        forest: {
          DEFAULT: '#435B45',
          50: '#F2F5F2',
          100: '#E2EAE2',
          200: '#C5D5C6',
          300: '#67896A',
          400: '#537255',
          500: '#435B45',
          600: '#344936',
          700: '#273829',
          800: '#1D2A1F',
          900: '#141E15',
          950: '#0C130D',
        },
        terracotta: {
          DEFAULT: '#C98263',
          50: '#FBF5F2',
          100: '#F7E7E0',
          200: '#EECDC0',
          300: '#DC9D81',
          400: '#C98263',
          500: '#B16747',
          600: '#944E31',
          700: '#753A23',
        },
        softbrown: {
          DEFAULT: '#8B735E',
          100: '#EFECE9',
          200: '#D6CEC6',
          300: '#B3A495',
          400: '#8B735E',
          500: '#6E5743',
          600: '#554232',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(67, 91, 69, 0.06), 0 2px 6px -1px rgba(67, 91, 69, 0.04)',
        'soft-lg': '0 10px 30px -4px rgba(67, 91, 69, 0.08), 0 4px 12px -2px rgba(67, 91, 69, 0.05)',
        'soft-xl': '0 20px 40px -6px rgba(67, 91, 69, 0.12), 0 8px 16px -4px rgba(67, 91, 69, 0.06)',
      }
    },
  },
  plugins: [],
}

