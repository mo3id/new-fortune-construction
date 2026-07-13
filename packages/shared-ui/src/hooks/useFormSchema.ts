import { useForm, UseFormProps, UseFormReturn, FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

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
