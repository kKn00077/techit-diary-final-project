import Card from '@/components/Card/Card'
import CardHeader from '@/components/Card/CardHeader'
import Minus from '@/assets/icon/filled/Minus.svg'
import CardContents from '@/components/Card/CardContents'
import EmogiLabel from '@/components/EmogiLabel'
import Logo from '@/components/Logo'
import Button from '@/components/Button'
import LeftArrow from '@/assets/icon/outline/left-arrow.svg'
import RightArrow from '@/assets/icon/outline/right-arrow.svg'

export default function MyDiaryView() {
	return (
		<div class="flex flex-col gap-10">
			<div class="flex flex-row flex-wrap gap-6 mx-auto">
				<Card className="col-span-1 w-56 h-72 px-6 py-4 justify-between">
					<CardHeader className="justify-between">
						<div class="font-gowun-batang font-bold">24/12/10 (월)</div>
						<Minus class="size-4 cursor-pointer" />
					</CardHeader>
					<CardContents className="h-full">
						<EmogiLabel id="joy" direction="col" />
					</CardContents>
					<CardFooter>
						<div class="text-md custom-text-md font-gowun-batang font-bold text-Black-black-900">
							코딩 스터디
						</div>
						<div className="text-base custom-text-base truncate font-gowun-dodum text-Black-black-800">
							다음 주말에 여행 가기로 했는데 아무튼 개꿀잼ㅋㅋ
						</div>
					</CardFooter>
				</Card>

				<Card className="col-span-1 w-56 h-72 px-6 py-4 !bg-Black-black-400 justify-between">
					<CardFooter className="h-full content-end">
						<Logo type={3} />
					</CardFooter>
				</Card>
			</div>
			<div class="flex flex-row gap-3 justify-center">
				<Button leftIcon={LeftArrow}>다음</Button>
				<Button rightIcon={RightArrow}>이전</Button>
			</div>
		</div>
	)
}
