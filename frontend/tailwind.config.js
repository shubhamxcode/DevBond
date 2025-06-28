module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Ensure TypeScript files are included
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
        'blob': 'blob 7s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'typing-bounce': 'typing-bounce 1.4s infinite ease-in-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideInRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideInLeft: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(147, 51, 234, 0.5)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(147, 51, 234, 0.8), 0 0 30px rgba(147, 51, 234, 0.6)',
          },
        },
        'typing-bounce': {
          '0%, 80%, 100%': {
            transform: 'scale(0)',
          },
          '40%': {
            transform: 'scale(1)',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      colors: {
        'chat-purple': {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(147, 51, 234, 0.3)',
        'glow-lg': '0 0 40px rgba(147, 51, 234, 0.4)',
      },
    },
  },
  plugins: [],
};
