import { defineConfig } from 'cypress'

export default defineConfig({
	e2e: {
		specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
		baseUrl:
			'http://ec2-3-34-61-96.ap-northeast-2.compute.amazonaws.com:8000:4173'
	}
})
