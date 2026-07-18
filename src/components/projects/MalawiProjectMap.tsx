import { useMemo, useState } from 'react'
import { ExternalLink, MapPin, Navigation, Satellite, AlertTriangle } from 'lucide-react'
import L from 'leaflet'
import { Link } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import type { ProjectRecord } from '@/lib/projectPresentation'
import {
    MALAWI_MAP_CENTER,
    resolveMapProjects,
    type ResolvedMapProject,
} from '@/lib/projectMapLocations'

interface MalawiProjectMapProps {
    projects: ProjectRecord[]
}

const projectMarkerIcon = L.divIcon({
    className: 'fortune-project-marker',
    html: '<span aria-hidden="true"></span>',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -24],
})

function MapFallback({
    title,
    description,
    tone = 'empty',
}: {
    title: string
    description: string
    tone?: 'empty' | 'error'
}) {
    const Icon = tone === 'error' ? AlertTriangle : Satellite

    return (
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900/70">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-teal-700 shadow-sm dark:bg-slate-950 dark:text-teal-300">
                <Icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-display font-bold text-slate-950 dark:text-white">{title}</h3>
            <p className="mt-3 max-w-sm text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">{description}</p>
        </div>
    )
}

function ProjectPopup({ item }: { item: ResolvedMapProject }) {
    const { project, source, fallbackCity } = item

    return (
        <div className="w-[220px] space-y-3 text-slate-700">
            <div>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">{project.category}</div>
                <h3 className="mt-1 text-base font-display font-bold leading-snug text-slate-950">{project.title}</h3>
            </div>
            <p className="text-sm font-semibold leading-5 text-slate-600">{project.location} • {project.status}</p>
            {source === 'city-fallback' && fallbackCity && (
                <p className="rounded bg-teal-50 px-2 py-1 text-[11px] font-bold text-teal-800">
                    Approximate city location: {fallbackCity}
                </p>
            )}
            <Link
                to={`/projects/${project._id}`}
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-teal-700 transition-colors hover:text-teal-900"
            >
                View Case Study <ExternalLink className="h-3.5 w-3.5" />
            </Link>
        </div>
    )
}

export function MalawiProjectMap({ projects }: MalawiProjectMapProps) {
    const devMapState = import.meta.env.DEV ? new URLSearchParams(window.location.search).get('mapState') : null
    const locatedProjects = useMemo(
        () => (devMapState === 'empty' ? [] : resolveMapProjects(projects)),
        [devMapState, projects],
    )
    const [mapUnavailable, setMapUnavailable] = useState(devMapState === 'fail')

    const completedCount = locatedProjects.filter(({ project }) => project.status === 'Completed').length
    const ongoingCount = locatedProjects.filter(({ project }) => project.status === 'Ongoing').length

    return (
        <aside className="sticky top-24 self-start rounded-lg border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950 md:p-7">
            <div>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.22em] text-teal-700 dark:text-teal-300">Map view</span>
                        <h2 className="mt-2 text-2xl font-display font-bold text-slate-950 dark:text-white">Projects Across Malawi</h2>
                    </div>
                    <span className="rounded bg-teal-50 px-3 py-2 text-xs font-black text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
                        {projects.length}
                    </span>
                </div>
                <div className="mt-5 flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 fill-teal-700 text-teal-700" />
                    <div>
                        <div className="text-base font-black text-slate-900 dark:text-white">Active & Completed Projects</div>
                        <div className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
                            Showing the project list provided to this map
                        </div>
                    </div>
                </div>

                <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
                    {mapUnavailable ? (
                        <MapFallback
                            tone="error"
                            title="Project map unavailable"
                            description="We could not load the interactive map right now. The project list remains available on this page."
                        />
                    ) : locatedProjects.length === 0 ? (
                        <MapFallback
                            title="No mapped project locations"
                            description="No projects currently include usable coordinates or a supported Malawi city fallback for the map."
                        />
                    ) : (
                        <div className="h-[420px] w-full md:h-[500px]" data-testid="interactive-project-map">
                            <MapContainer
                                center={[MALAWI_MAP_CENTER.lat, MALAWI_MAP_CENTER.lng]}
                                zoom={6}
                                minZoom={5}
                                maxZoom={13}
                                scrollWheelZoom={false}
                                className="h-full w-full"
                                aria-label="Interactive project locations across Malawi"
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    eventHandlers={{
                                        tileerror: () => setMapUnavailable(true),
                                    }}
                                />
                                {locatedProjects.map((item) => (
                                    <Marker
                                        key={item.project._id}
                                        icon={projectMarkerIcon}
                                        position={[item.position.lat, item.position.lng]}
                                    >
                                        <Popup>
                                            <ProjectPopup item={item} />
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    )}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm font-semibold text-slate-500">
                    <div className="flex items-center gap-3 rounded border border-slate-200 px-3 py-3 dark:border-slate-800">
                        <MapPin className="h-5 w-5 fill-teal-700 text-teal-700" />
                        <span>{completedCount} completed</span>
                    </div>
                    <div className="flex items-center gap-3 rounded border border-slate-200 px-3 py-3 dark:border-slate-800">
                        <Navigation className="h-5 w-5 text-slate-400" />
                        <span>{ongoingCount} ongoing</span>
                    </div>
                </div>

                <Link
                    to="/projects"
                    className="mt-5 flex h-14 w-full items-center justify-center gap-3 rounded border border-teal-700 bg-white px-6 text-sm font-black text-slate-700 transition-colors hover:bg-teal-50 dark:bg-slate-950 dark:text-slate-100"
                >
                    View Project Map
                    <ExternalLink className="h-5 w-5" />
                </Link>
            </div>
        </aside>
    )
}
