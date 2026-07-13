import { ReactNode } from 'react'
import { Project, Service, TimelineEvent, Partner, Testimonial, MetricItem } from './domain'
import { ProjectCategory } from './common'

export interface TimelineItemProps {
    event: TimelineEvent
    index: number
}

export interface ServiceCardProps {
    service: Service
    index: number
}

export interface VideoBackgroundProps {
    currentIndex: number
}

export interface AnimatedCounterProps {
    target: number
    suffix: string
    isVisible: boolean
}

export interface PartnerLogoProps {
    partner: Partner
    index: number
}

export interface MetricCardProps {
    metric: MetricItem
    index: number
    isVisible: boolean
}

export interface TestimonialCardProps {
    testimonial: Testimonial
}

export interface ProjectModalProps {
    project: Project
    onClose: () => void
}

export interface FormFieldProps {
    label: string
    error?: string
    children: ReactNode
    className?: string
}

export interface ProjectFilterProps {
    categories: ProjectCategory[]
    activeCategory: ProjectCategory
    onCategoryChange: (category: ProjectCategory) => void
}

export interface ProjectCardProps {
    project: Project
    isHovered: boolean
    onMouseEnter: () => void
    onMouseLeave: () => void
    onClick: () => void
}

export interface ContainerProps {
    children: ReactNode
    className?: string
}

export interface SectionHeaderProps {
    subtitle?: string
    title: string
    description?: string
    centered?: boolean
    className?: string
    dark?: boolean
}
