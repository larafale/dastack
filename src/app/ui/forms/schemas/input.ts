import { placeholder } from './shared';

import { Field } from '@/components/form/types';

const schema: Field[] = [
  {
    name: 'string',
    type: 'input',
    placeholder,
  },
  {
    name: 'string__disabled',
    type: 'input',
    placeholder,
    disabled: true,
  },
];

export default schema;
