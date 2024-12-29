import AuthCard from '@/components/auth/AuthCard'

function LoginView() {
	return (
		<div>
			<AuthCard type="login" />
		</div>
	)
}

// displayName 추가
LoginView.displayName = 'LoginView'

export default LoginView
