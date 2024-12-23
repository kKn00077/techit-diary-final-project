import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs) => {
	return twMerge(clsx(inputs))
}

export const formatDate = (dateString) => {
	const date = new Date(dateString)

	// Intl.DateTimeFormat으로 날짜와 요일 포맷
	const formatter = new Intl.DateTimeFormat('ko-KR', {
		year: '2-digit',
		month: '2-digit',
		day: '2-digit',
		weekday: 'short' // 요일을 짧게 표시 (월, 화 등)
	})

	const parts = formatter.formatToParts(date)
	const year = parts.find((part) => part.type === 'year').value
	const month = parts.find((part) => part.type === 'month').value
	const day = parts.find((part) => part.type === 'day').value
	const weekday = parts.find((part) => part.type === 'weekday').value

	return `${year}/${month}/${day} (${weekday})`
}
