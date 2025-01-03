import { RouterView } from 'vue-router'
import SideBar from '@/components/sidebar/SideBar'
import PageTitle from '@/components/Layout/PageTitle'

function MainLayout() {
	return (
		<div class="bg-gradient-to-br relative via-transparent via-40% from-Black-black-100 to-Purple-purple-100 w-screen h-screen flex">
			<SideBar />
			<main class="flex flex-col flex-1 overflow-auto px-12 py-12 gap-12">
				<PageTitle />
				<hr class="border-Purple-purple-200" />
				<RouterView />
			</main>
		</div>
	)
}

// displayName 추가
MainLayout.displayName = 'MainLayout'

export default MainLayout
