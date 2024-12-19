export default function Footer({ mode = 1 }) {
	const modeSwitch =
		mode === 0
			? { className: 'fixed bottom-0 left-0 py-4 text-Black-black-1100' }
			: { className: 'text-Black-black-800 h-full content-end' }

	return (
		<footer
			className={`w-full text-xs custom-text-xs text-center font-gowun-dodum ${modeSwitch.className}`}>
			Copyright 2024. 멋쟁이사자처럼
			{mode === 1 && <br />}
			AI 웹 서비스 스쿨 1기 필승1조. All rights reserved.
		</footer>
	)
}
