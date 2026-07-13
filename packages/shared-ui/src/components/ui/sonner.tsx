import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CheckCircle2, Info, AlertTriangle, XCircle, Loader2 } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <CheckCircle2 className="w-4 h-4" />,
        info: <Info className="w-4 h-4" />,
        warning: <AlertTriangle className="w-4 h-4" />,
        error: <XCircle className="w-4 h-4" />,
        loading: <Loader2 className="w-4 h-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-white dark:group-[.toaster]:bg-slate-900 group-[.toaster]:text-slate-900 dark:group-[.toaster]:text-white group-[.toaster]:border-slate-100 dark:group-[.toaster]:border-slate-800 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl p-4",
          description: "group-[.toast]:text-slate-500 dark:group-[.toast]:text-slate-400 font-light text-xs",
          actionButton: "group-[.toast]:bg-teal-600 group-[.toast]:text-white group-[.toast]:rounded-xl group-[.toast]:font-bold group-[.toast]:uppercase group-[.toast]:tracking-widest group-[.toast]:text-[10px] h-9",
          cancelButton: "group-[.toast]:bg-slate-100 dark:group-[.toast]:bg-slate-800 group-[.toast]:text-slate-500 group-[.toast]:rounded-xl group-[.toast]:font-bold group-[.toast]:uppercase group-[.toast]:tracking-widest group-[.toast]:text-[10px] h-9",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
