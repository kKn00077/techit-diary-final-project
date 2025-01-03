import Button from '@/components/Button'
import TextBox from '@/components/TextBox'
import Save from '@/assets/icon/filled/save.svg'
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import api from '@/api'
import { useRouter } from 'vue-router'

export default defineComponent(() => {
	const title = ref('')
	const contents = ref('')
	const errorMessage = ref('')
	const isLoading = ref(false)
	const isUnmounted = ref(false) // 컴포넌트 언마운트 상태를 추적

	onBeforeUnmount(() => {
		title.value = ''
		contents.value = ''
		isLoading.value = false
		errorMessage.value = ''
		isUnmounted.value = true // 언마운트 상태로 설정
	})

	onMounted(() => {
		if (isUnmounted.value) {
			return // 방어 코드 추가
		}
	})

	const router = useRouter()

	const handleSave = async () => {
		if (isUnmounted.value) {
			return
		}

		if (title.value === '' || contents.value === '') {
			errorMessage.value = '값을 모두 입력해야 일기 저장이 가능해요!'
			alert(errorMessage.value)
			return
		}

		isLoading.value = true

		try {
			// TODO: URL Change
			const response = await api.post(
				'http://ec2-3-34-61-96.ap-northeast-2.compute.amazonaws.com:8000/diary/create',
				{
					title: title.value,
					contents: contents.value
				}
			)

			alert(response.data.body.message)

			router.push('/diary/list')
		} catch (error) {
			console.log(error)

			errorMessage.value =
				error.response?.data?.body?.error?.message ||
				'일기 저장에 실패했어요! 나중에 다시 시도해주세요! T.T'
			alert(errorMessage.value)
		} finally {
			isLoading.value = false
		}
	}

	return () => (
		<div class="flex flex-col gap-10 h-full">
			<div class="flex flex-col gap-2">
				<label class="text-Black-black-800 font-gowun-dodum text-base custom-text-base">
					일기 제목
				</label>
				<TextBox
					placeholder="일기 제목을 입력해주세요!"
					modelValue={title.value}
					onUpdate:modelValue={(val) => (title.value = val)}
				/>
			</div>

			<div class="flex flex-col gap-2 h-full">
				<label class="text-Black-black-800 font-gowun-dodum text-base custom-text-base">
					일기 내용
				</label>
				<TextBox
					type={2}
					placeholder="오늘의 하루는 어떠셨나요?"
					class=" h-full"
					modelValue={contents.value}
					onUpdate:modelValue={(val) => (contents.value = val)}
				/>
			</div>

			<div class="text-end">
				<Button
					leftIcon={Save}
					disabled={isLoading.value}
					onClick={() => {
						if (
							confirm(
								'일기는 한 번 저장하면 수정할 수 없어요!\n정말로 저장하시겠어요?'
							)
						) {
							handleSave()
						}
					}}>
					{isLoading.value ? '저장 중...' : '저장'}
				</Button>
			</div>
		</div>
	)
})
