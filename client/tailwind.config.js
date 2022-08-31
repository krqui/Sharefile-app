/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    //purge:[
    //"./pages/**/*.{js,ts,jsx,tsx}",
    //"./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors:{
        yellow:{
          light:"#F3F7FD"
        }
      }
    },
  },
  //plugins: [],
}//8:03
