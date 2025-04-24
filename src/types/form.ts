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
  | 'switch'
  | 'phone'
  | 'date'
  | 'date-picker'
  | 'date-range'
  | 'select'
  | 'select-multi'
  | 'select-smart'
  | 'relation'
  | 'json';

  label?: string;
  options?: { label: string; value: string }[];
  disabled?: boolean;
  props?: FieldProps;
  placeholder?: string;
  granularity?: 'day' | 'hour' | 'minute' | 'second';
  defaultValue?: unknown;
  required?: boolean;
  size?: 'sm' | 'lg';
  actions?: (formState: any) => React.ReactNode;
};

export type FieldController = {
  field: Field;
  control: any;
  formState?: any;
};
