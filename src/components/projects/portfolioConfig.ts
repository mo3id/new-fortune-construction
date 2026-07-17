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

export const STATUS_FILTERS = ['All', 'Ongoing', 'Completed'] as const

export type ProjectCategoryFilter = string
export type ProjectStatusFilter = (typeof STATUS_FILTERS)[number]

export interface ProjectCategoryOption {
    _id?: string
    name: string
    slug?: string
    icon?: string
    order?: number
    isActive?: boolean
}

export const DEFAULT_CATEGORY_OPTIONS: ProjectCategoryOption[] = [
    { name: 'Roads', slug: 'roads', icon: 'Route', order: 1, isActive: true },
    { name: 'Bridges', slug: 'bridges', icon: 'ChevronsRight', order: 2, isActive: true },
    { name: 'Commercial', slug: 'commercial', icon: 'Building2', order: 3, isActive: true },
    { name: 'Residential', slug: 'residential', icon: 'Home', order: 4, isActive: true },
    { name: 'Industrial', slug: 'industrial', icon: 'Factory', order: 5, isActive: true },
    { name: 'Government', slug: 'government', icon: 'Landmark', order: 6, isActive: true },
]

export const CATEGORY_META: Record<string, { icon: LucideIcon; label: string }> = {
    All: { icon: Layers3, label: 'All Work' },
    Roads: { icon: Route, label: 'Roads' },
    Bridges: { icon: ChevronsRight, label: 'Bridges' },
    Commercial: { icon: Building2, label: 'Commercial' },
    Residential: { icon: Home, label: 'Residential' },
    Industrial: { icon: Factory, label: 'Industrial' },
    Government: { icon: Landmark, label: 'Government' },
}

export const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
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
}

export function getCategoryIcon(category: ProjectCategoryOption | string): LucideIcon {
    const name = typeof category === 'string' ? category : category.name
    const icon = typeof category === 'string' ? undefined : category.icon
    return (icon && CATEGORY_ICON_MAP[icon]) || CATEGORY_META[name]?.icon || Layers3
}

export const STATUS_META: Record<ProjectStatusFilter, { icon: LucideIcon; label: string }> = {
    All: { icon: ScanSearch, label: 'All Statuses' },
    Ongoing: { icon: Clock3, label: 'Ongoing' },
    Completed: { icon: BadgeCheck, label: 'Completed' },
}
