import { endOfMonth, startOfMonth } from 'date-fns';

import { Field } from '@/components/form/types';

const currentDate = new Date();
const firstDayOfMonth = startOfMonth(currentDate);
const lastDayOfMonth = endOfMonth(currentDate);

const schema: Field[] = [
  {
    name: 'date_range',
    type: 'date-range',
  },
  {
    name: 'date_range__default-value',
    type: 'date-range',
    defaultValue: {
      from: firstDayOfMonth,
      to: lastDayOfMonth,
    },
  },
];

export default schema;
