import * as React from "react"
import { cn } from "../../lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div className={cn("max-w-7xl mx-auto px-6 md:px-12 lg:px-20", className)} {...props}>
      {children}
    </div>
  )
}
