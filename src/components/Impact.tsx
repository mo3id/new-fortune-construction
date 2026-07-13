import { ReactNode, useEffect, useRef, useState } from 'react'
import { ShieldCheck, HardHat, Leaf, Award, Download, Search, Type, Smile, Phone, Mail, MapPin, Clock, Share2, Globe, Settings, Users, Briefcase, Building2, Construction, CheckCircle2, AlertCircle, Info, ExternalLink, ChevronRight, Route, Home, CheckCircle } from 'lucide-react'
import { Container, SectionHeader } from '@fortune/shared-ui'
import { MetricCard } from './impact/MetricCard'
import { ImpactCTA } from './impact/ImpactCTA'
import { usePageContent } from '@/hooks/usePageContent'

const ICON_MAP: Record<string, any> = {
    ShieldCheck, HardHat, Leaf, Award, Download, Search, Type, Smile, Phone, Mail, MapPin, Clock, Share2, Globe, Settings, Users, Briefcase, Building2, Construction, CheckCircle2, AlertCircle, Info, ExternalLink, ChevronRight, Route, Home, CheckCircle
}

function isImageUrl(str?: string) {
    if (!str) return false
    return str.startsWith('http') || str.startsWith('/') || str.startsWith('data:')
}

function renderMetricIcon(icon?: string) {
    if (!icon) return <CheckCircle className="w-8 h-8" />
    if (isImageUrl(icon)) return <img src={icon} alt="" className="w-8 h-8 object-contain" />
    const IconComp = ICON_MAP[icon]
    if (IconComp) return <IconComp className="w-8 h-8" />
    return <CheckCircle className="w-8 h-8" />
}

const COLORS = ['bg-teal-600', 'bg-slate-900', 'bg-teal-500', 'bg-slate-800']

interface ApiMetric { target: number; suffix: string; label: string; description: string; icon: string }
interface ImpactContent { title?: string; subtitle?: string; description?: string; items?: ApiMetric[] }

const FALLBACK_METRICS = [
    { icon: 'Route', target: 1500, suffix: '+', label: 'KM of Roads Paved', description: 'Connecting communities across all regions of Malawi with durable, engineered roads.' },
    { icon: 'Home', target: 2000, suffix: '+', label: 'Families Housed', description: 'Quality residential and social housing projects delivered on time and on budget.' },
    { icon: 'Clock', target: 20, suffix: '+', label: 'Years of Experience', description: 'Two decades of expertise in civil, structural, and commercial construction.' },
    { icon: 'CheckCircle', target: 500, suffix: '+', label: 'Successful Projects', description: 'A proven track record of successful delivery for government and private clients.' },
]

export default function Impact() {
    const sectionRef = useRef<HTMLElement>(null)
    const [isVisible, setIsVisible] = useState(false)
    const { data: homeContent } = usePageContent<{ impactMetrics?: ImpactContent }>('home')

    const content = homeContent?.impactMetrics
    const items = content?.items?.length ? content.items : FALLBACK_METRICS

    const metrics = items.map((m: ApiMetric, i: number) => ({
        icon: renderMetricIcon(m.icon),
        target: m.target,
        suffix: m.suffix,
        label: m.label,
        description: m.description,
        color: COLORS[i % COLORS.length],
    }))

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.3 }
        )
        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

    return (
        <section id="impact" ref={sectionRef} className="relative section-padding overflow-hidden">
            <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900/50 -z-10" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
            
            <Container>
                <SectionHeader
                    subtitle={content?.subtitle || "Our Impact"}
                    title={content?.title || "Two Decades of Building a Stronger Malawi"}
                    description={content?.description || "Our numbers tell a story of commitment, craftsmanship, and community transformation."}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {metrics.map((metric: any, i: number) => (
                        <MetricCard key={metric.label} metric={metric} index={i} isVisible={isVisible} />
                    ))}
                </div>

                <ImpactCTA />
            </Container>
        </section>
    )
}
