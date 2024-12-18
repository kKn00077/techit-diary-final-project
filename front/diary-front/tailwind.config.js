/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,jsx,vue}'],
	theme: {
		extend: {
			colors: {
				Purple: {
					'purple-50': '#f0f0f7',
					'purple-100': '#d0d0e5',
					'purple-200': '#b9b9d8',
					'purple-300': '#9899c7',
					'purple-400': '#8585bc',
					'purple-500': '#6667ab',
					'purple-600': '#5d5e9c',
					'purple-700': '#484979',
					'purple-800': '#38395e',
					'purple-900': '#2b2b48'
				},
				Black: {
					'black-100': '#ffffff',
					'black-200': '#fcfcfc',
					'black-300': '#f5f5f5',
					'black-400': '#f0f0f0',
					'black-500': '#d9d9d9',
					'black-600': '#bfbfbf',
					'black-700': '#8c8c8c',
					'black-800': '#595959',
					'black-900': '#454545',
					'black-1000': '#262626',
					'black-1100': '#1f1f1f',
					'black-1200': '#141414',
					'black-1300': '#000000'
				}
			},
			fontSize: {
				xs: '0.625rem',
				sm: '0.8125rem',
				base: '1rem',
				md: '1.25rem',
				lg: '1.5625rem',
				xl: '1.9375rem',
				'2xl': '2.4375rem',
				'3xl': '3.0625rem',
				'4xl': '3.8125rem'
			},
			fontFamily: {
				'gowun-batang': 'Gowun Batang',
				'gowun-dodum': 'Gowun Dodum'
			},
			boxShadow: {
				card: '4px 4px 16px 0px rgba(208,208,229,1)'
			},
			borderRadius: {
				'rounded-0': '0rem',
				'rounded-1': '0.3125rem',
				'rounded-2': '0.4375rem',
				'rounded-3': '0.5rem',
				'rounded-4': '0.75rem',
				'rounded-5': '1rem',
				'rounded-6': '1.25rem',
				'rounded-7': '1.5rem',
				'rounded-8': '1.75rem',
				'rounded-9': '3.5rem',
				'rounded-10': '4.5rem'
			}
		}
	},
	plugins: []
}
