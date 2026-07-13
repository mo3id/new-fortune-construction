import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { CheckCircle2, AlertTriangle, Info, Trash2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

export type ModalType = 'success' | 'error' | 'info' | 'destructive' | 'custom'

interface GlobalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  type?: ModalType
  children?: React.ReactNode
  trigger?: React.ReactNode
  actionText?: string
  cancelText?: string
  onAction?: () => void
  onCancel?: () => void
  isLoading?: boolean
  className?: string
}

export function GlobalModal({
  open,
  onOpenChange,
  title,
  description,
  type = 'info',
  children,
  trigger,
  actionText = 'Confirm',
  cancelText = 'Cancel',
  onAction,
  onCancel,
  isLoading = false,
  className,
}: GlobalModalProps) {
  const getIcon = () => {
    const iconBaseClass = "w-12 h-12 mb-6"
    switch (type) {
      case 'success':
        return <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-[2rem] flex items-center justify-center text-green-500 mb-8"><CheckCircle2 className="w-10 h-10" /></div>
      case 'error':
        return <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-[2rem] flex items-center justify-center text-red-500 mb-8"><AlertTriangle className="w-10 h-10" /></div>
      case 'destructive':
        return <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-[2rem] flex items-center justify-center text-red-500 mb-8"><Trash2 className="w-10 h-10" /></div>
      case 'info':
        return <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] flex items-center justify-center text-blue-500 mb-8"><Info className="w-10 h-10" /></div>
      default:
        return null
    }
  }

  const handleCancel = () => {
    if (onCancel) onCancel()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none bg-transparent shadow-none">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={cn(
                "bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 md:p-12 shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center relative",
                className
              )}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-500 to-teal-600" />
              
              {getIcon()}
              
              <DialogHeader className="space-y-4">
                <DialogTitle className="text-3xl font-display font-bold text-slate-900 dark:text-white leading-tight">
                  {title}
                </DialogTitle>
                {description ? (
                  <DialogDescription className="text-slate-500 dark:text-slate-400 text-lg font-light leading-relaxed">
                    {description}
                  </DialogDescription>
                ) : (
                  <DialogDescription className="sr-only">{title}</DialogDescription>
                )}
              </DialogHeader>

              {children && <div className="w-full mt-8 text-left">{children}</div>}

              {type !== 'custom' && (
                <DialogFooter className="flex flex-col sm:flex-row gap-4 w-full mt-10">
                  <Button 
                    variant="outline" 
                    onClick={handleCancel} 
                    disabled={isLoading} 
                    className="flex-1 h-14 font-bold uppercase tracking-widest text-[10px]"
                  >
                    {cancelText}
                  </Button>
                  {onAction && (
                    <Button
                      variant={type === 'destructive' || type === 'error' ? 'destructive' : 'default'}
                      onClick={onAction}
                      disabled={isLoading}
                      className="flex-1 h-14 font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-teal-500/10"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </div>
                      ) : actionText}
                    </Button>
                  )}
                </DialogFooter>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
