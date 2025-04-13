'use client';
import { Controller } from 'react-hook-form';

import { FieldController } from '../types';

import { Textarea } from '@/components/ui/textarea';

export const TextAreaField = ({
  field,
  control,
  ...props
}: FieldController) => (
  <Controller
    name={field.name}
    control={control}
    render={({ field: formField }) => (
      <Textarea
        {...formField}
        {...props}
        //@ts-ignore
        uiSize={field.size}
        disabled={field.disabled}
        id={field.name}
        autoComplete="off"
        placeholder={field.placeholder || ''}
      />
    )}
  />
);
