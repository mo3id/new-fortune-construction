import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-teal-600 text-white shadow shadow-teal-500/20",
        secondary:
          "border-transparent bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100",
        destructive:
          "border-transparent bg-rose-500 text-white shadow shadow-rose-500/20",
        outline: "text-slate-950 dark:text-slate-50 border-slate-200 dark:border-slate-800",
        teal: "border-transparent bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

function Badge({ className, variant, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
