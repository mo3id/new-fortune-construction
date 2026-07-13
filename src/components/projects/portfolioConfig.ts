import {
    BadgeCheck,
    Building2,
    ChevronsRight,
    Clock3,
    Factory,
    Home,
    Landmark,
    Layers3,
    Route,
    ScanSearch,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const CATEGORY_FILTERS = ['All', 'Roads', 'Bridges', 'Commercial', 'Residential', 'Industrial', 'Government'] as const
export const STATUS_FILTERS = ['All', 'Ongoing', 'Completed'] as const

export type ProjectCategoryFilter = (typeof CATEGORY_FILTERS)[number]
export type ProjectStatusFilter = (typeof STATUS_FILTERS)[number]

export const CATEGORY_META: Record<ProjectCategoryFilter, { icon: LucideIcon; label: string }> = {
    All: { icon: Layers3, label: 'All Work' },
    Roads: { icon: Route, label: 'Roads' },
    Bridges: { icon: ChevronsRight, label: 'Bridges' },
    Commercial: { icon: Building2, label: 'Commercial' },
    Residential: { icon: Home, label: 'Residential' },
    Industrial: { icon: Factory, label: 'Industrial' },
    Government: { icon: Landmark, label: 'Government' },
}

export const STATUS_META: Record<ProjectStatusFilter, { icon: LucideIcon; label: string }> = {
    All: { icon: ScanSearch, label: 'All Statuses' },
    Ongoing: { icon: Clock3, label: 'Ongoing' },
    Completed: { icon: BadgeCheck, label: 'Completed' },
}
