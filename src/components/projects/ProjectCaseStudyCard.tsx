import { Image } from '@fortune/shared-ui'
import { motion } from 'framer-motion'
import { ArrowRight, CircleDot, MapPin, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ProjectRecord } from '@/lib/projectPresentation'

export function ProjectCaseStudyCard({ project, index }: { project: ProjectRecord; index: number }) {
    const featured = index === 0

    return (
        <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.3) }}
            className={`group relative grid overflow-hidden border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-1 hover:border-teal-300 hover:shadow-[0_28px_90px_rgba(15,23,42,0.16)] dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/30 ${
                featured ? 'lg:col-span-2 lg:grid-cols-[1.1fr_0.9fr]' : ''
            }`}
        >
            <div className="pointer-events-none absolute right-0 top-0 z-10 hidden h-24 w-24 border-l border-b border-slate-200/70 bg-[linear-gradient(135deg,transparent_47%,rgba(20,184,166,.18)_48%,rgba(20,184,166,.18)_52%,transparent_53%)] dark:border-slate-800 lg:block" />

            <Link to={`/projects/${project._id}`} className="relative block min-h-[390px] overflow-hidden bg-slate-200">
                <Image
                    src={project.coverImage}
                    alt={project.title}
                    className="h-full min-h-[390px] w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
                <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-950/45 to-transparent" />
                <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                    <span className="bg-teal-500 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-xl shadow-teal-950/20">
                        {project.category}
                    </span>
                    <span className="bg-white/95 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-950 shadow-xl">
                        {project.status}
                    </span>
                </div>
                <div className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center border border-white/20 bg-white/10 text-[11px] font-black uppercase tracking-[0.14em] text-white backdrop-blur-md">
                    {String(index + 1).padStart(2, '0')}
                </div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="mb-3 flex items-center text-sm font-semibold text-teal-100">
                        <MapPin className="mr-2 h-4 w-4" />
                        {project.location}
                    </div>
                    <h3 className="max-w-2xl text-3xl font-display font-bold leading-tight tracking-tight">
                        {project.title}
                    </h3>
                </div>
            </Link>

            <div className="relative flex min-h-[390px] flex-col p-7 md:p-8">
                <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-5 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center bg-slate-950 text-white dark:bg-teal-500 dark:text-slate-950">
                            <ShieldCheck className="h-5 w-5" />
                        </span>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Case Study</div>
                            <div className="text-sm font-bold text-slate-950 dark:text-white">Delivery Snapshot</div>
                        </div>
                    </div>
                    <CircleDot className="h-5 w-5 text-teal-500" />
                </div>

                <dl className="grid grid-cols-2 gap-x-5 gap-y-5 text-sm">
                    {[
                        ['Client', project.clientName],
                        ['Value', project.projectValue],
                        ['Year', project.yearCompleted],
                        ['Duration', project.duration],
                    ].map(([label, value]) => (
                        <div key={label}>
                            <dt className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</dt>
                            <dd className="mt-1 font-bold text-slate-900 dark:text-white">{value}</dd>
                        </div>
                    ))}
                </dl>

                <p className="mt-7 line-clamp-4 border-t border-slate-100 pt-6 text-sm leading-7 text-slate-600 dark:border-slate-800 dark:text-slate-300">
                    {project.overview}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                        <span
                            key={tech}
                            className="border border-slate-200 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:border-slate-800 dark:text-slate-400"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                <Link
                    to={`/projects/${project._id}`}
                    className="mt-auto inline-flex items-center pt-8 text-[11px] font-black uppercase tracking-[0.18em] text-teal-700 transition-colors hover:text-slate-950 dark:text-teal-300 dark:hover:text-white"
                >
                    View Case Study
                    <span className="ml-4 flex h-9 w-9 items-center justify-center border border-teal-200 transition-all group-hover:border-slate-950 group-hover:bg-slate-950 group-hover:text-white dark:border-teal-500/30 dark:group-hover:border-white dark:group-hover:bg-white dark:group-hover:text-slate-950">
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                </Link>
            </div>
        </motion.article>
    )
}
