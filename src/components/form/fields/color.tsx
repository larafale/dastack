'use client';
import { Controller } from 'react-hook-form';

import { FieldController } from '../types';

// import * as m from '@/paraglide/messages';

export const ColorField = ({ field, control }: FieldController) => (
  <Controller
    name={field.name}
    control={control}
    render={({ field: formField }) => (
      <>
        <div>{formField.value}</div>
      </>
    )}
  />
);
