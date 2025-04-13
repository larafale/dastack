export type FormSchema = Field[];

export type FieldProps = {
  [key: string]: any;
};

export type Field = {
  name: string;
  type:
    | 'id'
    | 'separator'
    | 'color'
    | 'input'
    | 'textarea'
    | 'phone'
    | 'date'
    | 'date-picker'
    | 'date-range'
    | 'select'
    | 'select-multi'
    | 'select-smart'
    | 'switch';
  label?: string;
  options?: { label: string; value: string }[];
  disabled?: boolean;
  props?: FieldProps;
  placeholder?: string;
  granularity?: 'day' | 'hour' | 'minute' | 'second';
  defaultValue?: unknown;
  required?: boolean;
  size?: 'sm' | 'lg';
};

export type FieldController = {
  field: Field;
  control: any;
};
