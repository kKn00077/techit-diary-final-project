import Button from '@/components/Button'
import TextBox from '@/components/TextBox'
import Save from '@/assets/icon/filled/save.svg'

export default function WriteView() {
	return (
		<div class="flex flex-col gap-10 h-full">
			<div class="flex flex-col gap-2">
				<label class="text-Black-black-800 font-gowun-dodum text-base custom-text-base">
					일기 제목
				</label>
				<TextBox placeholder="일기 제목을 입력해주세요!" />
			</div>

			<div class="flex flex-col gap-2 h-full">
				<label class="text-Black-black-800 font-gowun-dodum text-base custom-text-base">
					일기 내용
				</label>
				<TextBox
					type={2}
					placeholder="오늘의 하루는 어떠셨나요?"
					class=" h-full"
				/>
			</div>

			<div class="text-end">
				<Button leftIcon={Save}>저장</Button>
			</div>
		</div>
	)
}
