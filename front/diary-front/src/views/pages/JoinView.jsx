import AuthCard from '@/components/auth/AuthCard'

function JoinView() {
	return (
		<div>
			<AuthCard type="join" />
		</div>
	)
}

// displayName 추가
JoinView.displayName = 'JoinView'

export default JoinView
