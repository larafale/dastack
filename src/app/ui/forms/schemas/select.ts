import { OPTIONS } from './shared';

import { Field } from '@/components/form/types';

const schema: Field[] = [
  {
    name: 'select',
    type: 'select',
    options: OPTIONS,
  },
  {
    name: 'select__disabled',
    type: 'select',
    options: OPTIONS,
    disabled: true,
  },
  {
    name: 'select__default-value',
    type: 'select',
    options: OPTIONS,
    defaultValue: 'GUEST',
  },
];

export default schema;
