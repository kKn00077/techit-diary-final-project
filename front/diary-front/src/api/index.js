// src/api/index.js
import axios from 'axios'

const api = axios.create({
	baseURL: 'http://localhost:5000/', // 기본 URL
	timeout: 5000, // 요청 타임아웃
	headers: {
		'Content-Type': 'application/json'
	}
})

export default api
