import { useMemo, useState } from 'react'
import { PageHero } from '@fortune/shared-ui'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle2, Route, ShieldCheck, Users } from 'lucide-react'
import { apiFetch } from '@/lib/apiClient'
import { fallbackProjects, normalizeProject, RawProject } from '@/lib/projectPresentation'
import { MalawiProjectMap } from '@/components/projects/MalawiProjectMap'
import { ProjectPortfolioFilters } from '@/components/projects/ProjectPortfolioFilters'
import { ProjectPortfolioGrid } from '@/components/projects/ProjectPortfolioGrid'
import { ProjectPortfolioStats, PortfolioStat } from '@/components/projects/ProjectPortfolioStats'
import {
    DEFAULT_CATEGORY_OPTIONS,
    ProjectCategoryFilter,
    ProjectCategoryOption,
    ProjectStatusFilter,
} from '@/components/projects/portfolioConfig'

export default function ProjectsPage() {
    const [category, setCategory] = useState<ProjectCategoryFilter>('All')
    const [status, setStatus] = useState<ProjectStatusFilter>('All')
    const [searchQuery, setSearchQuery] = useState('')

    const { data: apiProjects, isLoading } = useQuery<RawProject[]>({
        queryKey: ['projects'],
        queryFn: () => apiFetch<RawProject[]>('/projects'),
        staleTime: 60_000,
    })

    const projects = useMemo(
        () => (apiProjects?.length ? apiProjects.map(normalizeProject) : fallbackProjects),
        [apiProjects],
    )

    const { data: apiCategories } = useQuery<ProjectCategoryOption[]>({
        queryKey: ['project-categories'],
        queryFn: () => apiFetch<ProjectCategoryOption[]>('/project-categories'),
        staleTime: 60_000,
    })

    const categories = useMemo(
        () => (apiCategories?.length ? apiCategories : DEFAULT_CATEGORY_OPTIONS)
            .filter((item) => item.isActive !== false)
            .sort((a, b) => (a.order || 0) - (b.order || 0)),
        [apiCategories],
    )

    const filteredProjects = useMemo(
        () => {
            const query = searchQuery.trim().toLowerCase()
            return projects.filter((project) => {
                const matchesCategory = category === 'All' || project.category === category
                const matchesStatus = status === 'All' || project.status === status
                const searchable = [
                    project.title,
                    project.location,
                    project.clientName,
                    project.category,
                    project.overview,
                ].join(' ').toLowerCase()
                const matchesSearch = !query || searchable.includes(query)
                return matchesCategory && matchesStatus && matchesSearch
            })
        },
        [category, projects, searchQuery, status],
    )

    const portfolioStats: PortfolioStat[] = [
        {
            icon: CheckCircle2,
            value: '120+',
            label: 'Completed Projects',
            sublabel: 'Across Malawi',
            supportingText: '',
        },
        {
            icon: Route,
            value: '850',
            unit: 'km',
            label: 'Roads Constructed',
            sublabel: 'Paved & Upgraded',
            supportingText: '',
        },
        {
            icon: ShieldCheck,
            value: '20+',
            label: 'Years Experience',
            sublabel: "Engineering Malawi's Growth",
            supportingText: '',
        },
        {
            icon: Users,
            value: '450+',
            label: 'Employees',
            sublabel: 'Skilled. Trained. Committed.',
            supportingText: '',
        },
    ]

    return (
        <div className="flex min-h-screen w-full flex-col bg-white dark:bg-slate-950">
            <PageHero
                title="Project Portfolio"
                description="A premium view of Fortune Construction's infrastructure, building, and civil works across Malawi."
                imageSrc="https://images.unsplash.com/photo-1545558014-8ab6aa17e307?q=80&w=2200&auto=format&fit=crop&fm=webp"
                imageAlt="Large construction project site"
            />

            <ProjectPortfolioStats stats={portfolioStats} />

            <section className="bg-slate-50 px-6 pb-20 pt-10 dark:bg-slate-950 md:pb-28">
                <div className="mx-auto mb-8 flex max-w-[1800px] flex-col justify-between gap-6 border-b border-slate-200 pb-8 dark:border-slate-800 lg:flex-row lg:items-end">
                    <div>
                        <span className="text-[11px] font-black uppercase tracking-[0.26em] text-teal-700 dark:text-teal-300">Selected work</span>
                        <h2 className="mt-3 max-w-3xl text-4xl font-display font-bold tracking-tight text-slate-950 dark:text-white md:text-5xl">
                            Case studies with scale, context, and delivery outcomes.
                        </h2>
                    </div>
                    <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
                        Browse by sector and project status, then open a detailed case study for scope, methods, delivery challenges, and results.
                    </p>
                </div>

                <div className="mx-auto grid max-w-[1800px] gap-10 xl:grid-cols-[minmax(0,1fr)_500px]">
                    <main>
                        <ProjectPortfolioFilters
                            categories={categories}
                            category={category}
                            onClearFilters={() => {
                                setCategory('All')
                                setStatus('All')
                                setSearchQuery('')
                            }}
                            onCategoryChange={setCategory}
                            onSearchChange={setSearchQuery}
                            onStatusChange={setStatus}
                            searchQuery={searchQuery}
                            status={status}
                        />

                        <div className="mt-12 md:mt-16">
                            <ProjectPortfolioGrid isLoading={isLoading} projects={filteredProjects} />
                        </div>
                    </main>

                    <MalawiProjectMap projects={projects} />
                </div>
            </section>
        </div>
    )
}
