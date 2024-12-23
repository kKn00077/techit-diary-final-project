import { cn } from '@/lib/utils'

export default function CardContents({ className, html = '' }, { slots }) {
	return (
		<div
			class={cn(
				'flex flex-col justify-center items-center text-Black-black-1100 font-gowun-dodum text-base custom-text-base',
				className
			)}
			{...(html
				? { innerHTML: html } // HTML을 직접 삽입
				: {})}>
			{!html && slots.default && slots.default()}{' '}
			{/* HTML이 없을 때만 슬롯 사용 */}
		</div>
	)
}
