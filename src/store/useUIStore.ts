import { create } from 'zustand'
import { UIState } from '@/types'

export const useUIStore = create<UIState>((set) => ({
    // Navbar
    isNavScrolled: false,
    isMobileMenuOpen: false,
    setNavScrolled: (scrolled) => set({ isNavScrolled: scrolled }),
    setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

    // Gallery
    activeCategory: 'All',
    setActiveCategory: (category) => set({ activeCategory: category }),

    // Modal
    modalProjectId: null,
    openModal: (id) => set({ modalProjectId: id }),
    closeModal: () => set({ modalProjectId: null }),

    // Contact form
    isFormSubmitted: false,
    isFormSubmitting: false,
    setFormSubmitting: (submitting) => set({ isFormSubmitting: submitting }),
    setFormSubmitted: (submitted) => set({ isFormSubmitted: submitted }),
    resetForm: () => set({ isFormSubmitted: false, isFormSubmitting: false }),
}))
