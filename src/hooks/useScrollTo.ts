/**
 * useScrollTo - reusable hook that returns a scroll helper.
 * Avoids duplicating the scrollIntoView pattern across components.
 *
 * Usage:
 *   const scrollTo = useScrollTo()
 *   <button onClick={() => scrollTo('#contact')}>...</button>
 */
export function useScrollTo() {
    return (selector: string) => {
        document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' })
    }
}
