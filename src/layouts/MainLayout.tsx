import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'

export default function MainLayout() {
    const location = useLocation()

    // Global scroll reveal observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible')
                        // Optional: stop observing once it's visible to improve performance
                        observer.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
        )

        const observeElements = () => {
            const elements = document.querySelectorAll('.reveal:not(.visible)')
            elements.forEach((el) => {
                observer.observe(el)
            })
        }

        // Run initially
        observeElements()

        // Create a MutationObserver to catch elements added dynamically (e.g. by React)
        const mutationObserver = new MutationObserver((mutations) => {
            let shouldReobserve = false
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    shouldReobserve = true
                    break
                }
            }
            if (shouldReobserve) {
                observeElements()
            }
        })

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        })

        return () => {
            observer.disconnect()
            mutationObserver.disconnect()
        }
    }, [location.pathname]) // Re-run when route changes to reset

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <ScrollToTop />
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
