import { Field } from '@/components/form/types';

const schema: Field[] = [
  { name: 'switch', type: 'switch' },
  {
    name: 'switch__disabled',
    type: 'switch',
    disabled: true,
  },
  {
    name: 'switch__default-value',
    type: 'switch',
    defaultValue: true,
  },
];

export default schema;
