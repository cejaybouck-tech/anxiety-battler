import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './plugins/**/*.{js,ts}',
    './error.vue', 
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        // Calming palette for anxiety support
        primary: 'blue',
      }
    }
  },
  plugins: []
} satisfies Config
