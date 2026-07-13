import { Image } from '@fortune/shared-ui'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ServiceCardProps } from '@/types'

export function ServiceCard({ service, index }: ServiceCardProps) {
    return (
        <div
            className={cn(
                `reveal reveal-delay-${index + 1}`,
                "group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/20 overflow-hidden flex flex-col hover:-translate-y-2 transition-all duration-500"
            )}
        >
            {/* Image Section */}
            <div className="relative h-64 overflow-hidden">
                <Image
                    src={service.bgImage}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-60" />
                <div className="absolute bottom-6 left-8 flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center text-white shadow-xl">
                        {service.icon}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-10 flex flex-col relative">
                <div className={cn(
                    "absolute top-0 left-10 w-12 h-1 -translate-y-full",
                    service.accentColor.replace('border-', 'bg-')
                )} />
                
                <p className="text-teal-600 dark:text-teal-400 text-[10px] font-black tracking-[0.3em] uppercase mb-3">{service.tagline}</p>
                <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-teal-600 transition-colors duration-300">{service.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 font-light">{service.description}</p>

                <div className="space-y-3 mb-10 flex-grow">
                    {service.features.map((feat) => (
                        <div key={feat} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 group/item">
                            <div className="w-1 h-1 rounded-full bg-teal-500" />
                            <span className="font-medium">{feat}</span>
                        </div>
                    ))}
                </div>

                <Link 
                    to="/contact"
                    className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 font-black uppercase tracking-widest text-[10px] group/btn mt-auto"
                >
                    Project Inquiry 
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    )
}
