import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'

const App = lazy(() => import('@/App'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'))
const ProjectDetailsPage = lazy(() => import('@/pages/ProjectDetailsPage'))
const ServicesPage = lazy(() => import('@/pages/ServicesPage'))
const HSEPage = lazy(() => import('@/pages/HSEPage'))
const CareersPage = lazy(() => import('@/pages/CareersPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const RouteErrorPage = lazy(() => import('@/pages/RouteErrorPage'))

function RouteLoading() {
    return (
        <div className="flex min-h-[50vh] items-center justify-center bg-white text-sm font-medium text-slate-500 dark:bg-slate-950 dark:text-slate-400">
            Loading...
        </div>
    )
}

function withRouteFallback(element: ReactNode) {
    return <Suspense fallback={<RouteLoading />}>{element}</Suspense>
}

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        errorElement: withRouteFallback(<RouteErrorPage />),
        children: [
            {
                index: true,
                element: withRouteFallback(<App />),
            },
            {
                path: 'about',
                element: withRouteFallback(<AboutPage />),
            },
            {
                path: 'projects',
                element: withRouteFallback(<ProjectsPage />),
            },
            {
                path: 'projects/:id',
                element: withRouteFallback(<ProjectDetailsPage />),
            },
            {
                path: 'services',
                element: withRouteFallback(<ServicesPage />),
            },
            {
                path: 'hse',
                element: withRouteFallback(<HSEPage />),
            },
            {
                path: 'careers',
                element: withRouteFallback(<CareersPage />),
            },
            {
                path: 'contact',
                element: withRouteFallback(<ContactPage />),
            },
            {
                path: '*',
                element: withRouteFallback(<NotFoundPage />),
            },
        ],
    },
])
