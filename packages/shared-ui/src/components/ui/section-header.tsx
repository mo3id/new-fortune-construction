import { cn } from "../../lib/utils"
import { motion } from "framer-motion"

export interface SectionHeaderProps {
  subtitle?: string
  title: string
  description?: string
  centered?: boolean
  className?: string
  dark?: boolean
}

export function SectionHeader({
  subtitle,
  title,
  description,
  centered = true,
  className,
  dark = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-20",
        centered ? "text-center" : "text-left",
        className
      )}
    >
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn(
            "inline-block px-4 py-1.5 mb-6 text-[10px] font-black tracking-[0.3em] uppercase rounded-full",
            dark 
              ? "text-teal-400 bg-teal-500/10 border border-teal-500/20" 
              : "text-teal-600 bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900/30"
          )}
        >
          {subtitle}
        </motion.p>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={cn(
          "text-4xl md:text-5xl font-display font-bold leading-tight tracking-tight",
          centered && "mx-auto max-w-3xl",
          dark ? "text-white" : "text-slate-900 dark:text-white"
        )}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={cn(
            "mt-6 mx-auto text-lg leading-relaxed font-light",
            centered && "max-w-2xl",
            dark ? "text-slate-400" : "text-slate-500 dark:text-slate-400"
          )}
        >
          {description}
        </motion.p>
      )}
      {centered && (
        <motion.div 
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="w-12 h-1 bg-teal-500 rounded-full mx-auto mt-10" 
        />
      )}
    </div>
  )
}
