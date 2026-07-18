import Services from '@/components/Services'
import { SeoHead } from '@/components/SeoHead'
import { seoProfiles, servicesStructuredData } from '@/lib/seo'

export default function ServicesPage() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-white pt-20 dark:bg-slate-950 md:pt-24">
            <SeoHead profile={{ ...seoProfiles.services, structuredData: servicesStructuredData() }} />
            <Services />
        </div>
    )
}
