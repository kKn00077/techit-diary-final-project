import Card from '@/components/Card/Card'
import CardContents from '@/components/Card/CardContents'
import CardHeader from '@/components/Card/CardHeader'
import EmogiLabel from '@/components/EmogiLabel'
import Minus from '@/assets/icon/filled/minus.svg'
import Archive from '@/assets/icon/filled/archive.svg'
import Button from '@/components/Button'
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'
import { formatDate } from '@/lib/utils'

export default defineComponent(() => {
	// 상태 정의
	const diary = ref({
		advice: 'Today I Feel.',
		contents: '',
		created_at: '',
		emotion: '중립',
		id: 0,
		tags: ['#Today', '#I', '#Feel'],
		title: ''
	})
	const errorMessage = ref('')
	const isLoading = ref(false)

	const router = useRouter()
	const route = useRoute()

	const loadData = async () => {
		try {
			// TODO: URL Change
			const response = await api.get(
				`http://localhost:5000/diary/detail/${route.params.id}`
			)

			console.log(response.data.body)

			diary.value = response.data.body.diary
		} catch (error) {
			errorMessage.value =
				error.response?.data?.body?.error?.message ||
				'일기 정보를 가져오는데 실패했어요! 새로고침 후 다시 접속해주세요! T.T'
			console.log(error)
			alert(errorMessage.value)
		}
	}

	const deleteDiary = async (id) => {
		try {
			isLoading.value = true

			// TODO: URL Change
			const response = await api.delete(
				`http://localhost:5000/diary/delete/${id}`
			)

			alert(response.data.body.message)

			router.push('/diary')

			// page 이동
		} catch (error) {
			errorMessage.value =
				error.response?.data?.body?.error?.message ||
				'일기 삭제에 실패했어요! 나중에 다시 시도해주세요! T.T'
			console.log(error)
			alert(errorMessage.value)
		} finally {
			isLoading.value = false
		}
	}

	// 컴포넌트 마운트 시 데이터 로드
	onMounted(() => {
		loadData()
	})

	return () => (
		<div class="flex flex-col gap-10">
			<Card className="p-10 gap-4 w-full">
				<CardHeader className="justify-between items-start gap-4">
					<div class="font-gowun-batang text-Black-black-1100 text-lg custom-text-lg">
						{diary.value.title}
					</div>
					<div class="flex flex-col gap-1 font-gowun-dodum">
						<div class=" text-Black-black-800 text-base custom-text-base text-right px-[10px]">
							{diary.value.created_at
								? formatDate(diary.value.created_at)
								: '날짜를 못 찾았어요!'}
						</div>
						<EmogiLabel id={diary.value.emotion} direction="row" />
					</div>
				</CardHeader>
				<CardContents
					className="font-gowun-dodum text-Black-black-1100 text-base custom-text-base items-start"
					html={diary.value.contents}></CardContents>
			</Card>
			<Card className="p-10 gap-4  w-full">
				<CardHeader className="gap-4 font-gowun-dodum items-center justify-between">
					<div class="flex gap-3 text-Black-black-1100 text-base custom-text-base">
						{diary.value.tags.map((tag) => (
							<span class="bg-Purple-purple-500 text-Black-black-200 rounded-rounded-8 py-2 px-4">
								{tag}
							</span>
						))}
					</div>
					<div class=" text-Black-black-900 text-base custom-text-base">
						{diary.value.advice}
					</div>
				</CardHeader>
			</Card>
			<div class="flex flex-row gap-3 justify-end">
				<Button
					leftIcon={Minus}
					onClick={(event) => {
						event.preventDefault() // LouterLink 클릭 이벤트 방지

						if (
							confirm('정말로 삭제하시겠어요? 한번 삭제하면 복구할 수 없어요!')
						) {
							deleteDiary(diary.value.id)
						}
					}}>
					삭제
				</Button>
				<RouterLink to="/diary">
					<Button variant="secondary" leftIcon={Archive}>
						일기 목록
					</Button>
				</RouterLink>
			</div>
		</div>
	)
})
