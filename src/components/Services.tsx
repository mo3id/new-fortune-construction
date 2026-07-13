import { ShieldCheck, HardHat, Leaf, Award, Download, Search, Type, Smile, Phone, Mail, MapPin, Clock, Share2, Globe, Settings, Users, Briefcase, Building2, Construction, CheckCircle2, AlertCircle, Info, ExternalLink, ChevronRight, Route, Home, CheckCircle, Layers } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Container, SectionHeader } from '@fortune/shared-ui'
import { ServiceCard } from './services/ServiceCard'
import { WhyUs } from './services/WhyUs'
import { Service } from '@/types'
import { apiFetch } from '@/lib/apiClient'
import { ReactNode } from 'react'

const ACCENT_COLORS = ['border-teal-600', 'border-slate-900', 'border-teal-500']

const ICON_MAP: Record<string, any> = {
    ShieldCheck, HardHat, Leaf, Award, Download, Search, Type, Smile, Phone, Mail, MapPin, Clock, Share2, Globe, Settings, Users, Briefcase, Building2, Construction, CheckCircle2, AlertCircle, Info, ExternalLink, ChevronRight, Route, Home, CheckCircle, Layers
}

function isImageUrl(str?: string) {
    if (!str) return false
    return str.startsWith('http') || str.startsWith('/') || str.startsWith('data:')
}

function renderServiceIcon(icon?: string) {
    if (!icon) return <Construction className="w-10 h-10" />
    if (isImageUrl(icon)) return <img src={icon} alt="" className="w-10 h-10 object-contain" />
    const IconComp = ICON_MAP[icon]
    if (IconComp) return <IconComp className="w-10 h-10" />
    return <Construction className="w-10 h-10" />
}

interface ApiService { _id: string; title: string; tagline: string; description: string; features: string[]; bgImage: string; order: number; icon?: string }

const FALLBACK: Service[] = [
    { icon: <Route className="w-10 h-10" />, title: 'Roads & Infrastructure', tagline: 'Connecting Malawi, Mile by Mile', description: "From rural feeder roads to major national highways, we engineer and construct road infrastructure that withstands Malawi's diverse terrain.", features: ['Highway Construction', 'Drainage Systems', 'Bridges & Culverts', 'Road Rehabilitation'], accentColor: 'border-teal-500', bgImage: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&q=80' },
    { icon: <Building2 className="w-10 h-10" />, title: 'Building & Commercial Construction', tagline: 'Spaces That Work and Inspire', description: 'We deliver commercial offices, government facilities, schools, hospitals, and residential estates.', features: ['Commercial Offices', 'Government Facilities', 'Residential Estates', 'Educational Institutions'], accentColor: 'border-navy-800', bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80' },
    { icon: <Layers className="w-10 h-10" />, title: 'Bridges & Structural Works', tagline: 'Engineering That Endures Generations', description: 'Complex structural projects demand exceptional engineering. Our teams plan, design, and construct bridges and structural works.', features: ['RC Bridge Construction', 'Steel Structures', 'Retaining Walls', 'Structural Rehabilitation'], accentColor: 'border-teal-400', bgImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
]

export default function Services() {
    const { data: apiServices } = useQuery<ApiService[]>({
        queryKey: ['services'],
        queryFn: () => apiFetch<ApiService[]>('/services'),
        staleTime: 60_000,
    })

    const services: Service[] = apiServices?.length
        ? apiServices.map((s: ApiService, i: number) => ({
            icon: renderServiceIcon(s.icon),
            title: s.title,
            tagline: s.tagline,
            description: s.description,
            features: s.features,
            accentColor: ACCENT_COLORS[i % ACCENT_COLORS.length],
            bgImage: s.bgImage,
        }))
        : FALLBACK

    return (
        <section id="services" className="relative section-padding bg-white dark:bg-slate-950 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
            
            <Container>
                <SectionHeader
                    subtitle="What We Build"
                    title="Engineering Solutions for National Progress"
                    description="Fortune Construction delivers elite, full-scope construction services across Malawi's most critical infrastructure sectors."
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-24">
                    {services.map((service, i) => (
                        <ServiceCard key={service.title} service={service} index={i} />
                    ))}
                </div>

                <WhyUs />
            </Container>
        </section>
    )
}
