import { Image } from './Image'
import { heroVisualFallback } from '@/lib/visualFallbacks'

interface PageHeroProps {
    title: string | React.ReactNode;
    description: string;
    imageSrc: string;
    imageAlt: string;
}

export function PageHero({ title, description, imageSrc, imageAlt }: PageHeroProps) {
    return (
        <section className="relative flex h-[58vh] min-h-[460px] items-center justify-center overflow-hidden md:min-h-[560px]">
            <div className="absolute inset-0">
                <Image 
                    src={imageSrc} 
                    alt={imageAlt} 
                    fallbackSrc={heroVisualFallback}
                    fallbackClassName="bg-slate-950 object-cover p-0"
                    className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/55 to-slate-950/86" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/60 to-transparent dark:from-slate-950 dark:via-slate-950/70" />
            </div>
            <div className="relative z-10 mx-auto mt-16 max-w-5xl px-6 text-center">
                <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-6xl">
                    {title}
                </h1>
                <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-teal-50/85 md:text-xl">
                    {description}
                </p>
            </div>
        </section>
    )
}
