import { placeholder } from './shared';

import { Field } from '@/components/form/types';

const schema: Field[] = [
  {
    name: 'textarea',
    type: 'textarea',
    placeholder,
  },
  {
    name: 'textarea__disabled',
    type: 'textarea',
    placeholder,
    disabled: true,
  },
];

export default schema;
