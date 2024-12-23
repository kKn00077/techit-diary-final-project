import { defineComponent, ref } from 'vue'
import TextBox from '../TextBox'
import Button from '../Button'
import Logo from '../Logo'
import api from '@/api'
import { RouterLink, useRouter } from 'vue-router'

export default defineComponent({
	name: 'AuthCard',
	props: {
		type: { type: String, default: 'login' } // 'login' or 'signup'
	},
	setup(props) {
		const router = useRouter()
		const isLogin = props.type === 'login'

		// 상태 정의
		const email = ref('')
		const password = ref('')
		const confirmPassword = ref('')
		const errorMessage = ref('')
		const isLoading = ref(false)

		const handleRegister = async () => {
			if (
				email.value === '' ||
				password.value === '' ||
				confirmPassword.value === ''
			) {
				errorMessage.value = '값을 모두 입력해주세요!'
				alert(errorMessage.value)
				return
			}

			if (password.value !== confirmPassword.value) {
				errorMessage.value = '비밀번호가 일치하지 않아요!'
				alert(errorMessage.value)
				return
			}

			isLoading.value = true

			try {
				// TODO: URL Change
				const response = await api.post('http://localhost:5000/auth/signup', {
					email: email.value,
					password: password.value,
					password_confirm: confirmPassword.value
				})

				alert(response.data.body.message)
			} catch (error) {
				errorMessage.value =
					error.response?.data?.body?.error?.message || '회원가입에 실패했어요!'
				alert(errorMessage.value)
			} finally {
				isLoading.value = false
			}
		}

		const handleLogin = async () => {
			if (email.value === '' || password.value === '') {
				errorMessage.value = '아이디와 패스워드를 입력해주세요!'
				alert(errorMessage.value)
				return
			}

			isLoading.value = true

			try {
				// TODO: URL Change
				const response = await api.post('http://localhost:5000/auth/login', {
					email: email.value,
					password: password.value
				})

				alert(response.data.body.message + '\n이제 다이어리를 작성해보세요!')

				// 회원가입 성공 후 리디렉션
				router.push('/diary')
			} catch (error) {
				console.log(error)
				errorMessage.value =
					error.response?.data?.body?.error?.message ||
					'계정을 다시 한번 확인해주세요!'
				alert(errorMessage.value)
			} finally {
				isLoading.value = false
			}
		}

		return () => (
			<div class="flex flex-row items-center justify-center w-screen h-screen">
				<div class="card rounded-rounded-6 flex flex-col py-12 px-12 gap-10">
					<Logo />

					{/* 입력 폼 */}
					<div class="flex flex-col gap-2">
						<TextBox
							type={1}
							placeholder="E-mail"
							modelValue={email.value}
							onUpdate:modelValue={(val) => (email.value = val)}
						/>
						<TextBox
							type={1}
							texttype="password"
							placeholder="Password"
							modelValue={password.value}
							onUpdate:modelValue={(val) => (password.value = val)}
						/>
						{!isLogin && (
							<TextBox
								type={1}
								texttype="password"
								placeholder="Confirm Password"
								modelValue={confirmPassword.value}
								onUpdate:modelValue={(val) => (confirmPassword.value = val)}
							/>
						)}
					</div>

					{/* 버튼 */}
					<div class="flex flex-col gap-2">
						{isLogin ? (
							<Button
								variant="primary"
								class="w-full"
								disabled={isLoading.value}
								onClick={() => {
									try {
										handleLogin()
									} catch (e) {
										console.error('Unexpected error in onClick:', e)
										alert('오류가 발생했어요! 나중에 다시 시도해주세요 T^T')
									}
								}}>
								{isLoading.value ? '로그인 중...' : '로그인'}
							</Button>
						) : (
							<Button
								variant="primary"
								class="w-full"
								disabled={isLoading.value}
								onClick={() => {
									try {
										handleRegister()
									} catch (e) {
										console.error('Unexpected error in onClick:', e)
										alert('오류가 발생했어요! 나중에 다시 시도해주세요 T^T')
									}
								}}>
								{isLoading.value ? '처리 중...' : '회원가입'}
							</Button>
						)}
						{isLogin && (
							<RouterLink to="/auth/join">
								<Button variant="secondary" class="w-full">
									회원가입
								</Button>
							</RouterLink>
						)}
					</div>
				</div>
			</div>
		)
	}
})
