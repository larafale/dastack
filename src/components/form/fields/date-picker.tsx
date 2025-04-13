'use client';
import { Controller } from 'react-hook-form';

import { FieldController } from '../types';

import { DatePicker } from '@/components/ui/date-picker';

export const DatePickerField = ({ field, control }: FieldController) => (
  <Controller
    name={field.name}
    control={control}
    render={({ field: formField }) => (
      <DatePicker
        size={field.size}
        className="w-full"
        // showOutsideDays={false}
        // showWeekNumber
        granularity={field.granularity || 'day'}
        displayFormat={field.props?.displayFormat || 'PP, p'}
        value={field.defaultValue || formField.value}
        onChange={formField.onChange}
        disabled={field.disabled}
        placeholder={field.placeholder || 'Select a date'}
        i18n={{
          today: 'Today',
          tomorrow: 'Tomorrow',
        }}
      />
    )}
  />
);
