import { OPTIONS, placeholder } from './shared';

import { Field } from '@/components/form/types';

const schema: Field[] = [
  {
    name: 'string',
    type: 'string',
    placeholder,
    size: 'sm',
  },
  {
    name: 'select',
    type: 'select',
    options: OPTIONS,
    size: 'sm',
  },
  { name: 'date-picker', type: 'date-picker', size: 'sm' },
  { name: 'date-range', type: 'date-range', size: 'sm' },
  {
    name: 'select-multi',
    type: 'select-multi',
    options: OPTIONS,
    size: 'sm',
  },
  {
    name: 'textarea',
    type: 'textarea',
    placeholder,
    size: 'sm',
  },
];

export default schema;
