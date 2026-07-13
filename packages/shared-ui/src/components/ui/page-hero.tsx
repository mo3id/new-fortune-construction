import { Image } from './image'
import { motion } from 'framer-motion'

interface PageHeroProps {
    title: string | React.ReactNode;
    description: string;
    imageSrc: string;
    imageAlt: string;
}

export function PageHero({ title, description, imageSrc, imageAlt }: PageHeroProps) {
    return (
        <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden dark">
            <div className="absolute inset-0">
                <Image 
                    src={imageSrc} 
                    alt={imageAlt} 
                    className="w-full h-full object-cover object-center scale-105"
                />
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 opacity-80" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />
            </div>
            
            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-8 leading-[1.1] tracking-tight">
                        {title}
                    </h1>
                    <div className="w-12 h-1 bg-teal-500 rounded-full mx-auto mb-8 shadow-[0_0_15px_rgba(20,184,166,0.5)]" />
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
                        {description}
                    </p>
                </motion.div>
            </div>

            {/* Decorative background element */}
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
        </section>
    )
}
