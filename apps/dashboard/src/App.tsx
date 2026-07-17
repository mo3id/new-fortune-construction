import { Routes, Route, Navigate } from 'react-router-dom'
import { authStorage } from './lib/auth'
import Layout from './components/Layout'
import Login from './pages/Login'
import Overview from './pages/Overview'
import Projects from './pages/Projects'
import Applications from './pages/Applications'
import Messages from './pages/Messages'
import Jobs from './pages/Jobs'
import Team from './pages/Team'
import Partners from './pages/Partners'
import Services from './pages/Services'
import Settings from './pages/Settings'
import PageContent from './pages/PageContent'
import ProjectCategories from './pages/ProjectCategories'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return authStorage.isLoggedIn() ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="projects" element={<Projects />} />
        <Route path="project-categories" element={<ProjectCategories />} />
        <Route path="applications" element={<Applications />} />
        <Route path="messages" element={<Messages />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="team" element={<Team />} />
        <Route path="partners" element={<Partners />} />
        <Route path="services" element={<Services />} />
        <Route path="settings" element={<Settings />} />
        <Route path="content" element={<PageContent />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
