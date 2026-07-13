import { z } from 'zod'
import { contactSchema } from '@/lib/validation'

export type ContactFormData = z.infer<typeof contactSchema>
