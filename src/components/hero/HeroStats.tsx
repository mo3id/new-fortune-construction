import { HERO_STATS } from '@/lib/constants'
import { motion } from 'framer-motion'

export function HeroStats() {
    return (
        <div className="mt-24 lg:mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 border-t border-white/10 pt-12 max-w-4xl mx-auto">
            {HERO_STATS.map((stat, i) => (
                <motion.div 
                    key={stat.label} 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 + (i * 0.1) }}
                    className="text-center group"
                >
                    <p className="font-display text-3xl md:text-4xl font-black text-teal-500 group-hover:scale-110 transition-transform duration-500">{stat.value}</p>
                    <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase mt-3 transition-colors group-hover:text-slate-300">{stat.label}</p>
                </motion.div>
            ))}
        </div>
    )
}
