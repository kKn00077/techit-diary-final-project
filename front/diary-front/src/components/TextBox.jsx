import { ref } from 'vue'

export default function TextBox(props, { emit }) {
	const {
		type = 0,
		texttype = 'text',
		placeholder = '',
		modelValue = ''
	} = props

	const handleInput = (event) => {
		// 입력 값 변경 시 부모에 알림
		emit('update:modelValue', event.target.value)
	}

	const defaultClass =
		'box-border bg-Black-black-200 placeholder-Black-black-700 text-Black-black-900 focus:outline-none font-gowun-dodum text-base custom-text-base px-5 focus:border-0'

	const TextBoxNode = {
		1: (
			<input
				type={texttype}
				class={`border-0 border-b  border-b-Purple-purple-200 focus:border-0 focus:border-b focus:border-b-Purple-purple-500 py-2 ${defaultClass}`}
				placeholder={placeholder}
				value={modelValue}
				onInput={handleInput}
			/>
		),
		2: (
			<textarea
				class={`border border-Purple-purple-200 focus:border-2 focus:border-Purple-purple-400 rounded-rounded-7 py-3 ${defaultClass}`}
				placeholder={placeholder}
				value={modelValue}
				onInput={handleInput}></textarea>
		),
		default: (
			<input
				type={texttype}
				class={`border border-Purple-purple-200 focus:border-2 focus:border-Purple-purple-400 rounded-rounded-7 py-3 ${defaultClass}`}
				placeholder={placeholder}
				value={modelValue}
				onInput={handleInput}
			/>
		)
	}

	// 조건에 따라 렌더링
	return TextBoxNode[type] || TextBoxNode.default
}
