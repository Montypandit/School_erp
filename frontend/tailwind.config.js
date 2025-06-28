// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
   safelist: [
    'text-blue-600', 'text-emerald-600', 'text-yellow-600', 'text-red-600', 'text-gray-600',
    'text-blue-500', 'text-emerald-500', 'text-yellow-500', 'text-red-500', 'text-gray-500',
    // Add any other dynamic classes you use
  ],
};