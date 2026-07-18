export function ErrorBoundaryTestProbe() {
    if (import.meta.env.DEV) {
        const requestedError = new URLSearchParams(window.location.search).get('fortune_error')

        if (requestedError === 'runtime') {
            throw new Error('Development runtime error verification')
        }

        if (requestedError === 'chunk') {
            throw new Error('ChunkLoadError: Loading chunk failed during development verification')
        }
    }

    return null
}
