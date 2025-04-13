import DatePickerSchema from './date-picker';
import DateRangeSchema from './date-range';
import SelectSchema from './select';
import SelectMultiSchema from './select-multi';
import SizesSMSchema from './size-sm';
import SizesLGSchema from './size-lg';
import InputSchema from './input';
import TextareaSchema from './textarea';
import SwitchSchema from './switch';

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
];


export const demoSchema = [
  { name: 'Email', type: 'input', required: true },
  { name: "Date of birth", type: "date-picker" },
  { name: "Message", type: "textarea" },
  { name: "Newsletter", type: "switch" }
];
