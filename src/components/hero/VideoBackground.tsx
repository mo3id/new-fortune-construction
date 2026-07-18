import { cn } from '@/lib/utils'
import { HERO_VIDEOS } from '@/lib/constants'

interface Props { currentIndex: number; videos?: string[] }

function isYouTubeUrl(url: string): boolean {
    return /youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\//.test(url)
}

function getYouTubeEmbedUrl(url: string): string {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/)
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}&controls=0&showinfo=0&rel=0` : url
}

export function VideoBackground({ currentIndex, videos }: Props) {
    const srcs = videos?.length ? videos : HERO_VIDEOS
    const nextIndex = srcs.length ? (currentIndex + 1) % srcs.length : 0

    return (
        <div className="absolute inset-0 z-0">
            {srcs.map((src, index) => {
                const isYT = isYouTubeUrl(src)
                const isActive = index === currentIndex
                const shouldWarmVideo = !isYT && index === nextIndex
                const shouldRender = isActive || shouldWarmVideo
                if (!shouldRender) return null

                return isYT ? (
                    <iframe
                        key={src}
                        src={isActive ? getYouTubeEmbedUrl(src) : undefined}
                        className={cn(
                            'absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 pointer-events-none',
                            isActive ? 'opacity-100' : 'opacity-0'
                        )}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        style={{ border: 'none' }}
                    />
                ) : (
                    <video
                        key={src}
                        className={cn(
                            'absolute inset-0 w-full h-full object-cover transition-opacity duration-1000',
                            isActive ? 'opacity-100' : 'opacity-0'
                        )}
                        autoPlay={isActive}
                        muted
                        loop
                        playsInline
                        preload={isActive ? 'auto' : 'metadata'}
                    >
                        <source src={src} type="video/mp4" />
                    </video>
                )
            })}
            {/* Overlay to ensure readability while videos load */}
            <div className="absolute inset-0 z-10 bg-navy-900/40" />
        </div>
    )
}
