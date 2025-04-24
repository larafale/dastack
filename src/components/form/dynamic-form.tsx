'use client';
import React, { useState, useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '../ui/button';
import { Label } from '../ui/label';

import { Field } from '@/types/form';
import Fields from './fields';

// Define the available field types that exist in the Fields component
type AvailableFieldType = keyof typeof Fields;

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
  saveLabel?: string;
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
    defaultValues: getInitialData(schema, initialData || {}),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });


  const { control, formState, watch, getValues } = form;
  const { isDirty, isValid, dirtyFields } = formState;
  const [isPending, setPending] = useState(false);



  const handleFormSubmit = async (data: any) => {
    const values = dirtyOnly ? dirtyValues(formState.dirtyFields, data) : data;
    console.log('handleFormSubmit', data, values);
    if (isEmpty(values) || isPending || !onSubmit) return;

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
        className={cn('space-y-4', className)}
      >
        {schema.map((field, i) => (
          <div key={i} className="flex flex-col space-y-2">
            {field.type !== 'separator' && (<div className='flex items-center justify-between'>
              <Label
                className="text-muted-foreground rounded px-2 text-xs font-bold"
                htmlFor={field.name}
              >
                {field.label || field.name}
              </Label>
              {field.actions && field.actions(getValues())}
            </div>)}

            {(field.type as AvailableFieldType) in Fields &&
              React.createElement(Fields[field.type as AvailableFieldType], { field, control, formState })
            }

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
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              disabled={(!isDirty && dirtyOnly) || !isValid || isPending}
              tabIndex={0}
              type="submit">
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
                <span>{(isDirty) && '✍️'}</span>
                <span>{isValid && '✅'}</span>
                <span className="cursor-pointer" onClick={() => form.reset()}>
                  {true && '⊗'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-2 text-xs">
            <pre>{JSON.stringify(getValues(), null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicForm;
