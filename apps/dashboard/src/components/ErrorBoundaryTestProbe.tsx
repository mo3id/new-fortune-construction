export function ErrorBoundaryTestProbe() {
  if (import.meta.env.DEV) {
    const requestedError = new URLSearchParams(window.location.search).get('fortune_error')

    if (requestedError === 'runtime') {
      throw new Error('Development dashboard runtime error verification')
    }

    if (requestedError === 'chunk') {
      throw new Error('ChunkLoadError: Dashboard chunk load failed during development verification')
    }
  }

  return null
}
