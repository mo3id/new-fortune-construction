import { useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '@/store/useUIStore'
import { cn } from '@/lib/utils'
import { Button, Container } from '@fortune/shared-ui'
import { NAV_LINKS } from '@/lib/constants'

export default function Navbar() {
    const { isNavScrolled, isMobileMenuOpen, setNavScrolled, setMobileMenuOpen } = useUIStore()
    const location = useLocation()

    // On pages other than home, we want the navbar to always have a background to ensure visibility
    const isHomePage = location.pathname === '/'
    const shouldShowBackground = isNavScrolled || !isHomePage

    const handleScroll = useCallback(() => {
        setNavScrolled(window.scrollY > 50)
    }, [setNavScrolled])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true })
        // Trigger once on mount to set correct state
        handleScroll()
        return () => window.removeEventListener('scroll', handleScroll)
    }, [handleScroll])

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
                shouldShowBackground
                    ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-2xl shadow-slate-200/50 dark:shadow-black/20 py-4 border-b border-slate-100 dark:border-slate-800'
                    : 'bg-transparent py-8 border-b border-transparent'
            )}
        >
            <Container className="flex items-center justify-between">
                {/* Logo Area */}
                <Link to="/" className="flex items-center group" onClick={() => setMobileMenuOpen(false)}>
                    <div className="relative">
                        <img
                            src="/Logo-new-01.png"
                            alt="Fortune Construction Logo"
                            className={cn("h-10 md:h-14 w-auto object-contain transition-all duration-500 group-hover:scale-105", 
                                !shouldShowBackground && "brightness-0 invert" 
                            )}
                        />
                        {!shouldShowBackground && (
                            <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-teal-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                        )}
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-10">
                    {NAV_LINKS.map((link) => {
                        const isActive = location.pathname === link.href
                        return (
                            <Link
                                key={link.label}
                                to={link.href}
                                className={cn(
                                    "text-[10px] font-black transition-all duration-300 tracking-[0.2em] uppercase relative group/link",
                                    isActive 
                                        ? "text-teal-600" 
                                        : shouldShowBackground 
                                            ? "text-slate-600 hover:text-teal-600" 
                                            : "text-white/80 hover:text-white"
                                )}
                            >
                                {link.label}
                                <span className={cn(
                                    "absolute -bottom-1 left-0 w-full h-0.5 bg-teal-500 transition-transform duration-300 origin-left",
                                    isActive ? "scale-x-100" : "scale-x-0 group-hover/link:scale-x-100"
                                )} />
                            </Link>
                        )
                    })}
                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-2" />
                    <Link to="/contact">
                        <Button
                            size="lg"
                            className={cn(
                                "px-8 h-12 font-bold transition-all duration-500 uppercase tracking-widest text-[10px] shadow-xl",
                                shouldShowBackground 
                                    ? "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-500/20" 
                                    : "bg-white hover:bg-teal-50 text-teal-600 shadow-white/10"
                            )}
                        >
                            Executive Inquiry
                        </Button>
                    </Link>
                </nav>

                {/* Mobile toggle */}
                <button
                    className="md:hidden p-2 transition-colors"
                    onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? (
                        <X className={cn("w-6 h-6", shouldShowBackground ? "text-navy-900" : "text-white")} />
                    ) : (
                        <Menu className={cn("w-6 h-6", shouldShowBackground ? "text-navy-900" : "text-white")} />
                    )}
                </button>
            </Container>

            {/* Mobile menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-8 py-10 flex flex-col gap-6 shadow-2xl shadow-slate-200/50 dark:shadow-black/40 z-50 rounded-b-[2rem]"
                    >
                        <div className="flex flex-col gap-4">
                            {NAV_LINKS.map((link) => {
                                const isActive = location.pathname === link.href
                                return (
                                    <Link
                                        key={link.label}
                                        to={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={cn(
                                            "text-xl font-display font-bold transition-all duration-300 text-left py-3 px-4 rounded-2xl flex items-center justify-between group",
                                            isActive 
                                                ? "bg-teal-50 dark:bg-teal-900/20 text-teal-600 shadow-sm shadow-teal-500/10" 
                                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                        )}
                                    >
                                        {link.label}
                                        <div className={cn(
                                            "w-2 h-2 rounded-full transition-all duration-500",
                                            isActive ? "bg-teal-500 scale-100" : "bg-slate-200 dark:bg-slate-700 scale-0 group-hover:scale-100"
                                        )} />
                                    </Link>
                                )
                            })}
                        </div>
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-4">
                            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                                <Button
                                    size="lg"
                                    className="w-full h-16 bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg uppercase tracking-widest shadow-xl shadow-teal-500/20"
                                >
                                    Executive Inquiry
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
