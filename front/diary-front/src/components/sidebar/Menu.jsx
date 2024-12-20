import { RouterLink, useRoute } from 'vue-router'

export default function Menu(props, { slots }) {
	const {
		url: URL = '/diary/list',
		leftIcon: LeftIcon = null, // 왼쪽 아이콘
		onClick = () => {}
	} = props

	const iconSize = 'size-6'

	// 현재 URL과 일치하는지 확인
	const route = useRoute()
	const isActive = route.path === URL

	return (
		<RouterLink
			to={URL}
			class={`flex flex-row gap-2 px-3 py-2 rounded-rounded-3 font-gowun-batang 
             text-Black-black-1100 cursor-pointer custom-text-base text-base
            ${isActive ? 'bg-Purple-purple-100' : 'hover:bg-Black-black-400'}`} // 조건부 스타일 추가
			onClick={onClick}>
			{LeftIcon && <LeftIcon class={`${iconSize} fill-Black-black-1000`} />}
			{slots.default ? slots.default() : 'Menu'}
		</RouterLink>
	)
}
