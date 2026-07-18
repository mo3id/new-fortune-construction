import { Link } from 'react-router-dom'

const FOOTER_LINKS = {
    Company: [
        { label: 'About Us', href: '/about' },
        { label: 'Services', href: '/services' },
        { label: 'Our Projects', href: '/projects' },
        { label: 'HSE Policy', href: '/hse' },
        { label: 'Careers', href: '/careers' },
    ],
    Services: [
        { label: 'Roads & Infrastructure', href: '/services' },
        { label: 'Commercial Buildings', href: '/services' },
        { label: 'Bridges & Structures', href: '/services' },
        { label: 'Project Management', href: '/services' },
        { label: 'Contact Us', href: '/contact' },
    ],
}

export function FooterLinks() {
    return (
        <>
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
                <div key={title} className="md:col-span-1">
                    <p className="text-[10px] font-black tracking-[0.2em] uppercase text-teal-500 mb-8">{title}</p>
                    <ul className="space-y-4">
                        {links.map((link) => (
                            <li key={link.label}>
                                <Link
                                    to={link.href}
                                    className="text-slate-400 hover:text-white text-sm font-medium transition-all duration-300 hover:translate-x-1 inline-block"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </>
    )
}
