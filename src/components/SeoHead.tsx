import { useEffect } from 'react'
import { absoluteSeoImage, buildCanonicalUrl } from '@/lib/seo'
import type { SeoProfile } from '@/lib/seo'

const MANAGED_ATTR = 'data-fortune-seo'

function upsertMetaByName(name: string, content: string) {
    upsertMeta(`meta[name="${name}"]`, { name, content })
}

function upsertMetaByProperty(property: string, content: string) {
    upsertMeta(`meta[property="${property}"]`, { property, content })
}

function upsertMeta(selector: string, attrs: Record<string, string>) {
    let element = document.head.querySelector<HTMLMetaElement>(selector)
    if (!element) {
        element = document.createElement('meta')
        document.head.appendChild(element)
    }
    Object.entries(attrs).forEach(([key, value]) => element?.setAttribute(key, value))
    element.setAttribute(MANAGED_ATTR, 'true')
}

function upsertCanonical(href: string) {
    let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!element) {
        element = document.createElement('link')
        element.rel = 'canonical'
        document.head.appendChild(element)
    }
    element.href = href
    element.setAttribute(MANAGED_ATTR, 'true')
}

function removeStructuredData() {
    document.head.querySelectorAll(`script[type="application/ld+json"][${MANAGED_ATTR}]`).forEach((node) => node.remove())
}

function appendStructuredData(items: Array<Record<string, unknown>>) {
    removeStructuredData()
    items.forEach((item) => {
        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.textContent = JSON.stringify(item)
        script.setAttribute(MANAGED_ATTR, 'true')
        document.head.appendChild(script)
    })
}

interface SeoHeadProps {
    profile: SeoProfile
}

export function SeoHead({ profile }: SeoHeadProps) {
    useEffect(() => {
        const canonical = buildCanonicalUrl(profile.canonicalPath)
        const social = profile.social
        const image = absoluteSeoImage(social.imagePath || profile.imagePath)
        const robots = profile.indexable === false ? 'noindex,follow' : 'index,follow'

        document.title = profile.title
        upsertMetaByName('description', profile.description)
        upsertMetaByName('robots', robots)
        upsertCanonical(canonical)

        upsertMetaByProperty('og:title', social.title)
        upsertMetaByProperty('og:description', social.description)
        upsertMetaByProperty('og:url', canonical)
        upsertMetaByProperty('og:image', image)
        upsertMetaByProperty('og:type', social.type)
        upsertMetaByName('twitter:card', 'summary_large_image')
        upsertMetaByName('twitter:title', social.title)
        upsertMetaByName('twitter:description', social.description)
        upsertMetaByName('twitter:image', image)

        appendStructuredData(profile.structuredData || [])
    }, [profile])

    return null
}
