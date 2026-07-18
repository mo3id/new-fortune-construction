import { lazy, Suspense, type ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { authStorage } from './lib/auth'
import Layout from './components/Layout'

const Login = lazy(() => import('./pages/Login'))
const Overview = lazy(() => import('./pages/Overview'))
const Projects = lazy(() => import('./pages/Projects'))
const Applications = lazy(() => import('./pages/Applications'))
const Messages = lazy(() => import('./pages/Messages'))
const Jobs = lazy(() => import('./pages/Jobs'))
const Team = lazy(() => import('./pages/Team'))
const Partners = lazy(() => import('./pages/Partners'))
const Services = lazy(() => import('./pages/Services'))
const Settings = lazy(() => import('./pages/Settings'))
const PageContent = lazy(() => import('./pages/PageContent'))
const ProjectCategories = lazy(() => import('./pages/ProjectCategories'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function RouteLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-sm font-medium text-slate-500 dark:text-slate-400">
      Loading...
    </div>
  )
}

function withRouteFallback(element: ReactNode) {
  return <Suspense fallback={<RouteLoading />}>{element}</Suspense>
}

function PrivateRoute({ children }: { children: ReactNode }) {
  return authStorage.isLoggedIn() ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={withRouteFallback(<Login />)} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={withRouteFallback(<Overview />)} />
        <Route path="projects" element={withRouteFallback(<Projects />)} />
        <Route path="project-categories" element={withRouteFallback(<ProjectCategories />)} />
        <Route path="applications" element={withRouteFallback(<Applications />)} />
        <Route path="messages" element={withRouteFallback(<Messages />)} />
        <Route path="jobs" element={withRouteFallback(<Jobs />)} />
        <Route path="team" element={withRouteFallback(<Team />)} />
        <Route path="partners" element={withRouteFallback(<Partners />)} />
        <Route path="services" element={withRouteFallback(<Services />)} />
        <Route path="settings" element={withRouteFallback(<Settings />)} />
        <Route path="content" element={withRouteFallback(<PageContent />)} />
        <Route path="*" element={withRouteFallback(<NotFoundPage />)} />
      </Route>
      <Route path="*" element={<Navigate to={authStorage.isLoggedIn() ? '/' : '/login'} replace />} />
    </Routes>
  )
}
