import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from './router'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ErrorBoundaryTestProbe } from './components/ErrorBoundaryTestProbe'
import './styles/globals.css'
import 'leaflet/dist/leaflet.css'
import '@fontsource/outfit/latin-400.css'
import '@fontsource/outfit/latin-600.css'
import '@fontsource/outfit/latin-700.css'
import '@fontsource/outfit/latin-800.css'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
                <ErrorBoundaryTestProbe />
                <RouterProvider router={router} />
            </ErrorBoundary>
        </QueryClientProvider>
    </React.StrictMode>
)
