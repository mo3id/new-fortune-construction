import { Image } from './Image'
import { motion } from 'framer-motion'

interface PageHeroProps {
    title: string | React.ReactNode;
    description: string;
    imageSrc: string;
    imageAlt: string;
}

export function PageHero({ title, description, imageSrc, imageAlt }: PageHeroProps) {
    return (
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
                <Image 
                    src={imageSrc} 
                    alt={imageAlt} 
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-navy-900/90 via-navy-900/70 to-navy-900/90" />
            </div>
            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight"
                >
                    {title}
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    className="text-lg md:text-xl text-teal-50/80 max-w-2xl mx-auto font-sans font-light leading-relaxed"
                >
                    {description}
                </motion.p>
            </div>
        </section>
    )
}
