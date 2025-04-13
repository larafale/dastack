'use client';

import { Controller } from 'react-hook-form';

import { FieldController } from '../types';

import { DateRangePicker } from '@/components/ui/date-range-picker';

export const DateRangeField = ({ field, control }: FieldController) => (
  <Controller
    name={field.name}
    control={control}
    render={({ field: formField }) => (
      <>
        <DateRangePicker
          size={field.size}
          className="w-full"
          onChange={formField.onChange}
          value={formField.value}
          disabled={field.disabled}
          placeholder={field.placeholder || 'Select a date range'}
        />
      </>
    )}
  />
);
