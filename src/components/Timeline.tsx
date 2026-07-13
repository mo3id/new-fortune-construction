import { Flag, Award, TrendingUp, Globe, Zap, Star } from 'lucide-react'
import { Container, SectionHeader } from '@fortune/shared-ui'
import { TimelineItem } from './timeline/TimelineItem'
import { TimelineEvent } from '@/types'

const TIMELINE_EVENTS: TimelineEvent[] = [
    {
        year: '2004',
        title: 'Company Founded',
        description: 'Fortune Construction was established in Lilongwe with a vision to transform infrastructure development in Malawi through professional excellence.',
        icon: <Flag className="w-5 h-5" />,
    },
    {
        year: '2008',
        title: 'First Major Government Contract',
        description: 'Awarded the M2 Road Rehabilitation Project — a milestone contract that cemented our reputation as a reliable government partner.',
        icon: <Award className="w-5 h-5" />,
        highlight: true,
    },
    {
        year: '2012',
        title: 'Expansion to Northern Region',
        description: 'Opened regional offices in Mzuzu, enabling delivery of infrastructure projects throughout northern Malawi including rural road networks.',
        icon: <TrendingUp className="w-5 h-5" />,
    },
    {
        year: '2015',
        title: 'International Partnerships',
        description: 'Formed strategic partnerships with international engineering firms, bringing world-class expertise and modern construction techniques to Malawi.',
        icon: <Globe className="w-5 h-5" />,
        highlight: true,
    },
    {
        year: '2019',
        title: '100th Bridge Completed',
        description: 'A historic milestone — the completion of our 100th bridge project, strengthening connectivity for rural communities across the country.',
        icon: <Zap className="w-5 h-5" />,
    },
    {
        year: '2024',
        title: '20 Years of Excellence',
        description: 'Celebrating two decades of landmark construction — 500+ projects, 1,500+ km of roads, and 2,000+ families housed across Malawi.',
        icon: <Star className="w-5 h-5" />,
        highlight: true,
    },
]

export default function Timeline() {
    return (
        <section id="timeline" className="relative section-padding overflow-hidden">
            <div className="absolute inset-0 bg-slate-900 dark:bg-black -z-10" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200/10 dark:via-slate-800 to-transparent" />
            
            <Container className="max-w-5xl">
                <SectionHeader
                    subtitle="Our Story"
                    title="A Legacy of Engineering Mastery"
                    description="From a visionary foundation in 2004 to becoming Malawi's trusted construction leader — this is our corporate journey."
                    dark
                />

                <div className="relative mt-24">
                    {/* Vertical line */}
                    <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-teal-500/30 to-transparent md:-translate-x-1/2" />

                    <div className="space-y-24">
                        {TIMELINE_EVENTS.map((event, i) => (
                            <TimelineItem key={event.year} event={event} index={i} />
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    )
}
