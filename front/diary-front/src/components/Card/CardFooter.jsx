import { cn } from '@/lib/utils'

export default function CardFooter({ className }, { slots }) {
	return (
		<div class={cn('flex flex-col gap-1 text-Black-black-1000', className)}>
			{slots.default && slots.default()}
		</div>
	)
}
