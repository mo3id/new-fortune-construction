import { useMemo, useState } from 'react'
import { ExternalLink, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ProjectRecord } from '@/lib/projectPresentation'

interface MalawiProjectMapProps {
    projects: ProjectRecord[]
}

const MAP_MARKERS = [
    { label: 'Chitipa', x: 29, y: 18, status: 'Completed' },
    { label: 'Mzuzu', x: 56, y: 30, status: 'Completed' },
    { label: 'Kasungu', x: 48, y: 43, status: 'Completed' },
    { label: 'Lilongwe', x: 56, y: 55, status: 'Completed', featured: true },
    { label: 'Salima', x: 73, y: 57, status: 'Completed' },
    { label: 'Mangochi', x: 86, y: 67, status: 'Completed' },
    { label: 'Zomba', x: 81, y: 77, status: 'Completed' },
    { label: 'Blantyre', x: 82, y: 88, status: 'Completed' },
]

const LOCATION_POSITIONS: Record<string, { x: number; y: number }> = {
    chitipa: { x: 29, y: 18 },
    mzuzu: { x: 56, y: 30 },
    kasungu: { x: 48, y: 43 },
    lilongwe: { x: 56, y: 55 },
    salima: { x: 73, y: 57 },
    mangochi: { x: 86, y: 67 },
    zomba: { x: 81, y: 77 },
    blantyre: { x: 82, y: 88 },
}

function getMarkerPosition(project: ProjectRecord) {
    if (project.coordinates) {
        const latMin = -17.2
        const latMax = -9.3
        const lngMin = 32.6
        const lngMax = 35.9
        const x = ((project.coordinates.lng - lngMin) / (lngMax - lngMin)) * 68 + 16
        const y = ((latMax - project.coordinates.lat) / (latMax - latMin)) * 82 + 8
        return {
            x: Math.min(92, Math.max(16, x)),
            y: Math.min(94, Math.max(8, y)),
        }
    }

    const location = project.location.toLowerCase()
    const key = Object.keys(LOCATION_POSITIONS).find((name) => location.includes(name))
    return key ? LOCATION_POSITIONS[key] : undefined
}

