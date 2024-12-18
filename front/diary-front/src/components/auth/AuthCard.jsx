import Logo from '../Logo'
import TextBox from '../TextBox'

export default function AuthCard({ type = 'login' }) {
	return (
		<div class="flex flex-row items-center justify-center w-screen h-screen">
			<div class="card rounded-rounded-6 flex flex-col py-12 px-12 gap-10">
				<Logo />

				<div class="flex flex-col gap-2">
					<TextBox type={1} placeholder="E-mail" class="w-full" />
					<TextBox type={1} placeholder="Password" class="w-full" />
				</div>
			</div>
		</div>
	)
}