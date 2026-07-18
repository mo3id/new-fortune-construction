import { describe, expect, it } from 'vitest'
import type { ProjectRecord } from '@/lib/projectPresentation'
import {
    CITY_FALLBACK_COORDINATES,
    findSupportedMapCity,
    resolveMapProject,
    resolveMapProjects,
} from '@/lib/projectMapLocations'

function project(overrides: Partial<ProjectRecord>): ProjectRecord {
    return {
        _id: 'project-1',
        title: 'Test Project',
        category: 'Roads',
        status: 'Completed',
        location: 'Malawi',
        clientName: 'Client',
        projectValue: 'Available on request',
        budget: 'Available on request',
        duration: 'Timeline available on request',
        yearCompleted: '2026',
        overview: 'Overview',
        scopeOfWork: [],
        technologies: [],
        challenge: 'Challenge',
        solution: 'Solution',
        result: 'Result',
        coverImage: '',
        galleryImages: [],
        ...overrides,
    }
}

describe('project map location resolver', () => {
    it('prefers valid explicit coordinates over city fallback', () => {
        const source = project({
            category: 'Commercial',
            location: 'Lilongwe, Malawi',
            coordinates: { lat: -12.5, lng: 34.1 },
        })

        const resolved = resolveMapProject(source)

        expect(resolved?.source).toBe('coordinates')
        expect(resolved?.position).toEqual({ lat: -12.5, lng: 34.1 })
        expect(resolved?.project.category).toBe('Commercial')
    })

    it.each([
        ['Lilongwe', 'Lilongwe, Malawi'],
        ['Blantyre', 'Blantyre CBD'],
        ['Mzuzu', 'Mzuzu to Nkhata Bay'],
        ['Nkhata Bay', 'Nkhata Bay lakeshore works'],
    ] as const)('resolves %s fallback coordinates', (city, location) => {
        const resolved = resolveMapProject(project({ location }))

        expect(resolved?.source).toBe('city-fallback')
        expect(resolved?.fallbackCity).toBe(city)
        expect(resolved?.position).toEqual(CITY_FALLBACK_COORDINATES[city])
    })

    it('matches Nkhata as a deterministic Nkhata Bay fallback', () => {
        expect(findSupportedMapCity('Mzuzu to Nkhata')).toBe('Mzuzu')
        expect(findSupportedMapCity('Nkhata coastal works')).toBe('Nkhata Bay')
    })

    it('excludes projects without valid coordinates or supported city fallback', () => {
        const resolved = resolveMapProjects([
            project({ _id: 'valid', location: 'Blantyre' }),
            project({ _id: 'invalid', location: 'Unmapped Location', coordinates: { lat: 0, lng: 0 } }),
        ])

        expect(resolved).toHaveLength(1)
        expect(resolved[0].project._id).toBe('valid')
    })
})
