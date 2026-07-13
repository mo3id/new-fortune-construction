import { ContactInfo } from './contact/ContactInfo'
import { ContactForm } from './contact/ContactForm'
import { SectionHeader, Container } from '@fortune/shared-ui'

export default function Contact() {
    return (
        <section id="contact" className="relative section-padding overflow-hidden">
            <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900/50 -z-10" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
            
            <Container>
                <SectionHeader
                    subtitle="Get in Touch"
                    title="Let's Build Something Great Together"
                    description="Whether you have a project in mind or want to learn more about our capabilities, our team is ready to help."
                />

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
                    <ContactInfo />
                    <div className="lg:col-span-3 reveal reveal-delay-2">
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 md:p-14 shadow-2xl shadow-slate-200 dark:shadow-black/40 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-500 to-teal-600" />
                            <div className="mb-10">
                                <h3 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Project Consultation</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-light">Please complete the form below. Our executive team will conduct a review and respond within 24 hours.</p>
                            </div>
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}
