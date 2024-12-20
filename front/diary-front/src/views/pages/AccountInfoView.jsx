import DeleteLabel from '@/assets/icon/filled/delete-label.svg'
import Button from '@/components/Button'
import Card from '@/components/Card/Card'
import CardContents from '@/components/Card/CardContents'
import CardHeader from '@/components/Card/CardHeader'

export default function AccountInfoView() {
	return (
		<div class="flex flex-col gap-10">
			<Card className="p-10">
				<CardHeader className="justify-between">
					<div class="flex flex-col gap-4 font-gowun-dodum items-start">
						<div class=" text-Black-black-1100 text-lg custom-text-lg">
							계정 정보
						</div>
						<div class=" text-Black-black-900 text-base custom-text-base">
							kkn00077@naver.com
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
				<CardContents className="items-start">TODO</CardContents>
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
				<CardContents className="items-start">TODO</CardContents>
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
					<Button rightIcon={DeleteLabel}>계정 탈퇴</Button>
				</CardHeader>
			</Card>
			{/* <div class="flex flex-row gap-3 justify-end">
				<Button leftIcon={Minus}>삭제</Button>
				<Button variant="secondary" leftIcon={Archive}>
					일기 목록
				</Button>
			</div> */}
		</div>
	)
}
