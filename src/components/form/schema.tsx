import * as z from 'zod';
import { FormSchema } from './types';
import { sanitizePhone } from '@/lib/phone';

export const getFormSchema = (schema: FormSchema) => {
  const required_error = 'Champs requis';
  const phone_error = '06 et 07 uniquement';

  return z.object(
    schema.reduce(
      //@ts-ignore
      (acc, field) => {
        if (field.type === 'id') {
          const rule = z
            .string({ required_error })
            .min(1, { message: required_error });
          acc[field.name] = rule;
        }
        if (['input', 'textarea', 'relation'].includes(field.type)) {
          const rule = field.required
            ? z.string({ required_error }).min(1, { message: required_error })
            : z.string().optional();
          acc[field.name] = rule;
        }
        if (field.type === 'textarea') {
          const rule = field.required
            ? z.string({ required_error }).min(1, { message: required_error })
            : z.string().optional();
          acc[field.name] = rule;
        }
        if (field.type === 'phone') {
          const rule = field.required
            ? z.string({ required_error }).refine(sanitizePhone, {
              message: phone_error,
            })
            : z.string().optional();
          acc[field.name] = rule;
        }
        if (field.type === 'select' && field.options) {
          // Skip validation for disabled fields
          if (field.disabled) {
            acc[field.name] = z.any();
            return acc;
          }

          acc[field.name] = field.required
            ? z.enum(
              field.options.map((option) => option.value) as [string, ...string[]],
              {
                required_error,
                invalid_type_error: required_error,
              }
            )
            : z
              .enum(
                field.options.map((option) => option.value) as [string, ...string[]],
                {
                  invalid_type_error: required_error,
                }
              )
              .optional();
        }
        if (field.type === 'select-multi' && field.options) {
          acc[field.name] = field.required
            ? z.array(z.string()).min(1, required_error)
            : z.array(z.string()).optional();
        }
        if (field.type === 'date-picker') {
          acc[field.name] = field.required
            ? z.date({ required_error })
            : z.date().optional().nullable();
        }
        if (field.type === 'date-range') {
          const dateRangeSchema = z
            .object({
              from: field.required
                ? z.date({ required_error })
                : z.date().optional().nullable(),
              to: field.required
                ? z.date({ required_error })
                : z.date().optional().nullable(),
            })
            .optional()
            .nullable();

          acc[field.name] = field.required
            ? dateRangeSchema.refine((data) => data?.from && data?.to, {
              message: required_error,
            })
            : dateRangeSchema;
        }
        if (field.type === 'switch') {
          acc[field.name] = field.required
            ? z.boolean({ required_error })
            : z.boolean().optional();
        }
        if (field.type === 'json') {
          acc[field.name] = z.any();
        }
        return acc;
      },
      {} as Record<string, z.ZodTypeAny>
    )
  );
};

export const getInitialData = (
  schema: FormSchema,
  data: Record<string, any>
) => {
  schema.map((field) => {
    // non data fields
    if (field.type === 'separator') return;

    // cast to string to not have uncontrolled component warning
    if (['select', 'input', 'textarea'].includes(field.type))
      data[field.name] = data[field.name] || field.defaultValue || '';
    // field that are arrays
    else if (field.type === 'select-multi')
      data[field.name] = data[field.name] || field.defaultValue || [];
    // other fields
    else data[field.name] = data[field.name] || field.defaultValue;

  });
  return data;
};
