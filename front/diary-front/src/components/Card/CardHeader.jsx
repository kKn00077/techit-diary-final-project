import { cn } from '@/lib/utils'

export default function CardHeader({ className }, { slots }) {
	return (
		<div
			class={cn('flex flex-row items-center text-Black-black-1000', className)}>
			{slots.default && slots.default()}
		</div>
	)
}
