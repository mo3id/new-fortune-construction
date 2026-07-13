import { useForm, FormProvider, useFormContext } from 'react-hook-form'
import type { UseFormProps, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

export { Button } from '@/components/ui/Button'
export { Container } from '@/components/ui/Container'
export { Image } from '@/components/ui/Image'
export { Input } from '@/components/ui/Input'
export { PageHero } from '@/components/ui/PageHero'
export { SectionHeader } from '@/components/ui/SectionHeader'
export { Textarea } from '@/components/ui/Textarea'
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
export { Badge } from '@/components/ui/badge'
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
export { Label } from '@/components/ui/label'

export { cn } from './utils'

export const Form = FormProvider

interface UseFormSchemaProps<T extends z.ZodType<any, any>> extends Omit<UseFormProps<z.infer<T>>, 'resolver'> {
  schema: T
}

export function useFormSchema<T extends z.ZodType<any, any>>({
  schema,
  ...formOptions
}: UseFormSchemaProps<T>): UseFormReturn<z.infer<T>> {
  return useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    ...formOptions,
  })
}

const requiredString = (message: string, min = 1, max?: number) => {
  let schema = z.string({ required_error: message }).min(min, message)
  if (max) schema = schema.max(max, `Must be under ${max} characters`)
  return schema
}

const email = z.string({ required_error: 'Email is required' }).email('Please enter a valid email address')
const phone = z
  .string({ required_error: 'Phone number is required' })
  .min(8, 'Phone number must be at least 8 characters')
  .regex(/^[+\d\s\-()]+$/, 'Please enter a valid phone number (only numbers, spaces, and + - () are allowed)')

export const contactSchema = z.object({
  name: requiredString('Name must be at least 2 characters', 2, 60),
  email,
  phone,
  message: requiredString('Message must be at least 20 characters', 20, 1000),
})

export const applicationSchema = z.object({
  fullName: requiredString('Name must be at least 2 characters', 2),
  email,
  phone,
  position: requiredString('Please select a position'),
  coverLetter: requiredString('Cover letter should be at least 50 characters', 50),
})

export const loginSchema = z.object({
  username: requiredString('Username is required'),
  password: requiredString('Password is required', 6),
})

export type ContactFormData = z.infer<typeof contactSchema>
export type ApplicationFormData = z.infer<typeof applicationSchema>
export type LoginFormData = z.infer<typeof loginSchema>

interface SelectOption {
  label: string
  value: string
}

interface FormInputProps {
  name: string
  label: string
  placeholder?: string
  type?: 'text' | 'email' | 'tel' | 'number' | 'password' | 'textarea' | 'select' | 'file'
  options?: SelectOption[]
  disabled?: boolean
  rows?: number
  accept?: string
  min?: string | number
  max?: string | number
  onChangeFile?: (file: File | null) => void
}

export function FormInput({
  name,
  label,
  placeholder,
  type = 'text',
  options = [],
  disabled = false,
  rows = 4,
  accept,
  min,
  max,
  onChangeFile,
}: FormInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const error = errors[name]
  const inputClassName = 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 transition-all focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 h-14 px-6 rounded-2xl shadow-sm'

  return (
    <div className="space-y-2 w-full">
      <label className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 dark:text-slate-500 ml-1">
        {label}
      </label>
      {type === 'textarea' ? (
        <Textarea
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className="resize-none bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 transition-all focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded-2xl p-4 shadow-sm"
          {...register(name)}
        />
      ) : type === 'select' ? (
        <select
          disabled={disabled}
          className={`${inputClassName} w-full`}
          defaultValue=""
          {...register(name)}
        >
          <option value="" disabled>{placeholder || 'Select an option'}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'file' ? (
        <Input
          type="file"
          disabled={disabled}
          accept={accept}
          className={inputClassName}
          {...register(name, {
            onChange: (event) => onChangeFile?.(event.target.files?.[0] || null),
          })}
        />
      ) : (
        <Input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          className={inputClassName}
          {...register(name)}
        />
      )}
      {error && (
        <div className="text-sm font-medium text-destructive flex items-center gap-1.5 mt-1">
          <AlertCircle className="w-4 h-4" />
          <span>{error.message?.toString()}</span>
        </div>
      )}
    </div>
  )
}
