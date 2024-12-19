import Logo from '../Logo'
import Menu from './Menu'
import Marker from '@/assets/icon/filled/marker.svg'
import Book from '@/assets/icon/filled/book.svg'
import User from '@/assets/icon/filled/user.svg'
import CloseRec from '@/assets/icon/filled/close-rectangle.svg'
import Footer from '../Layout/Footer'

export default function SideBar() {
	return (
		<nav class="w-72 bg-Black-black-200 h-screen border-r border-Purple-purple-100 flex flex-col gap-6 py-6 px-5">
			<Logo type={2} />

			<div class="flex flex-col gap-4">
				<Menu url="/diary/list" leftIcon={Book}>
					내 일기
				</Menu>
				<Menu url="/diary/write" leftIcon={Marker}>
					일기 쓰기
				</Menu>
			</div>

			<hr class="border-purple-300" />

			<div class="flex flex-col gap-4">
				<Menu url="/diary/account" leftIcon={User}>
					내 계정
				</Menu>
				<Menu url="/auth/logout" leftIcon={CloseRec}>
					로그아웃
				</Menu>
			</div>

			<Footer mode={1} />
		</nav>
	)
}
