import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '../views/Layouts/AuthLayout.jsx'
import LoginView from '@/views/pages/LoginView.jsx'
import JoinView from '@/views/pages/JoinView.jsx'

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
					component: () => LoginView
				},
				{
					path: 'join',
					component: () => JoinView
				}
			]
		}
	]
})

export default router
