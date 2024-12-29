import { computed, defineComponent, ref, onBeforeUnmount } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

export default defineComponent({
	props: {
		url: {
			type: String,
			default: '/diary/list'
		},
		leftIcon: {
			type: Object,
			default: null
		},
		onClick: {
			type: Function,
			default: () => {}
		}
	},
	setup(props, { slots }) {
		const isUnmounted = ref(false)
		const iconSize = 'size-6'

		// 라우터 정보 가져오기
		const route = useRoute()

		// 현재 경로와 메뉴 URL 비교
		const normalizePath = (path) => path.replace(/\/$/, '')

		const isActive = computed(() => {
			return (
				normalizePath(props.url) === normalizePath(route.path) ||
				(props.url === '/diary/list' && route.path.includes('/diary/detail'))
			)
		})

		// 컴포넌트 언마운트 시 처리
		onBeforeUnmount(() => {
			isUnmounted.value = true
		})

		if (isUnmounted.value) {
			return null
		}

		// JSX 반환
		return () => (
			<RouterLink
				to={props.url}
				class={`flex flex-row gap-2 px-3 py-2 rounded-rounded-3 font-gowun-batang 
        text-Black-black-1100 cursor-pointer custom-text-base text-base
        ${isActive.value ? 'bg-Purple-purple-100' : 'hover:bg-Black-black-400'}`}
				onClick={props.onClick}>
				{/* LeftIcon이 있다면 렌더링 */}
				{props.leftIcon && (
					<props.leftIcon class={`${iconSize} fill-Black-black-1000`} />
				)}

				{/* slots가 없다면 기본 텍스트 'Menu' 사용 */}
				{slots.default ? slots.default() : 'Menu'}
			</RouterLink>
		)
	}
})
