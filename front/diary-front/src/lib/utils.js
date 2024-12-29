import api from '@/api'
import { clsx } from 'clsx'
import Cookies from 'js-cookie'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs) => {
	return twMerge(clsx(inputs))
}

export const formatDate = (dateString) => {
	const date = new Date(dateString)

	const formatter = new Intl.DateTimeFormat('ko-KR', {
		year: '2-digit',
		month: '2-digit',
		day: '2-digit',
		weekday: 'short'
	})

	const parts = formatter.formatToParts(date)
	const year = parts.find((part) => part.type === 'year').value
	const month = parts.find((part) => part.type === 'month').value
	const day = parts.find((part) => part.type === 'day').value
	const weekday = parts.find((part) => part.type === 'weekday').value

	return `${year}/${month}/${day} (${weekday})`
}

export async function logoutUser() {
	const controller = new AbortController()
	try {
		// TODO: URL Change
		const response = await api.post(
			'http://ec2-3-34-61-96.ap-northeast-2.compute.amazonaws.com:8000/auth/logout',
			{
				signal: controller.signal
			}
		)
		alert(response.data.body.message)

		Cookies.remove('is_login')
		localStorage.clear()
		sessionStorage.clear()

		return Promise.resolve() // 성공 시 명시적으로 Promise 반환
	} catch (error) {
		if (error.name === 'AbortError') {
			console.log('요청이 취소되었습니다:', error)
		} else {
			const msg =
				error.response?.data?.body?.error?.message ||
				'오류가 발생했어요! 새로고침 후 다시 시도해주세요! T.T'
			console.log(error)
			alert(msg)
		}
		return Promise.reject(error) // 실패 시 명시적으로 Promise 반환
	} finally {
		controller.abort()
	}
}
