import { OPTIONS, placeholder } from './shared';

import { Field } from '@/components/form/types';

const schema: Field[] = [
  {
    name: 'string',
    type: 'string',
    placeholder,
    size: 'lg',
  },
  {
    name: 'select',
    type: 'select',
    options: OPTIONS,
    size: 'lg',
  },
  { name: 'date-picker', type: 'date-picker', size: 'lg' },
  { name: 'date-range', type: 'date-range', size: 'lg' },
  {
    name: 'select-multi',
    type: 'select-multi',
    options: OPTIONS,
    size: 'lg',
  },
  {
    name: 'textarea',
    type: 'textarea',
    placeholder,
    size: 'lg',
  },
];

export default schema;
