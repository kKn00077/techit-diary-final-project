import Card from '@/components/Card/Card'
import CardContents from '@/components/Card/CardContents'
import CardHeader from '@/components/Card/CardHeader'
import EmogiLabel from '@/components/EmogiLabel'
import Minus from '@/assets/icon/filled/minus.svg'
import Archive from '@/assets/icon/filled/archive.svg'
import Button from '@/components/Button'

export default function DetailView() {
	return (
		<div class="flex flex-col gap-10">
			<Card className="p-10 gap-4 w-full">
				<CardHeader className="justify-between items-start gap-4">
					<div class="font-gowun-batang text-Black-black-1100 text-lg custom-text-lg">
						오늘은 친구랑 같이 영화 보러 갔다!
					</div>
					<div class="flex flex-col gap-1 font-gowun-dodum">
						<div class=" text-Black-black-800 text-base custom-text-base">
							24/12/10 (월)
						</div>
						<EmogiLabel id="joy" direction="row" />
					</div>
				</CardHeader>
				<CardContents className="font-gowun-dodum text-Black-black-1100 text-base custom-text-base items-start">
					오랜만에 친구랑 만나서 샤로수길을 갔다! 만나서 맛있는 것도 먹어서
					기분이 좋았다. <br />
					인근에 있는 CGV로 가서 한 손에는 팝콘을 들고 다른 한 손에는 콜라를
					들고 인사이드아웃2 를 봤다. <br />
					1에서 본 라일리의 모습이 엊그제 같은데 보다가 눈물 좔좔 흘려버렸다...
				</CardContents>
			</Card>
			<div class="flex flex-row gap-3 justify-end">
				<Button leftIcon={Minus}>삭제</Button>
				<RouterLink to="/diary">
					<Button variant="secondary" leftIcon={Archive}>
						일기 목록
					</Button>
				</RouterLink>
			</div>
		</div>
	)
}
