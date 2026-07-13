import { LucideIcon } from 'lucide-react'
import { Button } from './ui/button'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center bg-slate-50/50 dark:bg-slate-900/30 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
      {Icon && (
        <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex items-center justify-center text-slate-300 dark:text-slate-600 mb-8 border border-slate-100 dark:border-slate-700">
          <Icon className="w-10 h-10" />
        </div>
      )}
      <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-3 tracking-tight">{title}</h3>
      {description && (
        <p className="text-slate-500 dark:text-slate-400 max-w-md mb-10 font-light leading-relaxed">{description}</p>
      )}
      {action && (
        <Button 
          onClick={action.onClick}
          className="h-14 px-10 font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-teal-500/10"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
