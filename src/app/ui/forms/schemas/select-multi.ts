import { OPTIONS } from './shared';

import { Field } from '@/components/form/types';

const schema: Field[] = [
  {
    name: 'select',
    type: 'select-multi',
    options: OPTIONS,
  },
  {
    name: 'select__disabled',
    type: 'select-multi',
    options: OPTIONS,
    defaultValue: 'GUEST',

    disabled: true,
  },
  {
    name: 'select__default-value',
    type: 'select-multi',
    options: OPTIONS,
    defaultValue: ['GUEST', 'ADMIN'],
  },
];

export default schema;
