'use client';
import { Controller } from 'react-hook-form';

import { FieldController } from '../types';

import { SelectMulti } from '@/components/ui/select-multi';

export const SelectMultiField = ({ field, control }: FieldController) => (
  <Controller
    name={field.name}
    control={control}
    render={({ field: formField }) => (
      <>
        <SelectMulti
          size={field.size}
          placeholder={`${field.disabled ? '' : field.placeholder || 'Select'}`}
          //@ts-ignore
          options={field.options}
          defaultValue={field.options?.filter((option) =>
            formField.value.includes(option.value)
          )}
          onChange={(selectedOptions: any) => {
            // console.log('selected options', selectedOptions);
            const values = selectedOptions?.map((option: any) => option.value);
            formField.onChange(values);
          }}
          isDisabled={field.disabled}
        />
      </>
    )}
  />
);