export function MalawiProjectMap({ projects }: MalawiProjectMapProps) {
    const locatedProjects = useMemo(
        () => projects
            .map((project) => ({ project, point: getMarkerPosition(project) }))
            .filter((item): item is { project: ProjectRecord; point: { x: number; y: number } } => Boolean(item.point)),
        [projects],
    )
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const selectedProject = locatedProjects.find((item) => item.project._id === selectedId)?.project || locatedProjects[0]?.project

    return (
        <aside className="sticky top-24 self-start rounded-lg border border-slate-200 bg-white p-7 shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950">
            <div className="min-h-[700px]">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.22em] text-teal-700 dark:text-teal-300">Map view</span>
                        <h2 className="mt-2 text-2xl font-display font-bold text-slate-950 dark:text-white">Projects Across Malawi</h2>
                    </div>
                    <span className="rounded bg-teal-50 px-3 py-2 text-xs font-black text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
                        {Math.max(projects.length, 16)}+
                    </span>
                </div>
                <div className="mt-5 flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 fill-teal-700 text-teal-700" />
                    <div>
                        <div className="text-base font-black text-slate-900 dark:text-white">Active & Completed Projects</div>
                        <div className="mt-1 text-sm font-semibold text-slate-500">Nationwide delivery footprint</div>
                    </div>
                </div>

                <div className="relative mx-auto mt-8 h-[500px] max-w-[420px] rounded-lg bg-slate-50 p-2 dark:bg-slate-900/60">
                    <svg viewBox="0 0 360 520" className="h-full w-full" role="img" aria-label="Project locations across Malawi">
                        <path
                            d="M168 18 C205 54 215 91 198 130 C184 163 214 201 197 238 C183 270 145 282 162 322 C176 356 216 378 206 416 C199 449 159 468 154 511 C131 474 105 443 111 403 C117 366 145 346 126 310 C105 270 126 242 139 214 C154 179 129 151 142 116 C154 82 140 45 168 18 Z"
                            fill="#f8fafc"
                            stroke="#dbe4ea"
                            strokeWidth="3"
                        />
                        <path
                            d="M202 58 C230 103 219 160 237 214 C255 270 230 327 247 391 C260 439 236 476 215 504"
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth="2"
                        />
                        <path
                            d="M252 87 C302 143 314 231 299 313 C288 372 307 426 285 500 C327 443 346 351 331 274 C319 209 319 142 289 98 Z"
                            fill="#dbeafe"
                            opacity=".65"
                        />
                        <text x="281" y="298" fill="#7aa8d9" fontSize="16" fontWeight="700" transform="rotate(-5 281 298)">Lake Malawi</text>
                        <path d="M54 95 C103 127 125 161 111 212 C96 265 42 289 49 350" fill="none" stroke="#eef2f7" strokeWidth="2" />
                        <path d="M118 52 C111 109 123 163 158 199 C190 232 190 277 162 319" fill="none" stroke="#eef2f7" strokeWidth="2" />
                        <path d="M147 376 C177 390 201 421 190 468" fill="none" stroke="#eef2f7" strokeWidth="2" />
                    </svg>

                    {(locatedProjects.length ? locatedProjects : MAP_MARKERS.map((marker) => ({ project: null, point: marker }))).map((item) => {
                        const project = item.project
                        const point = item.point
                        const active = project?._id === selectedProject?._id
                        const label = project?.location.split(',')[0] || ('label' in point ? point.label : 'Project')
                        const status = project?.status || ('status' in point ? point.status : 'Completed')

                        return (
                            <button
                                key={project?._id || label}
                                type="button"
                                onClick={() => project && setSelectedId(project._id)}
                                className="absolute flex items-center gap-2 text-left"
                                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                                aria-label={project ? `Select ${project.title}` : label}
                            >
                                <span
                                    className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-lg transition-all ${
                                        active ? 'h-12 w-12 bg-teal-700 ring-4 ring-teal-200' : status === 'Ongoing' ? 'h-8 w-8 bg-slate-500' : 'h-8 w-8 bg-teal-700'
                                    }`}
                                >
                                    <MapPin className={`${active ? 'h-7 w-7' : 'h-4 w-4'} fill-current`} />
                                </span>
                                <span className={`-translate-y-1/2 whitespace-nowrap rounded-full bg-white/85 px-2 py-1 text-xs font-black text-slate-700 shadow-sm ${active ? 'text-sm text-teal-800' : ''}`}>
                                    {label}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {selectedProject && (
                    <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-teal-700 dark:text-teal-300">{selectedProject.category}</div>
                        <h3 className="mt-2 text-lg font-display font-bold text-slate-950 dark:text-white">{selectedProject.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-slate-500">{selectedProject.location} • {selectedProject.status}</p>
                        <Link to={`/projects/${selectedProject._id}`} className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-300">
                            View Case Study <ExternalLink className="h-4 w-4" />
                        </Link>
                    </div>
                )}

                <div className="mt-3 space-y-3 text-sm font-semibold text-slate-500">
                    <div className="flex items-center gap-3">
                        <MapPin className="h-6 w-6 fill-white text-teal-700" />
                        Completed
                    </div>
                    <div className="flex items-center gap-3">
                        <MapPin className="h-6 w-6 text-slate-400" />
                        Ongoing
                    </div>
                </div>

                <Link
                    to="/projects"
                    className="mt-8 flex h-14 w-full items-center justify-center gap-3 rounded border border-teal-700 bg-white px-6 text-sm font-black text-slate-700 transition-colors hover:bg-teal-50 dark:bg-slate-950 dark:text-slate-100"
                >
                    View Project Map
                    <ExternalLink className="h-5 w-5" />
                </Link>
            </div>
        </aside>
    )
}
