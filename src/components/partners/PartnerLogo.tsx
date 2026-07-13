import { cn } from '@/lib/utils'
import { PartnerLogoProps } from '@/types'
import { motion } from 'framer-motion'

export function PartnerLogo({ partner, index }: PartnerLogoProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (index % 4) * 0.1 }}
            className={cn(
                "group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden"
            )}
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-teal-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            
            <div className="relative w-full aspect-square flex items-center justify-center mb-2">
                {partner.logo ? (
                    <img
                        src={partner.logo}
                        alt={partner.name}
                        className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700 opacity-40 group-hover:opacity-100"
                    />
                ) : (
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-display font-black text-2xl shadow-inner group-hover:scale-110 transition-transform duration-500"
                        style={{ backgroundColor: partner.color }}
                    >
                        {partner.abbr}
                    </div>
                )}
            </div>
            
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 text-center uppercase tracking-[0.2em] group-hover:text-teal-600 transition-colors duration-500">
                {partner.name}
            </p>
        </motion.div>
    )
}
