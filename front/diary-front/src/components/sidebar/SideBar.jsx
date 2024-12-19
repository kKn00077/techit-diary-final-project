import Logo from '../Logo'
import Menu from './Menu'

import Footer from '../Layout/Footer'
import { useRouter } from 'vue-router'

export default function SideBar() {
	const route = useRouter()
	const menus = route.options.routes.filter((item) => item.path !== '/auth')

	return (
		<nav class="w-72 bg-Black-black-200 h-screen border-r border-Purple-purple-100 flex flex-col gap-6 py-6 px-5">
			<Logo type={2} />

			{menus.map((group, index) => {
				return (
					<div key={group.path}>
						<div class="flex flex-col gap-4">
							{group.children.map((menu) => {
								return (
									<Menu
										url={group.path + '/' + menu.path}
										leftIcon={menu.meta.icon}
										key={menu.path}>
										{menu.meta.title}
									</Menu>
								)
							})}
						</div>
						{index < menus.length - 1 && <hr class="border-purple-300 mt-6" />}
					</div>
				)
			})}

			<Footer mode={1} />
		</nav>
	)
}
