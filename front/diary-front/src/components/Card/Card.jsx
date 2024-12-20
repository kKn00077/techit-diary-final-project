import { cn } from '@/lib/utils'

export default function Card({ className }, { slots }) {
	return (
		<div class={cn('card rounded-rounded-6 flex flex-col', className)}>
			{slots.default && slots.default()}
		</div>
	)
}
