export type AppErrorCategory = 'runtime' | 'route' | 'chunk-load' | 'network' | 'api-unavailable' | 'not-found' | 'unknown'

export class AppError extends Error {
    category: AppErrorCategory
    status?: number

    constructor(message: string, category: AppErrorCategory = 'unknown', status?: number) {
        super(message)
        this.name = 'AppError'
        this.category = category
        this.status = status
    }
}

export function isAppError(error: unknown): error is AppError {
    return error instanceof AppError
}

export function isChunkLoadError(error: unknown): boolean {
    const message = getErrorMessage(error).toLowerCase()
    return (
        message.includes('loading chunk') ||
        message.includes('chunkloaderror') ||
        message.includes('failed to fetch dynamically imported module') ||
        message.includes('importing a module script failed')
    )
}

export function classifyError(error: unknown): AppErrorCategory {
    if (isAppError(error)) return error.category
    if (isChunkLoadError(error)) return 'chunk-load'
    if (error instanceof TypeError && getErrorMessage(error).toLowerCase().includes('fetch')) return 'network'
    return 'unknown'
}

export function isNetworkUnavailableError(error: unknown): boolean {
    const category = classifyError(error)
    return category === 'network' || category === 'api-unavailable'
}

export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message
    if (typeof error === 'string') return error
    return 'Unknown error'
}

export function getSafeErrorMessage(error: unknown): string {
    const category = classifyError(error)

    if (category === 'chunk-load') {
        return 'The page could not finish loading. Please reload to get the latest version.'
    }

    if (category === 'network' || category === 'api-unavailable') {
        return 'We could not reach the service right now. Please check your connection and try again.'
    }

    if (category === 'not-found') {
        return 'The requested page could not be found.'
    }

    return 'Something went wrong. Please reload the page or return home.'
}

export function getTechnicalDetails(error: unknown): string | undefined {
    if (!import.meta.env.DEV) return undefined
    if (error instanceof Error) return error.stack || error.message
    if (typeof error === 'string') return error
    return undefined
}
