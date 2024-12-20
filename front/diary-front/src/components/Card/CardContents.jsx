import { cn } from '@/lib/utils'

export default function CardContents({ className }, { slots }) {
	return (
		<div
			class={cn(
				'flex flex-col justify-center items-center text-Black-black-1100 font-gowun-dodum text-base custom-text-base',
				className
			)}>
			{slots.default && slots.default()}
		</div>
	)
}
