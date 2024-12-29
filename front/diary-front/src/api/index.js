// src/api/index.js
import axios from 'axios'

const api = axios.create({
	baseURL: 'http://ec2-3-34-61-96.ap-northeast-2.compute.amazonaws.com:8000/', // 기본 URL
	timeout: 5000, // 요청 타임아웃
	withCredentials: true, // 쿠키를 자동으로 포함하고 저장
	headers: {
		'Content-Type': 'application/json'
	}
})

// Axios 요청을 AbortController와 함께 사용하는 헬퍼 함수 추가
api.interceptors.request.use(
	(config) => {
		if (config.signal) {
			config.signal.addEventListener('abort', () => {
				config.cancelToken = axios.CancelToken.source()
				config.cancelToken.cancel('Request aborted')
			})
		}
		return config
	},
	(error) => Promise.reject(error)
)

export default api
