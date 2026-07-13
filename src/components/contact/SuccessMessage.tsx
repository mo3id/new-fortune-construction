import { CheckCircle2 } from 'lucide-react'
import { Button } from '@fortune/shared-ui'
import { useUIStore } from '@/store/useUIStore'

export function SuccessMessage() {
    const { resetForm } = useUIStore()

    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-teal-50 dark:bg-teal-900/20 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-sm">
                <CheckCircle2 className="w-12 h-12 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight text-gradient">Message Dispatched!</h3>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-sm leading-relaxed mb-10 font-light">
                Our executive team has received your enquiry. We will conduct a review and provide a comprehensive response within 24 business hours.
            </p>
            <Button
                onClick={resetForm}
                variant="outline"
                size="lg"
                className="border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-widest text-[10px] h-14 px-10"
            >
                Submit Additional Inquiry
            </Button>
        </div>
    )
}
