import { ProjectCategory } from './common'

export interface UIState {
    // Navbar
    isNavScrolled: boolean
    isMobileMenuOpen: boolean
    setNavScrolled: (scrolled: boolean) => void
    setMobileMenuOpen: (open: boolean) => void

    // Gallery
    activeCategory: ProjectCategory
    setActiveCategory: (category: ProjectCategory) => void

    // Modal
    modalProjectId: string | null
    openModal: (id: string) => void
    closeModal: () => void

    // Contact form
    isFormSubmitted: boolean
    isFormSubmitting: boolean
    setFormSubmitting: (submitting: boolean) => void
    setFormSubmitted: (submitted: boolean) => void
    resetForm: () => void
}
