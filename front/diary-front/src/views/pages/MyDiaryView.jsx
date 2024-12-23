import Card from '@/components/Card/Card'
import CardHeader from '@/components/Card/CardHeader'
import Minus from '@/assets/icon/filled/Minus.svg'
import CardContents from '@/components/Card/CardContents'
import EmogiLabel from '@/components/EmogiLabel'
import Logo from '@/components/Logo'
import Button from '@/components/Button'
import LeftArrow from '@/assets/icon/outline/left-arrow.svg'
import RightArrow from '@/assets/icon/outline/right-arrow.svg'
import { RouterLink } from 'vue-router'
import { onMounted, ref, watch, defineComponent } from 'vue'
import api from '@/api'
import { formatDate } from '@/lib/utils'
import CardFooter from '@/components/Card/CardFooter'

// 단순 랜더링용 함수형 컴포넌트를 defineComponent로 감싸 상태 관리 함수형 컴포넌트로 변경
export default defineComponent(() => {
	// 상태 정의
	const diaryList = ref([])
	const page = ref(1)
	const pages = ref(0)
	const errorMessage = ref('')

	const loadData = async () => {
		try {
			// TODO: URL Change
			const response = await api.get('http://localhost:5000/diary/list', {
				params: { page: page.value }
			})

			console.log(response.data.body.message)

			diaryList.value = response.data.body.diaries
			pages.value = response.data.body.pages

			if (diaryList.value.length === 0) {
				alert('아직 작성한 일기가 없네요! 일기를 작성해보는 건 어떨까요?')
			}
		} catch (error) {
			errorMessage.value =
				error.response?.data?.body?.error?.message ||
				'일기 정보를 가져오는데 실패했어요! 새로고침 후 다시 접속해주세요! T.T'
			console.log(error)
			alert(errorMessage.value)
		}
	}

	// 컴포넌트 마운트 시 데이터 로드
	onMounted(() => {
		loadData()
	})

	// 페이지 변경 시 데이터 로드
	watch(page, () => {
		loadData()
	})

	return () => (
		<div class="flex flex-col gap-10 2xl:w-3/4 mx-auto">
			<div class="flex flex-row flex-wrap gap-6 justify-center ">
				{diaryList.value.map((diary) => (
					<RouterLink to={`/diary/detail/${diary.id}`} key={diary.id}>
						<Card className="col-span-1 w-56 h-72 px-6 py-4 justify-between">
							<CardHeader className="justify-between">
								<div class="font-gowun-batang font-bold">
									{formatDate(diary.created_at)}
								</div>
								<Minus class="size-4 fill-Black-black-1000 cursor-pointer" />
							</CardHeader>
							<CardContents className="h-full">
								<EmogiLabel id={diary.emotion} direction="col" />
							</CardContents>
							<CardFooter>
								<div class="text-md custom-text-md truncate font-gowun-batang font-bold text-Black-black-900">
									{diary.title}
								</div>
								<div className="text-base custom-text-base truncate font-gowun-dodum text-Black-black-800">
									{diary.contents}
								</div>
							</CardFooter>
						</Card>
					</RouterLink>
				))}

				{Array.from({ length: 8 - diaryList.value.length }).map((_, index) => (
					<Card className="col-span-1 w-56 h-72 px-6 py-4 !bg-Black-black-400">
						<CardFooter className="flex-row h-full items-end">
							<Logo type={3} />
						</CardFooter>
					</Card>
				))}
			</div>
			<div class="flex flex-row gap-3 justify-center">
				<Button
					leftIcon={LeftArrow}
					onClick={() => {
						if (page.value === 1) {
							alert('가장 최신 페이지에요!')
							return
						} else {
							page.value -= 1
						}
					}}>
					다음
				</Button>
				<Button
					rightIcon={RightArrow}
					onClick={() => {
						if (page.value === pages.value) {
							alert('더이상 보여줄 페이지가 없어요!')
							return
						} else {
							page.value += 1
						}
					}}>
					이전
				</Button>
			</div>
		</div>
	)
})
