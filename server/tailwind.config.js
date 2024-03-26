/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.ejs'],
  theme: {
    screens: {
      '2xl':{'max': '1536px'},
      'xl': {'max': '1280px'},
      'lg': {'max': '1024px'},
      'md': {'max': '800px'},
      'sm': {'max': '640px'},
      'xs': {'max': '500px'},
    },
    
    extend: {
      backgroundImage: {
        'pattern': "url(/src/assets/img/background.jpg)",
      },
      spacing: {
        '0.05': '0.2px', 
        'icon': '14px',
        '11.75': '2.9375rem',
        '18': '4.5rem',
        '25': '6.25rem',
        '41': '164px',
        '42': '168px',
        '62': '15.5rem',
        '62.5': '15.625rem',
        '75': '18.75rem',
        '76': '19rem',
        '84': '21rem',
        '90': '22.5rem',
        '100': '25rem',
        '110': '27.5rem',
        '125': '31.25rem',
        '128': '32rem',
        '144': '36rem',
        '148': '37rem',
        '160': '40rem',
        '240': '60rem',
      },
      borderWidth: {
        '-3': '-3px',
        '0.5': '0.5px',
        '1': '1px',
      },
      colors: {
        'submit-button': '#263238',
        'main': '#FAFFFB',
        'body': '#D0E9D7',
        'main-img': '#E6FEED',
        'brand-title': '#75f57e',
        'brand-title2': '#5cdb65',

      },
      fontSize: {
        'xxs': '.625rem',
      },
    },
  },
  plugins: [],
}
