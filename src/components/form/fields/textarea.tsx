'use client'
import { Controller } from 'react-hook-form'

import { FieldController } from '@/types/form'

import { Textarea } from '@/components/ui/textarea'

export const TextAreaField = ({ field, control }: FieldController) => (
  <Controller
    name={field.name}
    control={control}
    render={({ field: formField }) => {
      // console.log('textarea field render', field);
      return (
        <Textarea
          {...formField}
          {...field.props}
          //@ts-ignore
          uiSize={field.size}
          disabled={field.disabled}
          id={field.name}
          autoComplete="off"
          placeholder={field.placeholder || ''}
        />
      )
    }}
  />
)
