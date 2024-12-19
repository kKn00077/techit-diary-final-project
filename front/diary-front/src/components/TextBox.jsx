export default function TextBox({ type, placeholder }) {
	const defaultClass =
		'bg-Black-black-200 placeholder-Black-black-700 text-Black-black-900 focus:outline-none font-gowun-dodum text-base custom-text-base px-5 focus:border-0'

	const TextBoxNode = {
		1: (
			<input
				type="text"
				class={`border-0 border-b  border-b-Purple-purple-200 focus:border-0 focus:border-b focus:border-b-Purple-purple-500 py-2 ${defaultClass}`}
				placeholder={placeholder}
			/>
		),
		default: (
			<input
				type="text"
				class={`border border-Purple-purple-200 focus:border-2 focus:border-Purple-purple-400 rounded-rounded-7 py-3 ${defaultClass}`}
				placeholder={placeholder}
			/>
		)
	}

	// 조건에 따라 렌더링
	return TextBoxNode[type] || TextBoxNode.default
}
