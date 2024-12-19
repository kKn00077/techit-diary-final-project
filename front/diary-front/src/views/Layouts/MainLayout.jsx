import { RouterView } from 'vue-router'
import SideBar from '@/components/sidebar/SideBar'

export default function AuthLayout() {
	return (
		<div class="bg-gradient-to-br relative via-transparent via-40% from-Black-black-100 to-Purple-purple-100 w-screen h-screen flex">
			<SideBar />
			<main class="flex-1 overflow-auto">
				<RouterView />
			</main>
		</div>
	)
}
