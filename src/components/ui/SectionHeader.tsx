import { cn } from '@/lib/utils'
import { SectionHeaderProps } from '@/types'

export function SectionHeader({
    subtitle,
    title,
    description,
    centered = true,
    className,
    dark = false,
}: SectionHeaderProps) {
    return (
        <div
            className={cn(
                'mb-12 reveal',
                centered ? 'text-center' : 'text-left',
                className
            )}
        >
            {subtitle && (
                <p className={cn(
                    "section-subtitle",
                    dark ? "text-teal-400" : "text-teal-500"
                )}>
                    {subtitle}
                </p>
            )}
            <h2 className={cn(
                "section-title mx-auto",
                centered && "max-w-2xl",
                dark ? "text-white" : "text-navy-800"
            )}>
                {title}
            </h2>
            {description && (
                <p className={cn(
                    "mt-4 mx-auto text-lg leading-relaxed",
                    centered && "max-w-xl",
                    dark ? "text-white/50" : "text-gray-500"
                )}>
                    {description}
                </p>
            )}
        </div>
    )
}
