'use client'
import { Controller } from 'react-hook-form'

import { FieldController } from '@/types/form'

// import { DatetimePicker } from '@/components/ui/date-time-picker';

export const DateField = ({ field, control }: FieldController) => (
  <Controller
    name={field.name}
    control={control}
    render={({ field: formField }) => <>{formField.value}</>}
  />
)
