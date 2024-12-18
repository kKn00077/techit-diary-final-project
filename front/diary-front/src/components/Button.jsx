export default function Button(props, { slots }) {
	const {
		variant = 'primary', // primary or secondary
		leftIcon: LeftIcon = null, // 왼쪽 아이콘
		rightIcon: RightIcon = null, // 오른쪽 아이콘
		type = 'button', // button or submit
		onClick = () => {}
	} = props

	const defaultClass =
		'px-5 py-2 rounded-rounded-8 font-gowun-dodum text-base custom-text-base'

	const variantStyles = {
		primary:
			'bg-Purple-purple-500 text-Black-black-200 hover:bg-Purple-purple-700',
		secondary:
			'bg-Purple-purple-50 border border-Purple-purple-500 text-Purple-purple-500 hover:bg-Purple-purple-100'
	}

	const iconSize = 'size-4'

	return (
		<button
			type="button"
			class={`${defaultClass} ${variantStyles[variant]}`}
			onClick={onClick}>
			{/* 왼쪽 아이콘 렌더링 */}
			{LeftIcon && <LeftIcon class={`${iconSize} mr-2`} />}

			{/* 기본 슬롯 (버튼 텍스트) */}
			{slots.default ? slots.default() : 'Button'}

			{/* 오른쪽 아이콘 렌더링 */}
			{RightIcon && <RightIcon class={`${iconSize} ml-2`} />}
		</button>
	)
}
