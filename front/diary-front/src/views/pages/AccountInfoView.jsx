import api from '@/api'
import DeleteLabel from '@/assets/icon/filled/delete-label.svg'
import Button from '@/components/Button'
import Card from '@/components/Card/Card'
import CardContents from '@/components/Card/CardContents'
import CardHeader from '@/components/Card/CardHeader'
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import EmotionChart from '@/components/EmotionChart'

export default defineComponent(() => {
	const router = useRouter()

	// 상태 정의
	const email = ref('')
	const weekly = ref([])
	const distribution = ref([])
	const errorMessage = ref('')
	const isUnmounted = ref(false) // 컴포넌트 언마운트 상태를 추적

	const loadEmail = async () => {
		try {
			if (isUnmounted.value) {
				return
			}

			// TODO: URL Change
			const response = await api.get(
				'http://ec2-3-34-61-96.ap-northeast-2.compute.amazonaws.com:8000/auth/myinfo'
			)

			console.log(response.data.body.message)

			email.value = response.data.body.info.email
		} catch (error) {
			errorMessage.value =
				error.response?.data?.body?.error?.message ||
				'계정 정보를 가져오는데 실패했어요! 새로고침 후 다시 접속해주세요! T.T'
			console.log(error)
			alert(errorMessage.value)
		}
	}

	const weeklyScore = async () => {
		try {
			if (isUnmounted.value) {
				return
			}

			// TODO: URL Change
			const response = await api.get(
				'http://ec2-3-34-61-96.ap-northeast-2.compute.amazonaws.com:8000/diary/score'
			)

			console.log(response.data.body.message)

			weekly.value = response.data.body.data
		} catch (error) {
			errorMessage.value =
				error.response?.data?.body?.error?.message ||
				'차트 정보를 가져오는데 실패했어요! 새로고침 후 다시 접속해주세요! T.T'
			console.log(error)
			console.log(errorMessage.value)
		}
	}

	const distributionScore = async () => {
		try {
			if (isUnmounted.value) {
				return
			}

			// TODO: URL Change
			const response = await api.get(
				'http://ec2-3-34-61-96.ap-northeast-2.compute.amazonaws.com:8000/diary/distribution'
			)

			console.log(response.data.body.message)

			distribution.value = response.data.body.data
		} catch (error) {
			errorMessage.value =
				error.response?.data?.body?.error?.message ||
				'차트 정보를 가져오는데 실패했어요! 새로고침 후 다시 접속해주세요! T.T'
			console.log(error)
			console.log(errorMessage.value)
		}
	}

	const accountDelete = async () => {
		try {
			if (isUnmounted.value) {
				return
			}

			// TODO: URL Change
			const response = await api.delete(
				'http://ec2-3-34-61-96.ap-northeast-2.compute.amazonaws.com:8000/auth/delete'
			)

			alert(response.data.body.message)

			router.push('/account/logout')
		} catch (error) {
			errorMessage.value =
				error.response?.data?.body?.error?.message ||
				'탈퇴 처리 중에 오류가 발생했어요! 새로고침 후 다시 시도해주세요! T.T'
			console.log(error)
			alert(errorMessage.value)
		}
	}

	// 컴포넌트 마운트 시 데이터 로드
	onMounted(() => {
		if (isUnmounted.value) {
			return // 방어 코드 추가
		}
		loadEmail()
		weeklyScore()
		distributionScore()
	})

	onBeforeUnmount(() => {
		email.value = ''
		weekly.value = []
		distribution.value = []
		errorMessage.value = ''
		isUnmounted.value = true // 언마운트 상태로 설정
	})

	return () => (
		<div class="flex flex-col gap-10">
			<Card className="p-10">
				<CardHeader className="justify-between">
					<div class="flex flex-col gap-4 font-gowun-dodum items-start">
						<div class=" text-Black-black-1100 text-lg custom-text-lg">
							계정 정보
						</div>
						<div class=" text-Black-black-900 text-base custom-text-base">
							{email.value}
						</div>
					</div>
				</CardHeader>
			</Card>

			<Card className="p-10 gap-4">
				<CardHeader className="gap-4 font-gowun-dodum items-center justify-between">
					<div class=" text-Black-black-1100 text-lg custom-text-lg">
						이번 주 감정 그래프
					</div>
					<div class=" text-Black-black-900 text-base custom-text-base">
						이번 주에 당신이 느낀 감정을 한 눈에 확인해보세요!
					</div>
				</CardHeader>
				<CardContents className="items-start">
					{weekly.value.length > 0 ? (
						<EmotionChart
							type="line"
							labels={weekly.value.map((item) => item.day)}
							data={weekly.value.map((item) => item.average_score)}
							counts={weekly.value.map((item) => item.count)}
							options={{
								scales: {
									x: {
										ticks: { font: { size: 14 } }
									},
									y: {
										beginAtZero: true,
										max: 10,
										ticks: { font: { size: 14 } }
									}
								}
							}}
						/>
					) : (
						<div class="text-Black-black-900 text-center text-base custom-text-base">
							이번 주 데이터가 없습니다. 기록을 시작해보세요!
						</div>
					)}
				</CardContents>
			</Card>

			<Card className="p-10 gap-4">
				<CardHeader className="gap-4 font-gowun-dodum items-center justify-between">
					<div class=" text-Black-black-1100 text-lg custom-text-lg">
						감정별 분포
					</div>
					<div class=" text-Black-black-900 text-base custom-text-base">
						특정 감정을 얼마나 느꼈는지 궁금하지 않으세요?
					</div>
				</CardHeader>
				<CardContents className="items-start">
					{distribution.value.length > 0 ? (
						<EmotionChart
							type="bar"
							labels={distribution.value.map((item) => item.emotion)}
							data={distribution.value.map((item) => item.percentage)}
							counts={distribution.value.map((item) => item.count)}
							options={{
								scales: {
									x: {
										ticks: { display: false }
									},
									y: {
										beginAtZero: true,
										max: 100,
										ticks: {
											callback: (value) => `${value}%`,
											font: { size: 14 }
										}
									}
								}
							}}
						/>
					) : (
						<div class="text-Black-black-900 text-center text-base custom-text-base">
							분석할 감정 데이터가 없습니다. 감정을 기록해보세요!
						</div>
					)}
				</CardContents>
			</Card>

			<Card className="p-10">
				<CardHeader className="justify-between gap-4">
					<div class="flex flex-col gap-4 font-gowun-dodum">
						<div class=" text-Black-black-1100 text-lg custom-text-lg">
							계정 탈퇴
						</div>
						<div class=" text-Black-black-900 text-base custom-text-base">
							계정은 한번 탈퇴하면 복구할 수 없어요!
						</div>
					</div>
					<Button
						rightIcon={DeleteLabel}
						onClick={() => {
							if (confirm('정말 저희들을 떠나실 건가요? T.T')) {
								accountDelete()
							}
						}}>
						계정 탈퇴
					</Button>
				</CardHeader>
			</Card>
		</div>
	)
})
