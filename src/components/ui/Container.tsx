import { cn } from '@/lib/utils'
import { ContainerProps } from '@/types'

export function Container({ children, className }: ContainerProps) {
    return (
        <div className={cn('max-w-7xl mx-auto px-6 md:px-12 lg:px-20', className)}>
            {children}
        </div>
    )
}
