/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(240, 80%, 50%)',
        accent: 'hsl(180, 100%, 40%)',
        bg: 'hsl(230, 20%, 95%)',
        surface: 'hsl(0, 0%, 100%)',
        textPrimary: 'hsl(230, 20%, 20%)',
        textSecondary: 'hsl(230, 20%, 50%)',
        gradient: {
          from: 'hsl(240, 80%, 60%)',
          to: 'hsl(180, 100%, 50%)'
        }
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '40px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(230, 20%, 20%, 0.1)',
        'focus': '0 0 0 3px hsl(180, 100%, 40% / 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px hsl(180, 100%, 40%)' },
          '100%': { boxShadow: '0 0 20px hsl(180, 100%, 40%), 0 0 30px hsl(180, 100%, 40%)' },
        }
      }
    },
  },
  plugins: [],
}
