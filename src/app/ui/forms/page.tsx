'use client';

import { Schemas } from './schemas';
import DynamicForm from '@/components/form/dynamic-form';
import { PageHeader } from '@/components/page-components';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import Menu from './menu';
import { useTranslations } from 'next-intl';
type FormInstances = Record<string, UseFormReturn>;

const Play = () => {
  const initialData = () => ({});
  const [forms, setForms] = React.useState<FormInstances>({});
  const [selectedForms, setSelectedForms] = React.useState<string[]>([]);
  const [debug, setDebug] = React.useState(false);

  const t = useTranslations('Ui');

  // Callback to receive form instance from DynamicForm
  const handleFormInstance = (key: string, form: UseFormReturn) => {
    setForms((prev) => ({ ...prev, [key]: form }));
  };

  // const handleSave = (updatedFormValues: any) => {
  //   console.log('Saving Form:', updatedFormValues);
  // };

  // Filter schemas based on selection, show all if none selected
  const filteredSchemas = React.useMemo(() => {
    if (selectedForms.length === 0) return Schemas;
    return Schemas.filter(schema => selectedForms.includes(schema.key));
  }, [selectedForms]);

  return (
    <>
      <PageHeader
        title={t('forms.title')}
        desc={t('forms.description')}
        backHref={t('main.backHref')}
        backLabel={t('main.backLabel')} />

      <div className="flex flex-1">
        <Menu
          items={Schemas}
          onFilterChange={setSelectedForms}
          onDebugChange={setDebug}
          debug={debug}
        />

        <div className="w-[20px] col-start-1 row-span-full row-start-1  border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-black)]/5 md:block dark:[--pattern-fg:var(--color-white)]/10"></div>

        <div className="section flex-1 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredSchemas.map(({ key, schema }) => (
            <div key={key} className="flex flex-col">
              <div className="font-bold p-3 bg-muted capitalize">{key}</div>
              {/* <pre className="text-xs p-3 max-h-[300px] overflow-scroll">
                {JSON.stringify(schema, null, 2)}
              </pre> */}
              <DynamicForm
                key={key}
                schema={schema}
                initialData={initialData()}
                className="rounded p-2"
                onFormReady={(form) => handleFormInstance(key, form)}
                debug={debug}
              />
            </div>
          ))}
        </div>

      </div>

    </>
  );
};

export default Play;
