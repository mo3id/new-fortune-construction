import { z } from 'zod';

const requiredString = (field: string) =>
  z
    .string({ required_error: `${field} is required`, invalid_type_error: `${field} must be a string` })
    .trim()
    .min(1, `${field} is required`);

export const authLoginSchema = z.object({
  username: requiredString('username'),
  password: requiredString('password'),
});

export const applicationSubmitSchema = z.object({
  fullName: requiredString('fullName'),
  email: requiredString('email').email('email must be valid'),
  phone: requiredString('phone'),
  position: requiredString('position'),
  coverLetter: requiredString('coverLetter'),
});

export const applicationStatusSchema = z.object({
  status: z.enum(['new', 'reviewed', 'shortlisted', 'rejected']),
});

export const applicationFilterSchema = z.object({
  status: z.enum(['new', 'reviewed', 'shortlisted', 'rejected']).optional(),
  position: z.string().trim().optional(),
});

export const idParamSchema = z.object({
  id: requiredString('id'),
});

const optionalTrimmedString = z.string().trim().optional();
const optionalRequiredString = (field: string) =>
  z
    .string({ invalid_type_error: `${field} must be a string` })
    .trim()
    .min(1, `${field} is required`)
    .optional();
const optionalOrder = z.union([z.coerce.number(), z.literal('')]).optional();

export const projectCategoryCreateSchema = z.object({
  name: requiredString('name'),
  slug: optionalTrimmedString,
  icon: optionalTrimmedString,
  order: optionalOrder,
  isActive: z.boolean().optional(),
});

export const projectCategoryUpdateSchema = z.object({
  name: optionalRequiredString('name'),
  slug: optionalTrimmedString,
  icon: optionalTrimmedString,
  order: optionalOrder,
  isActive: z.boolean().optional(),
}).refine((value) => Object.keys(value).length > 0, {
  message: 'At least one category field is required',
});
