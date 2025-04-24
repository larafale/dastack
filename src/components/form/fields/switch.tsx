'use client'
import { Controller } from 'react-hook-form'

import { FieldController } from '@/types/form'

import { Switch } from '@/components/ui/switch'

export const SwitchField = ({ field, control }: FieldController) => (
  <Controller
    name={field.name}
    control={control}
    render={({ field: formField }) => (
      <div>
        <Switch
          {...formField}
          {...field.props}
          onCheckedChange={formField.onChange}
          checked={formField.value}
          disabled={field.disabled}
          id={field.name}
        />
      </div>
    )}
  />
)
