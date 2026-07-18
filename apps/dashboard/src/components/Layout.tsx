import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { LogOut, Bell, Menu, User } from 'lucide-react'
import { authStorage } from '../lib/auth'
import Sidebar from './Sidebar'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Button } from '@fortune/shared-ui'

export default function Layout() {
  const navigate = useNavigate()
  const user = authStorage.getUser()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { data: stats, isError: statsHasError } = useQuery({
    queryKey: ['stats'],
    queryFn: () => api.get('/stats').then(r => r.data),
    refetchInterval: 60_000,
  })

  const notifCount = statsHasError ? 0 : (stats?.unreadMessages || 0) + (stats?.newApplications || 0)

  const handleLogout = () => {
    authStorage.clear()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 px-4 md:px-8 flex-shrink-0 z-10">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-500 shadow-sm transition-colors hover:border-teal-200 hover:text-teal-600 dark:border-slate-800 dark:bg-slate-900 md:hidden"
              aria-label="Open dashboard navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-1">Corporate Dashboard</p>
              <h1 className="truncate text-base font-display font-bold text-slate-900 dark:text-white">Admin Control Center</h1>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4 md:gap-6">
            {/* Notification bell */}
            <button
              className="relative p-2.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800 group"
              title={statsHasError ? 'Notifications temporarily unavailable' : 'Notifications'}
            >
              <Bell className="w-5 h-5 text-slate-400 group-hover:text-teal-600 transition-colors" />
              {notifCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-teal-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-950 shadow-sm">
                  {notifCount > 9 ? '9+' : notifCount}
                </span>
              )}
            </button>
            {/* User */}
            <div className="flex items-center gap-3 border-l border-slate-100 pl-3 dark:border-slate-800 sm:gap-4 sm:pl-6">
              <div className="flex flex-col items-end hidden sm:flex">
                <p className="text-sm font-bold text-slate-900 dark:text-white capitalize leading-none mb-1">{user?.username || 'Admin'}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Super Administrator</p>
              </div>
              <div className="hidden h-10 w-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg shadow-teal-500/20 ring-2 ring-white dark:ring-slate-950 sm:flex items-center justify-center overflow-hidden">
                <User className="w-5 h-5 text-white" />
              </div>
              <Button variant="ghost" size="icon-sm" onClick={handleLogout} className="hover:bg-rose-50 hover:text-rose-500 text-slate-400" title="Logout">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
