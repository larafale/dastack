import { InputField } from './text';
import { TextAreaField } from './textarea';
import { SwitchField } from './switch';
import { DateField } from './date';
import { DatePickerField } from './date-picker';
import { DateRangeField } from './date-range';
import { SelectField } from './select';
import { SelectMultiField } from './select-multi';
import { RelationField } from './relation';
import { ColorField } from './color';
import { SeparatorField } from './separator';
import { JsonField } from './json';

export default {
    'input': InputField,
    'phone': InputField,
    'textarea': TextAreaField,
    'switch': SwitchField,
    'date': DateField,
    'date-picker': DatePickerField,
    'date-range': DateRangeField,
    'select': SelectField,
    'select-multi': SelectMultiField,
    'relation': RelationField,
    'color': ColorField,
    'separator': SeparatorField,
    'json': JsonField,
};
