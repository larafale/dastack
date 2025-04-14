'use client';
import { Controller } from 'react-hook-form';

import { FieldController } from '../types';

import { Input } from '@/components/ui/input';

export const InputField = ({ field, control, ...props }: FieldController) => (
  <Controller
    name={field.name}
    control={control}
    render={({ field: formField }) => (
      <Input
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
