'use client';
import React, { useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { ColorField } from './fields/color';
import { DateField } from './fields/date';
import { DatePickerField } from './fields/date-picker';
import { DateRangeField } from './fields/date-range';
import { SelectField } from './fields/select';
import { SelectMultiField } from './fields/select-multi';
import { TextField } from './fields/text';
import { TextAreaField } from './fields/text-area';
import { SwitchField } from './fields/switch';
import { Field } from './types';

import { parseErrorClient } from '@/lib/errors';
import { cn, isEmpty } from '@/lib/utils';
import { getFormSchema, getInitialData } from './schema';
import { Loader2 } from 'lucide-react';

type DynamicFormProps = {
  schema: Field[];
  onSubmit?: (data: FormData) => Promise<any>;
  initialData?: any;
  className?: string;
  dirtyOnly?: boolean;
  onFormReady?: (form: UseFormReturn) => void;
  debug?: boolean;
};

//@ts-ignore
const cleanData = (data) =>
  Object.entries(data)
    //@ts-ignore
    .filter(([, value]) => value !== undefined)
    .reduce((obj, [key, value]) => {
      //@ts-ignore
      obj[key] = value;
      return obj;
    }, {});
//@ts-ignore
const dirtyValues = (dirtyFields, allValues) => {
  if (dirtyFields === true || Array.isArray(dirtyFields)) return allValues;
  // Here, we have an object
  return cleanData(
    Object.fromEntries(
      //@ts-ignore
      Object.keys(dirtyFields).map((key) => [
        key,
        dirtyFields[key]
          ? dirtyValues(dirtyFields[key], allValues[key])
          : undefined,
      ])
    )
  );
};

const DynamicForm: React.FC<DynamicFormProps> = ({
  schema,
  onSubmit,
  initialData,
  className,
  dirtyOnly = true,
  saveLabel = 'Save',
  onFormReady,
  debug = false,
}) => {
  const form = useForm({
    resolver: zodResolver(getFormSchema(schema)),
    defaultValues: getInitialData(schema, initialData),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });

  const { control, formState, watch } = form;
  const { isDirty, isValid } = formState;
  const [isPending, setPending] = useState(false);

  React.useEffect(() => {
    // const subscription = watch((value, { name, type }) => {
    // console.log('watch', `${name}: ${type}`, value);
    // setValue(name, value);
    const subscription = watch(() => {
      onFormReady?.(form);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // console.log('Form render - initialData:', initialData);
  // console.log('Current form values:', form.getValues());
  // console.log('Form errors:', formState.errors);
  //

  const handleFormSubmit = async (data: any) => {
    // console.log('handleFormSubmit', data);
    const values = dirtyOnly ? dirtyValues(formState.dirtyFields, data) : data;
    if (isEmpty(values) || isPending) return;

    setPending(true);

    try {
      // await waitFor(2000);
      await onSubmit(values);
    } catch (err) {
      //@ts-ignore
      toast.error(parseErrorClient(err)?.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col justify-between space-y-4 min-w-[225px]">
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        // onSubmit={form.handleSubmit(onSubmitWrapper)}
        className={cn('space-y-4', className)}
      // onKeyDown={(e) => {
      //   if (e.key === 'Enter') {
      //     console.log('Enter pressed, current values:', form.getValues());
      //   }
      // }}
      >
        {schema.map((field, i) => (
          <div key={i} className="flex flex-col space-y-2">
            <Label
              className="text-muted-foreground rounded px-2 text-xs font-bold"
              htmlFor={field.name}
            >
              {field.label || field.name}
            </Label>
            {field.type === 'id' && (
              <TextField field={field} control={control} />
            )}
            {['input', 'phone'].includes(field.type) && (
              <TextField field={field} control={control} />
            )}
            {field.type === 'textarea' && (
              // <div>{JSON.stringify(field)}</div>
              <TextAreaField field={field} control={control} />
            )}
            {field.type === 'color' && (
              // <div>{JSON.stringify(field)}</div>
              <ColorField field={field} control={control} />
            )}
            {field.type === 'date' && (
              // <div>{JSON.stringify(field)}</div>
              <DateField field={field} control={control} />
            )}
            {field.type === 'date-picker' && (
              <DatePickerField field={field} control={control} />
            )}
            {field.type === 'date-range' && (
              <DateRangeField field={field} control={control} />
            )}
            {field.type === 'select' && (
              <SelectField field={field} control={control} />
            )}
            {field.type === 'select-multi' && (
              <SelectMultiField field={field} control={control} />
            )}
            {field.type === 'switch' && (
              <SwitchField field={field} control={control} />
            )}

            {field.type === 'separator' && (
              <div className="mx-auto p-4">
                <hr className="border-t border-dashed" />
              </div>
            )}
            {formState.errors[field.name] && (
              <p className="text-destructive ml-1 flex items-center gap-2">
                {/* <CircleX className="size-4" /> */}
                <span className="text-xs">
                  {formState.errors[field.name]?.message as any}
                </span>
              </p>
            )}
          </div>
        ))}
        {!!onSubmit && (
          <div className="flex justify-end space-x-2  pt-4 ">
            {/* <Button variant="secondary" type="submit">
            {m.cancel()}
          </Button> */}
            <Button disabled={!isDirty || !isValid || isPending} type="submit">
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {saveLabel}
            </Button>
          </div>
        )}
      </form>

      {debug && (
        <div className="bg-muted scroll-container relative">
          <div className="absolute right-0">
            <div className="flex items-center justify-between px-2 pt-1">
              <span></span>
              <div className="select-none space-x-1">
                <span>{isPending && '🔄'}</span>
                <span>{isDirty && '✍️'}</span>
                <span>{isValid && '✅'}</span>
                <span className="cursor-pointer" onClick={() => form.reset()}>
                  {true && '⊗'}
                </span>
              </div>
            </div>
          </div>
          <pre className="p-2 text-xs">
            {JSON.stringify(form.getValues(), null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DynamicForm;
