'use client';
import { Controller } from 'react-hook-form';

import * as types from '../types';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  selectVariants,
} from '@/components/ui/select';

export const SelectField = ({ field, control }: types.FieldController) => (
  <Controller
    name={field.name}
    control={control}
    render={({ field: formField }) => (
      <div>
        <Select
          //@ts-ignore
          onValueChange={formField.onChange}
          value={formField.value}
          disabled={field.disabled}
        >
          {/* @ts-ignore */}
          <SelectTrigger size={field.size} variant={field.variant}>
            <SelectValue placeholder={field.placeholder || 'Select'} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {(field.options || []).map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    )}
  />
);
