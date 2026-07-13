import { z } from 'zod'

export const contactSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(60, 'Name must be under 60 characters'),
    email: z
        .string()
        .email('Please enter a valid email address'),
    phone: z
        .string()
        .min(8, 'Phone number must be at least 8 digits')
        .regex(/^[+\d\s\-()]+$/, 'Please enter a valid phone number'),
    message: z
        .string()
        .min(20, 'Message must be at least 20 characters')
        .max(1000, 'Message must be under 1000 characters'),
})
