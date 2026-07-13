import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, FolderKanban, Briefcase, MessageSquare,
  Users, Handshake, Settings, Wrench, HardHat, ChevronRight, FileText, Trophy,
} from 'lucide-react'
import { cn } from '@fortune/shared-ui'

const NAV = [
  { label: 'Overview', icon: LayoutDashboard, to: '/' },
  { label: 'Projects', icon: FolderKanban, to: '/projects' },
  { label: 'Services', icon: Wrench, to: '/services' },
  { label: 'Team', icon: Users, to: '/team' },
  { label: 'Partners', icon: Handshake, to: '/partners' },
  { label: 'Job Positions', icon: HardHat, to: '/jobs' },
  { label: 'Applications', icon: Briefcase, to: '/applications' },
  { label: 'Messages', icon: MessageSquare, to: '/messages' },
  { label: 'Page Content', icon: FileText, to: '/content' },
  { label: 'Settings', icon: Settings, to: '/settings' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 bg-slate-950 text-white flex flex-col h-full shadow-2xl z-20">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
            <HardHat className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-base font-display font-bold text-white tracking-tight leading-none mb-1">Fortune</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] leading-none">Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-1.5 custom-scrollbar">
        {NAV.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden',
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-teal-600 shadow-lg shadow-teal-500/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={cn('w-4 h-4 flex-shrink-0 transition-all duration-300 relative z-10', isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-teal-400')} />
                <span className="flex-1 relative z-10">{label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-70 relative z-10" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-6 border-t border-slate-800/50">
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-teal-500/30 hover:bg-slate-900 transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse shadow-sm shadow-teal-500/50" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-200 transition-colors">Live Site</span>
          </div>
          <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all" />
        </a>
      </div>
    </aside>
  )
}
