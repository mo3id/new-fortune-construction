import * as React from "react"

import { cn } from "../../lib/utils"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        data-slot="textarea"
        className={cn(
          "flex min-h-[120px] w-full rounded-lg border border-slate-200 bg-white dark:bg-slate-900 px-4 py-3 text-base transition-all outline-none placeholder:text-slate-400 focus-visible:border-teal-500 focus-visible:ring-4 focus-visible:ring-teal-500/10 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/10 md:text-sm dark:border-slate-800 dark:disabled:bg-slate-950",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Textarea.displayName = "Textarea"

export { Textarea }
