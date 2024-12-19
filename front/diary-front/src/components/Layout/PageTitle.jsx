import { useRouter } from 'vue-router'

export default function PageTitle(props, { slots }) {
	const route = useRouter()
	const title = route.currentRoute.value.meta?.title

	const {
		leftIcon: LeftIcon = route.currentRoute.value.meta?.icon // 왼쪽 아이콘
	} = props

	const iconSize = 'size-12'

	return (
		<div class="flex flex-row gap-2 items-center">
			{LeftIcon && <LeftIcon class={`${iconSize} fill-Black-black-1000`} />}
			<h1 class="text-2xl inline text-Black-black-1000 font-gowun-batang">
				{title || 'Page Header'}
			</h1>
		</div>
	)
}
