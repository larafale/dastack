'use client';

import { toast } from 'sonner';

import { RowRender } from '../table/table';

import DynamicForm from '@/components/form/dynamic-form';
import Modal from '@/components/modal';
import { Table, useTable } from '@/components/table';
import { SearchOptions } from '@/types/crud';
import { TableSchema } from '@/types/table';
import { FormSchema } from '@/types/form';
import { Model } from '@/lib/prisma';
import { Button } from '../ui/button';
import { PlusIcon } from 'lucide-react';
import Actions from './actions';
import { useTranslations } from 'next-intl';
interface CrudProps<T extends Record<string, any>> {
  model: Model;
  tableSchema: TableSchema;
  formCreateSchema: FormSchema;
  formUpdateSchema: FormSchema;
  rowRender: RowRender<T>;
  fetchAction: (options: SearchOptions<T>) => any;
  updateAction?: (id: string, data: Partial<T>) => any;
  createAction?: (data: Partial<T>) => any;
  removeAction?: (id: string) => any;
}

const CrudView = <T extends Record<string, any>>({
  tableSchema,
  formCreateSchema,
  formUpdateSchema,
  fetchAction,
  updateAction,
  createAction,
  removeAction,
  rowRender,
}: CrudProps<T>) => {
  const t = useTranslations('Crud');
  const table = useTable<T>({
    fetchAction,
    schema: tableSchema,
  });

  const handleCreate = async (newData: T): Promise<any> => {
    if (!newData) return;

    //@ts-ignore
    const { err, data } = await createAction(newData);

    if (err) return toast.error(err.message);
    table.prependRow(data);
    table.clearNewRow();
    toast.success('Save success');
  };

  const handleEdit = async (updateData: T): Promise<any> => {
    const id = table.currentRow?.data?.id;
    if (!id) return;

    //@ts-ignore
    const { err, data } = await updateAction(id, updateData);

    if (err) return toast.error(err.message);
    table.updateRow(data);
    table.clearCurrentRow();
    toast.success('Save success');
  };

  const handleRemove = async (): Promise<any> => {
    const id = table.currentRow?.data?.id;
    if (!id) return;

    //@ts-ignore
    const { err } = await removeAction(id);

    if (err) return toast.error(err.message);
    table.removeRow();
    toast.success('Save success');
  };

  const actionButtons = [];

  if (createAction)
    actionButtons.push(
      <Button
        variant={'outline'}
        size={'icon'}
        key="create"
        onClick={() => table.setNewRow()}
      >
        <PlusIcon />
      </Button>
    );

  return (
    <>
      <Table<T>
        table={table}
        rowRender={rowRender}
        actionButtons={actionButtons}
      />

      {createAction && (
        <Modal open={!!table.newRow} onClose={() => table.clearNewRow()}>
          <DynamicForm
            schema={formCreateSchema}
            //@ts-ignore
            onSubmit={handleCreate}
            initialData={{}}
          />
        </Modal>
      )}

      <Modal
        mode="sheet"
        open={!!table.currentRow?.data}
        onClose={() => table.clearCurrentRow()}
      >
        <Actions table={table} onRemove={removeAction && handleRemove} />
        <DynamicForm
          schema={formUpdateSchema}
          //@ts-ignore
          onSubmit={handleEdit}
          saveLabel={t('actions.save')}
          initialData={table.currentRow?.data || {}}
        />
      </Modal>
    </>
  );
};

export default CrudView;
