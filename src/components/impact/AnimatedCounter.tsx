import { useEffect, useState } from 'react'
import { AnimatedCounterProps } from '@/types'

export function AnimatedCounter({ target, suffix, isVisible }: AnimatedCounterProps) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!isVisible) return
        const duration = 2000
        const start = Date.now()
        const timer = setInterval(() => {
            const elapsed = Date.now() - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
            setCount(Math.floor(eased * target))
            if (progress >= 1) {
                setCount(target)
                clearInterval(timer)
            }
        }, 16)
        return () => clearInterval(timer)
    }, [isVisible, target])

    return (
        <span>
            {count.toLocaleString()}{suffix}
        </span>
    )
}
