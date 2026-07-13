import { TestimonialCardProps } from '@/types'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 md:p-12 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/20 relative group"
        >
            <div className="absolute top-0 right-12 w-16 h-16 bg-teal-50 dark:bg-teal-900/20 rounded-b-3xl flex items-center justify-center text-teal-500 shadow-sm border-x border-b border-teal-100 dark:border-teal-900/30">
                <Quote className="w-6 h-6 fill-current" />
            </div>
            
            <p className="text-slate-600 dark:text-slate-300 italic text-lg md:text-xl leading-relaxed mb-10 font-light relative z-10">
                "{testimonial.quote}"
            </p>
            
            <div className="flex items-center gap-5 pt-8 border-t border-slate-50 dark:border-slate-800">
                <div className="w-14 h-14 bg-slate-900 dark:bg-black rounded-2xl flex items-center justify-center text-white font-display font-black text-sm flex-shrink-0 shadow-lg group-hover:bg-teal-600 transition-colors duration-500">
                    {testimonial.initials}
                </div>
                <div>
                    <p className="font-bold text-slate-900 dark:text-white text-base">{testimonial.author}</p>
                    <p className="text-teal-600 dark:text-teal-500 text-[10px] font-black uppercase tracking-[0.2em]">{testimonial.org}</p>
                </div>
            </div>
        </motion.div>
    )
}
