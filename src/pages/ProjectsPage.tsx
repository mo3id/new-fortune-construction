import { useMemo, useState } from 'react'
import { PageHero } from '@fortune/shared-ui'
import { useQuery } from '@tanstack/react-query'
import { Building2, CheckCircle2, Route, Users } from 'lucide-react'
import { apiFetch } from '@/lib/apiClient'
import { fallbackProjects, normalizeProject, RawProject } from '@/lib/projectPresentation'
import { MalawiProjectMap } from '@/components/projects/MalawiProjectMap'
import { ProjectPortfolioFilters } from '@/components/projects/ProjectPortfolioFilters'
import { ProjectPortfolioGrid } from '@/components/projects/ProjectPortfolioGrid'
import { ProjectPortfolioStats, PortfolioStat } from '@/components/projects/ProjectPortfolioStats'
import {
    CATEGORY_FILTERS,
    ProjectCategoryFilter,
    ProjectStatusFilter,
    STATUS_FILTERS,
} from '@/components/projects/portfolioConfig'

function getCounts<T extends string>(items: readonly T[], allCount: number, getCount: (item: T) => number): Record<T, number> {
    return items.reduce<Record<T, number>>((counts, item) => {
        counts[item] = item === 'All' ? allCount : getCount(item)
        return counts
    }, {} as Record<T, number>)
}

export default function ProjectsPage() {
    const [category, setCategory] = useState<ProjectCategoryFilter>('All')
    const [status, setStatus] = useState<ProjectStatusFilter>('All')

    const { data: apiProjects, isLoading } = useQuery<RawProject[]>({
        queryKey: ['projects'],
        queryFn: () => apiFetch<RawProject[]>('/projects'),
        staleTime: 60_000,
    })

    const projects = useMemo(
        () => (apiProjects?.length ? apiProjects.map(normalizeProject) : fallbackProjects),
        [apiProjects],
    )

    const filteredProjects = useMemo(
        () => projects.filter((project) =>
            (category === 'All' || project.category === category) &&
            (status === 'All' || project.status === status),
        ),
        [category, projects, status],
    )

    const [selectedMapProject, setSelectedMapProject] = useState<string | undefined>(projects[0]?._id)
    const completedCount = projects.filter((project) => project.status === 'Completed').length

    const categoryCounts = useMemo(
        () => getCounts(CATEGORY_FILTERS, projects.length, (item) => projects.filter((project) => project.category === item).length),
        [projects],
    )

    const statusCounts = useMemo(
        () => getCounts(STATUS_FILTERS, projects.length, (item) => projects.filter((project) => project.status === item).length),
        [projects],
    )

    const portfolioStats: PortfolioStat[] = [
        {
            icon: CheckCircle2,
            value: `${Math.max(completedCount, 500)}+`,
            label: 'Completed Projects',
            supportingText: 'Portfolio and legacy delivery record',
        },
        {
            icon: Route,
            value: '1,500+',
            label: 'Km Roads Constructed',
            supportingText: 'Roadworks, rehabilitation, and access infrastructure',
        },
        {
            icon: Building2,
            value: '20+',
            label: 'Years Experience',
            supportingText: 'Civil, infrastructure, and commercial delivery',
        },
        {
            icon: Users,
            value: 'Multi-team',
            label: 'Employees & Specialists',
            supportingText: 'Office, engineering, site, HSE, and delivery teams',
        },
    ]

    return (
        <div className="flex min-h-screen w-full flex-col bg-white dark:bg-slate-950">
            <PageHero
                title="Project Portfolio"
                description="Detailed infrastructure and construction case studies showing scale, delivery discipline, and measurable outcomes across Malawi."
                imageSrc="https://images.unsplash.com/photo-1545558014-8ab6aa17e307?q=80&w=2000&auto=format&fit=crop&fm=webp"
                imageAlt="Major construction project view"
            />

            <ProjectPortfolioStats stats={portfolioStats} />

            <section className="relative overflow-hidden px-6 py-20 md:py-28">
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(15,23,42,.045)_1px,transparent_1px),linear-gradient(rgba(15,23,42,.035)_1px,transparent_1px)] bg-[size:72px_72px] dark:bg-[linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px)]" />
                <div className="absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-slate-50 via-white to-transparent dark:from-slate-900 dark:via-slate-950" />

                <div className="mx-auto max-w-7xl">
                    <ProjectPortfolioFilters
                        category={category}
                        categoryCounts={categoryCounts}
                        filteredCount={filteredProjects.length}
                        onCategoryChange={setCategory}
                        onStatusChange={setStatus}
                        status={status}
                        statusCounts={statusCounts}
                    />

                    <ProjectPortfolioGrid isLoading={isLoading} projects={filteredProjects} />
                </div>
            </section>

            <MalawiProjectMap projects={projects} selectedId={selectedMapProject} onSelect={setSelectedMapProject} />
        </div>
    )
}
