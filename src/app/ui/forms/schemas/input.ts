import { placeholder } from './shared';

import { Field } from '@/components/form/types';

const schema: Field[] = [
  {
    name: 'input',
    type: 'input',
    placeholder,
  },
  {
    name: 'input__disabled',
    type: 'input',
    placeholder,
    disabled: true,
  },
];

export default schema;
