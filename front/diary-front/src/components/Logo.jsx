export default function Logo({ type = 1 }) {
	// 공통 클래스 설정
	const baseClass = 'font-gowun-batang font-bold text-Purple-purple-500'
	const subTextClass =
		'text-base custom-text-base font-gowun-dodum text-Black-black-1100'
	const containerClass = 'flex flex-col justify-center content-center gap-1'

	// 조건에 따라 텍스트와 스타일을 설정
	const LogoNode = {
		0: (
			<div class={`${containerClass}`}>
				<div class={`text-4xl custom-text-4xl text-center ${baseClass}`}>
					today I Feel
				</div>
			</div>
		),
		1: (
			<div class={`${containerClass}`}>
				<div class={`text-4xl custom-text-4xl text-center ${baseClass}`}>
					today I Feel
				</div>
				<div class={`text-center ${subTextClass}`}>
					일상을 기록하고 나를 알아가는 소중한 시간
				</div>
			</div>
		),
		2: (
			<div class="flex flex-col content-center text-Purple-purple-500">
				<div class="text-lg custom-text-lg font-gowun-batang font-bold">
					today
				</div>
				<div class="text-2xl custom-text-2xl font-gowun-batang font-bold">
					I Feel
				</div>
			</div>
		),
		3: (
			<div class="flex flex-col">
				<div class="flex flex-row gap-2 text-Purple-purple-500">
					<div class="text-md custom-text-md content-end font-gowun-batang font-bold">
						today
					</div>
					<div class="text-lg custom-text-lg font-gowun-batang font-bold">
						I Feel
					</div>
				</div>
				<div class="text-xs custom-text-xs font-gowun-dodum text-Black-black-1100">
					일상을 기록하고
					<br />
					나를 알아가는 소중한 시간
				</div>
			</div>
		),
		default: (
			<div class={`${containerClass}`}>
				<div class="flex flex-row gap-2 items-end leading-none text-Purple-purple-500 font-gowun-batang font-bold">
					<span class="text-md custom-text-md">today</span>
					<span class="text-lg custom-text-lg">I Feel</span>
				</div>
				<div class={`text-xs custom-text-xs ${subTextClass}`}>
					일상을 기록하고 나를 알아가는 소중한 시간
				</div>
			</div>
		)
	}

	// 조건에 따라 렌더링
	return LogoNode[type] || LogoNode.default
}
