import Joy from '@/assets/emogi/Joy.svg' // 즐거움
import Sadness from '@/assets/emogi/Sadness.svg' // 슬픔
import Anger from '@/assets/emogi/Anger.svg' // 분노
import Disgust from '@/assets/emogi/Disgust.svg' // 까칠함
import Fear from '@/assets/emogi/Fear.svg' // 두려움
import Anxiety from '@/assets/emogi/Anxiety.svg' // 불안함
import Envy from '@/assets/emogi/Envy.svg' // 부러움
import Ennui from '@/assets/emogi/Ennui.svg' // 따분함
import Embarrassment from '@/assets/emogi/Embarrassment.svg' // 당황
import Nostalgia from '@/assets/emogi/Nostalgia.svg'
import Neutral from '@/assets/emogi/Neutral.svg'

export default function EmogiLabel({ id, direction = 'col' }) {
	const emogiList = {
		joy: { label: '기쁨', Emogi: Joy },
		sadness: { label: '슬픔', Emogi: Sadness },
		anger: { label: '분노', Emogi: Anger },
		disgust: { label: '까칠함', Emogi: Disgust },
		fear: { label: '두려움', Emogi: Fear },
		anxiety: { label: '불안함', Emogi: Anxiety },
		envy: { label: '부러움', Emogi: Envy },
		ennui: { label: '따분함', Emogi: Ennui },
		embarrassment: { label: '당황', Emogi: Embarrassment },
		nostalgia: { label: '추억', Emogi: Nostalgia },
		neutral: { label: '중립', Emogi: Neutral }
	}

	const emogiClass = {
		default_wrap: 'inline-flex items-center justify-center items-center',
		row: {
			wrap: 'flex-row py-[10px] px-[10px] gap-2',
			icon_size: 'size-8',
			text_size: 'text-lg custom-text-lg'
		},
		col: {
			wrap: 'flex-col py-2 px-2',
			icon_size: 'size-14',
			text_size: 'text-sm custom-text-sm'
		}
	}

	const { Emogi, label } = emogiList[id]

	return (
		<div class={`${emogiClass.default_wrap} ${emogiClass[direction].wrap}`}>
			<Emogi class={emogiClass[direction].icon_size} />
			<span
				class={`font-gowun-dodum ${emogiClass[direction].text_size} text-Black-black-1100`}>
				{label}
			</span>
		</div>
	)
}
