import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        rose: {
          950: '#1a0a0f',
        }
      }
    },
  },
  plugins: [],
}
export default config
