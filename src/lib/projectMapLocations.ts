import type { ProjectRecord } from '@/lib/projectPresentation'

export interface MapCoordinates {
    lat: number
    lng: number
}

export type SupportedMapCity = 'Lilongwe' | 'Blantyre' | 'Mzuzu' | 'Nkhata Bay'

export interface ResolvedMapProject {
    project: ProjectRecord
    position: MapCoordinates
    source: 'coordinates' | 'city-fallback'
    fallbackCity?: SupportedMapCity
}

const MALAWI_BOUNDS = {
    latMin: -17.2,
    latMax: -9.3,
    lngMin: 32.6,
    lngMax: 35.95,
}

export const MALAWI_MAP_CENTER: MapCoordinates = { lat: -13.2543, lng: 34.3015 }

export const CITY_FALLBACK_COORDINATES: Record<SupportedMapCity, MapCoordinates> = {
    Lilongwe: { lat: -13.9626, lng: 33.7741 },
    Blantyre: { lat: -15.7861, lng: 35.0058 },
    Mzuzu: { lat: -11.4656, lng: 34.0207 },
    'Nkhata Bay': { lat: -11.6066, lng: 34.2907 },
}

const CITY_MATCHERS: Array<{ city: SupportedMapCity; patterns: RegExp[] }> = [
    { city: 'Lilongwe', patterns: [/\blilongwe\b/i] },
    { city: 'Blantyre', patterns: [/\bblantyre\b/i] },
    { city: 'Mzuzu', patterns: [/\bmzuzu\b/i] },
    { city: 'Nkhata Bay', patterns: [/\bnkhata\s+bay\b/i, /\bnkhata\b/i] },
]

export function hasValidMapCoordinates(coordinates?: MapCoordinates): coordinates is MapCoordinates {
    if (!coordinates) return false
    const { lat, lng } = coordinates
    return (
        Number.isFinite(lat)
        && Number.isFinite(lng)
        && lat >= MALAWI_BOUNDS.latMin
        && lat <= MALAWI_BOUNDS.latMax
        && lng >= MALAWI_BOUNDS.lngMin
        && lng <= MALAWI_BOUNDS.lngMax
    )
}

export function findSupportedMapCity(location: string): SupportedMapCity | undefined {
    const normalized = location.trim()
    if (!normalized) return undefined
    return CITY_MATCHERS.find(({ patterns }) => patterns.some((pattern) => pattern.test(normalized)))?.city
}

export function resolveMapProject(project: ProjectRecord): ResolvedMapProject | undefined {
    if (hasValidMapCoordinates(project.coordinates)) {
        return {
            project,
            position: project.coordinates,
            source: 'coordinates',
        }
    }

    const fallbackCity = findSupportedMapCity(project.location)
    if (!fallbackCity) return undefined

    return {
        project,
        position: CITY_FALLBACK_COORDINATES[fallbackCity],
        source: 'city-fallback',
        fallbackCity,
    }
}

export function resolveMapProjects(projects: ProjectRecord[]): ResolvedMapProject[] {
    return projects
        .map(resolveMapProject)
        .filter((project): project is ResolvedMapProject => Boolean(project))
}
