import React from 'react'
import { ProjectCategory } from './common'

export interface Project {
    id: string
    title: string
    location: string
    startDate?: string
    endDate?: string
    category: Exclude<ProjectCategory, 'All'>
    image?: string
    size?: 'normal' | 'tall' | 'wide'
    description?: string
    budget?: string
    challenge?: string
    solution?: string
    result?: string
    coverImage?: string
    galleryImages?: string[]
}

export interface Service {
    icon: React.ReactNode
    title: string
    tagline: string
    description: string
    features: string[]
    accentColor: string
    bgImage: string
}

export interface TimelineEvent {
    year: string
    title: string
    description: string
    icon: React.ReactNode
    highlight?: boolean
}

export interface MetricItem {
    icon: React.ReactNode
    target: number
    suffix: string
    label: string
    description: string
    color: string
}

export interface Partner {
    name: string
    abbr: string
    color: string
    logo?: string
}

export interface Testimonial {
    quote: string
    author: string
    org: string
    initials: string
    image?: string
}
