import { CalendarCheck } from 'lucide-react'
import type { ProjectRecord } from '@/lib/projectPresentation'
import { ProjectCaseStudyCard } from './ProjectCaseStudyCard'

interface ProjectPortfolioGridProps {
    isLoading: boolean
    projects: ProjectRecord[]
}

export function ProjectPortfolioGrid({ isLoading, projects }: ProjectPortfolioGridProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <div className="h-12 w-12 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
            </div>
        )
    }

    if (!projects.length) {
        return (
            <div className="border border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-700 dark:bg-slate-900">
                <CalendarCheck className="mx-auto mb-5 h-10 w-10 text-teal-600" />
                <h3 className="text-2xl font-display font-bold text-slate-950 dark:text-white">No projects match this filter</h3>
                <p className="mt-3 text-slate-500">Try another category or status to continue browsing the portfolio.</p>
            </div>
        )
    }

    return (
        <div className="grid gap-7 lg:grid-cols-2">
            {projects.map((project, index) => (
                <ProjectCaseStudyCard key={project._id} project={project} index={index} />
            ))}
        </div>
    )
}
