import DatePickerSchema from './date-picker';
import DateRangeSchema from './date-range';
import SelectSchema from './select';
import SelectMultiSchema from './select-multi';
import SizesSMSchema from './size-sm';
import SizesLGSchema from './size-lg';
import InputSchema from './input';
import TextareaSchema from './textarea';
import SwitchSchema from './switch';
import RelationSchema from './relation';

import { OPTIONS } from './shared';


export const Schemas = [
  { key: 'input', schema: InputSchema },
  { key: 'select', schema: SelectSchema },
  { key: 'select multi', schema: SelectMultiSchema },
  { key: 'textarea', schema: TextareaSchema },
  { key: 'switch', schema: SwitchSchema },
  { key: 'date picker', schema: DatePickerSchema },
  { key: 'date range', schema: DateRangeSchema },
  { key: 'sizes SM', schema: SizesSMSchema },
  { key: 'sizes LG', schema: SizesLGSchema },
  { key: 'relation', schema: RelationSchema },
];


export const demoSchema = [
  { name: 'Email', type: 'input', placeholder: 'Enter your email' },
  // { name: "Date of birth", type: "date-picker" },
  { name: "Message", type: "textarea", placeholder: 'Enter your message' },
  { name: "Newsletter", type: "switch" }
];
