import { Send, Loader2 } from 'lucide-react'
import { useUIStore } from '@/store/useUIStore'
import { SuccessMessage } from './SuccessMessage'
import { API } from '@/lib/apiClient'
import { useFormSchema, contactSchema, ContactFormData, FormInput, Form, Button } from '@fortune/shared-ui'
import { motion } from 'framer-motion'

export function ContactForm() {
    const { isFormSubmitted, isFormSubmitting, setFormSubmitting, setFormSubmitted } = useUIStore()

    const form = useFormSchema({
        schema: contactSchema,
        defaultValues: { name: '', email: '', phone: '', message: '' }
    })

    const onSubmit = async (data: ContactFormData) => {
        setFormSubmitting(true)
        try {
            const res = await fetch(`${API}/messages/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (!res.ok) throw new Error('Failed to send')
            setFormSubmitted(true)
            form.reset()
        } catch {
            console.error('Contact form submission failed')
        } finally {
            setFormSubmitting(false)
        }
    }

    if (isFormSubmitted) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <SuccessMessage />
            </motion.div>
        )
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="relative"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput name="name" label="Full Name *" placeholder="Executive Name" disabled={isFormSubmitting} />
                        <FormInput name="email" label="Corporate Email *" type="email" placeholder="name@company.com" disabled={isFormSubmitting} />
                    </div>

                    <FormInput name="phone" label="Contact Number *" type="tel" placeholder="+265 999 123 456" disabled={isFormSubmitting} />
                    
                    <FormInput 
                        name="message" 
                        label="Project Brief / Requirements *" 
                        type="textarea" 
                        rows={6}
                        placeholder="Please provide a high-level overview of your project requirements, location, and strategic goals..." 
                        disabled={isFormSubmitting}
                    />

                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isFormSubmitting}
                            size="lg"
                            className="w-full shadow-2xl shadow-teal-500/20"
                        >
                            {isFormSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                    Processing Inquiry...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-3" />
                                    Dispatch Consultation Request
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </motion.div>
    )
}
