'use client'
import { Controller } from 'react-hook-form'

import { FieldController } from '@/types/form'

import { Input } from '@/components/ui/input'

export const InputField = ({ field, control }: FieldController) => (
  <Controller
    name={field.name}
    control={control}
    render={({ field: formField }) => (
      <Input
        {...formField}
        {...field.props}
        //@ts-ignore
        uiSize={field.size}
        disabled={field.disabled}
        id={field.name}
        autoComplete="off"
        placeholder={field.placeholder || ''}
      />
    )}
  />
)
