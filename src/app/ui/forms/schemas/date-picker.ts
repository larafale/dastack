import { Field } from '@/components/form/types';

const schema: Field[] = [
  { name: 'date_picker', type: 'date-picker' },
  {
    name: 'date_picker__disabled',
    type: 'date-picker',
    disabled: true,
    defaultValue: new Date(),
  },
  {
    name: 'date_picker__format',
    type: 'date-picker',
    props: { displayFormat: 'dd/MM/yyyy' },
    defaultValue: new Date(),
  },
  {
    name: 'date_picker__time',
    type: 'date-picker',
    granularity: 'minute',
    defaultValue: new Date(),
  },
];

export default schema;
