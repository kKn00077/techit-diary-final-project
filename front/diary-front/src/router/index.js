import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '../views/Layouts/AuthLayout.jsx'
import LoginView from '@/views/pages/LoginView.jsx'
import JoinView from '@/views/pages/JoinView.jsx'
import MyDiaryView from '@/views/pages/MyDiaryView.jsx'
import MainLayout from '../views/Layouts/MainLayout.jsx'

import Marker from '@/assets/icon/filled/marker.svg'
import Book from '@/assets/icon/filled/book.svg'
import User from '@/assets/icon/filled/user.svg'
import CloseRec from '@/assets/icon/filled/close-rectangle.svg'
import AccountInfoView from '@/views/pages/AccountInfoView.jsx'
import WriteView from '@/views/pages/WriteView.jsx'
import DetailView from '@/views/pages/DetailView.jsx'
import api from '@/api/index.js'
import Cookies from 'js-cookie'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/auth',
			component: AuthLayout,
			redirect: '/auth/login',
			children: [
				{
					path: 'login',
					component: () => LoginView,
					meta: {}
				},
				{
					path: 'join',
					component: () => JoinView,
					meta: {}
				}
			]
		},
		{
			path: '/diary',
			component: MainLayout,
			redirect: '/diary/list',
			children: [
				{
					path: 'list',
					component: () => MyDiaryView,
					meta: {
						is_show: true,
						title: '내 일기',
						icon: Book,
						requiresAuth: true
					}
				},
				{
					path: 'write',
					component: () => WriteView,
					meta: {
						is_show: true,
						title: '일기 쓰기',
						icon: Marker,
						requiresAuth: true
					}
				},
				{
					path: 'detail/:id',
					component: () => DetailView,
					meta: {
						is_show: false,
						title: '내 일기',
						icon: Book,
						requiresAuth: true
					}
				}
			]
		},
		{
			path: '/account',
			component: MainLayout,
			children: [
				{
					path: 'info',
					component: () => AccountInfoView,
					meta: {
						is_show: true,
						title: '내 정보',
						icon: User,
						requiresAuth: true
					}
				},
				{
					path: 'logout',
					meta: {
						is_show: true,
						title: '로그아웃',
						icon: CloseRec,
						requiresAuth: true
					}
				}
			]
		}
	]
})

// 로그인 여부 확인
router.beforeEach((to, from, next) => {
	const isLoggedIn = Cookies.get('is_login') !== undefined

	console.log(isLoggedIn)

	if (to.path === '/') {
		return next(isLoggedIn ? '/diary/list' : '/auth/login')
	} else if (
		!(to.path === '/auth/login' || to.path === '/auth/join') &&
		to.meta.requiresAuth &&
		!isLoggedIn
	) {
		return next('/auth/login')
	}

	next()
})

// 로그아웃 네비게이션 가드 추가
router.beforeEach((to, from, next) => {
	if (to.path === '/account/logout') {
		// 로그아웃 함수 호출
		logoutUser()
		// 로그인 페이지로 리다이렉트
		next('/auth/login')
	} else {
		next() // 다른 경로는 그대로 이동
	}
})

async function logoutUser() {
	try {
		// TODO: URL Change
		const response = await api.post('http://localhost:5000/auth/logout')
		alert(response.data.body.message)

		// 쿠키 삭제
		Cookies.remove('is_login')
	} catch (error) {
		// 에러 메시지 처리
		const msg =
			error.response?.data?.body?.error?.message ||
			'오류가 발생했어요! 새로고침 후 다시 시도해주세요! T.T'
		console.log(error)
		alert(msg)
	}
}

export default router
