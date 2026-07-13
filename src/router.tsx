import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import App from '@/App'
import AboutPage from '@/pages/AboutPage'
import ProjectsPage from '@/pages/ProjectsPage'
import ProjectDetailsPage from '@/pages/ProjectDetailsPage'
import HSEPage from '@/pages/HSEPage'
import CareersPage from '@/pages/CareersPage'
import ContactPage from '@/pages/ContactPage'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <App />,
            },
            {
                path: 'about',
                element: <AboutPage />,
            },
            {
                path: 'projects',
                element: <ProjectsPage />,
            },
            {
                path: 'projects/:id',
                element: <ProjectDetailsPage />,
            },
            {
                path: 'hse',
                element: <HSEPage />,
            },
            {
                path: 'careers',
                element: <CareersPage />,
            },
            {
                path: 'contact',
                element: <ContactPage />,
            },
        ],
    },
])
