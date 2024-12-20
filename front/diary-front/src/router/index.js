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
					meta: { title: '내 일기', icon: Book }
				},
				{
					path: 'write',
					component: () => MyDiaryView,
					meta: { title: '일기 쓰기', icon: Marker }
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
					meta: { title: '내 정보', icon: User }
				},
				{
					path: 'logout',
					meta: { title: '로그아웃', icon: CloseRec }
				}
			]
		}
	]
})

export default router
