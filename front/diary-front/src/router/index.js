import { createRouter, createWebHistory } from 'vue-router'
import Marker from '@/assets/icon/filled/marker.svg'
import Book from '@/assets/icon/filled/book.svg'
import User from '@/assets/icon/filled/user.svg'
import CloseRec from '@/assets/icon/filled/close-rectangle.svg'
import Cookies from 'js-cookie'
import { logoutUser } from '@/lib/utils.js'
import AuthLayout from '@/views/Layouts/AuthLayout.jsx'
import MainLayout from '@/views/Layouts/MainLayout.jsx'

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
					component: () => import('@/views/pages/LoginView.jsx'),
					meta: {}
				},
				{
					path: 'join',
					component: () => import('@/views/pages/JoinView.jsx'),
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
					component: () => import('@/views/pages/MyDiaryView.jsx'),
					meta: {
						is_show: true,
						title: '내 일기',
						icon: Book, // 동기 처리
						requiresAuth: true
					}
				},
				{
					path: 'write',
					component: () => import('@/views/pages/WriteView.jsx'),
					meta: {
						is_show: true,
						title: '일기 쓰기',
						icon: Marker, // 동기 처리
						requiresAuth: true
					}
				},
				{
					path: 'detail/:id',
					component: () => import('@/views/pages/DetailView.jsx'),
					meta: {
						is_show: false,
						title: '내 일기',
						icon: Book, // 동기 처리
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
					component: () => import('@/views/pages/AccountInfoView.jsx'),
					meta: {
						is_show: true,
						title: '내 정보',
						icon: User, // 동기 처리
						requiresAuth: true
					}
				},
				{
					path: 'logout',
					component: () => import('@/views/pages/LogoutView.jsx'),
					beforeEnter: async (to, from, next) => {
						try {
							await logoutUser() // 로그아웃 작업이 완료될 때까지 대기
							next('/auth/login')
						} catch (error) {
							console.error('로그아웃 중 에러 발생:', error)
							next('/auth/login') // 에러 발생 시에도 안전하게 이동
						}
					},
					meta: {
						is_show: true,
						title: '로그아웃',
						icon: CloseRec, // 동기 처리
						requiresAuth: true
					}
				}
			]
		}
	]
})

// 로그인 여부 확인
router.beforeEach((to, from, next) => {
	try {
		const isLoggedIn = !!Cookies.get('is_login')

		if (to.path === '/') {
			next(isLoggedIn ? '/diary/list' : '/auth/login')
		} else if (to.meta.requiresAuth && !isLoggedIn) {
			Cookies.remove('is_login')
			next('/auth/login')
		} else {
			next()
		}
	} catch (error) {
		console.error('로그인 여부 확인 중 에러 발생:', error)
		next('/auth/login')
	}
})

export default router
