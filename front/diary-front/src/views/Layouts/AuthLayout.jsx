import { RouterView } from 'vue-router'
import backgroundImg from '@/assets/img/background-img.png'
import Footer from '@/components/Layout/Footer'

export default function AuthLayout() {
	return (
		<div class="bg-purple-50 relative w-screen h-screen">
			<div
				class="bg-cover absolute bg-center bg-auto bg-contain w-screen h-screen opacity-25"
				style={{ backgroundImage: `url(${backgroundImg})` }}></div>

			<main>
				<RouterView class="relative z-100" />
			</main>

			<Footer mode={0} />
		</div>
	)
}
