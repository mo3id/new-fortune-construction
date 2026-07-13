import { Wrench, BarChart3, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

const WHY_US = [
    { icon: <Wrench className="w-6 h-6" />, title: 'Elite Engineering Teams', desc: 'Licensed senior engineers and specialized technical consultants leading every project phase.' },
    { icon: <BarChart3 className="w-6 h-6" />, title: 'Strategic Execution', desc: 'Precision project management ensuring optimized delivery timelines and resource efficiency.' },
    { icon: <ShieldCheck className="w-6 h-6" />, title: 'Uncompromising Quality', desc: 'Rigorous multi-tier QA protocols from structural foundation to architectural finishing.' },
]

export function WhyUs() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WHY_US.map((item, i) => (
                <motion.div 
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-500 group"
                >
                    <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-teal-600 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                        {item.icon}
                    </div>
                    <div>
                        <p className="font-display font-bold text-slate-900 dark:text-white text-lg mb-2">{item.title}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-light">{item.desc}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
