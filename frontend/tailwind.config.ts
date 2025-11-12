import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a73e8',
          50: '#e3f2fd',
          100: '#bbdefb',
          500: '#1a73e8',
          700: '#1565c0',
          900: '#0d47a1',
        },
        secondary: '#fbbc04',
        success: '#34a853',
        danger: '#ea4335',
        nfl: '#013369',
        nba: '#17408B',
        mlb: '#041E42',
        wnba: '#C8102E',
        soccer: '#00B140',
      },
    },
  },
  plugins: [],
}
export default config
