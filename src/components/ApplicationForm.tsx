import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, UploadCloud, FileText, X, Briefcase, Loader2, AlertCircle } from 'lucide-react'
import { API } from '@/lib/apiClient'
import { 
  useFormSchema, 
  applicationSchema, 
  ApplicationFormData, 
  FormInput, 
  Form, 
  Button 
} from '@fortune/shared-ui'

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const POSITIONS = [
    { value: 'civil-engineer', label: 'Senior Civil Engineer' },
    { value: 'project-manager', label: 'Project Manager' },
    { value: 'safety-officer', label: 'HSE Officer' },
    { value: 'quantity-surveyor', label: 'Quantity Surveyor' },
    { value: 'general-application', label: 'General Application' },
]

export default function ApplicationForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [fileError, setFileError] = useState<string | null>(null)

    const form = useFormSchema({
        schema: applicationSchema,
        defaultValues: { fullName: '', email: '', phone: '', position: '', coverLetter: '' }
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        setFileError(null)

        if (!selectedFile) return

        if (!ACCEPTED_FILE_TYPES.includes(selectedFile.type)) {
            setFileError('Please upload a PDF or Word document')
            setFile(null)
            return
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
            setFileError('File size must be less than 5MB')
            setFile(null)
            return
        }

        setFile(selectedFile)
    }

    const removeFile = () => {
        setFile(null)
        setFileError(null)
    }

    const onSubmit = async (data: ApplicationFormData) => {
        if (!file) {
            setFileError('Please upload your CV/Resume')
            return
        }

        setIsSubmitting(true)
        try {
            const fd = new FormData()
            fd.append('fullName', data.fullName)
            fd.append('email', data.email)
            fd.append('phone', data.phone)
            fd.append('position', data.position)
            fd.append('coverLetter', data.coverLetter)
            fd.append('cvFile', file)

            const res = await fetch(`${API}/applications/submit`, { method: 'POST', body: fd })
            if (!res.ok) throw new Error('Submission failed')
            
            setIsSuccess(true)
            form.reset()
            setFile(null)
            setTimeout(() => setIsSuccess(false), 5000)
        } catch {
            setFileError('Submission failed. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center h-full min-h-[500px] relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-teal-500" />
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                >
                    <CheckCircle2 className="w-20 h-20 text-teal-500 mb-6" />
                </motion.div>
                <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-4">Application Received!</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md font-light leading-relaxed">
                    Thank you for your interest in joining Fortune Construction. Our HR team will review your application and get back to you shortly.
                </p>
                <Button variant="outline" onClick={() => setIsSuccess(false)} className="border-slate-200 dark:border-slate-800">
                    Submit Another Application
                </Button>
            </motion.div>
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-500 to-teal-600" />
                
                <div className="mb-10">
                    <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">Apply Now</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Join our mission to build Malawi's future. Complete the form below to start your journey.</p>
                </div>

                <div className="space-y-6 mb-10">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4">Personal Information</h4>
                        <FormInput name="fullName" label="Full Name *" placeholder="John Doe" disabled={isSubmitting} />
                        
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormInput name="email" label="Email Address *" type="email" placeholder="john@example.com" disabled={isSubmitting} />
                            <FormInput name="phone" label="Phone Number *" type="tel" placeholder="+265 999 123 456" disabled={isSubmitting} />
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4">Professional Details</h4>
                        <FormInput 
                            name="position" 
                            label="Target Position *" 
                            type="select" 
                            options={POSITIONS} 
                            placeholder="Select a position"
                            disabled={isSubmitting} 
                        />

                        <FormInput 
                            name="coverLetter" 
                            label="Cover Letter / Introduction *" 
                            type="textarea" 
                            placeholder="Tell us why you're a great fit for Fortune Construction..." 
                            disabled={isSubmitting} 
                        />
                    </div>
                </div>

                {/* CV Upload */}
                <div className="mb-10 pt-6 border-t border-slate-50 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Resume / CV *</label>
                        <span className="text-[10px] text-slate-400">PDF, DOC, DOCX (Max 5MB)</span>
                    </div>
                    
                    <AnimatePresence mode="wait">
                        {!file ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="relative group"
                            >
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 p-8 text-center transition-all duration-300 group-hover:border-teal-500/50 group-hover:bg-teal-50/30 dark:group-hover:bg-teal-900/10">
                                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-teal-500 group-hover:scale-110 transition-transform duration-300">
                                        <UploadCloud className="w-6 h-6" />
                                    </div>
                                    <p className="font-bold text-slate-900 dark:text-white mb-1">Upload your resume</p>
                                    <p className="text-xs text-slate-500">Click to browse or drag and drop</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-between p-4 border border-teal-100 dark:border-teal-900/30 bg-teal-50/30 dark:bg-teal-900/10 rounded-xl"
                            >
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center text-teal-500 mr-4 shadow-sm">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white text-sm truncate max-w-[200px]">{file.name}</p>
                                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={removeFile}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {fileError && (
                        <motion.span 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-xs mt-3 flex items-center gap-1.5 font-medium"
                        >
                            <AlertCircle className="w-3.5 h-3.5" /> {fileError}
                        </motion.span>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full shadow-xl shadow-teal-500/20"
                    size="lg"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Submitting...
                        </>
                    ) : 'Submit Application'}
                </Button>
            </form>
        </Form>
    )
}
