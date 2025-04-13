'use client';

import { toast } from 'sonner';

import { RowRender } from '../table/table';

import DynamicForm from '@/components/form/dynamic-form';
import Modal from '@/components/modal';
import { Table, useTable } from '@/components/table';
import * as m from '@/paraglide/messages';
import { SearchOptions } from '@/types/crud';
import { TableSchema } from '@/types/table';
import { FormSchema } from '@/types/form';
import { Model } from '@/lib/prisma';
import { Button } from '../ui/button';
import { useState } from 'react';
import { PlusIcon } from 'lucide-react';
// import Actions from './actions';

interface TableProps<T extends Record<string, any>> {
  model: Model;
  tableSchema: TableSchema;
  formCreateSchema: FormSchema;
  formUpdateSchema: FormSchema;
  rowRender: RowRender<T>;
  fetchAction: (options: SearchOptions<T>) => any;
  updateAction?: (id: string, data: Partial<T>) => any;
  createAction?: (data: Partial<T>) => any;
  removeAction?: (id: string) => any;
  EditComponent?: React.ComponentType<any>;
  onClose?: () => void;
}

const TableView = <T extends Record<string, any>>({
  model,
  tableSchema,
  formCreateSchema,
  formUpdateSchema,
  fetchAction,
  updateAction,
  createAction,
  removeAction,
  rowRender,
  EditComponent,
  onClose,
}: TableProps<T>) => {
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
    toast.success(m.save_success());
  };

  const handleEdit = async (updateData: T): Promise<any> => {
    const id = table.currentRow?.data?.id;
    if (!id) return;

    //@ts-ignore
    const { err, data } = await updateAction(id, updateData);

    if (err) return toast.error(err.message);
    table.updateRow(data);
    table.clearCurrentRow();
    toast.success(m.save_success());
  };

  const handleRemove = async (): Promise<any> => {
    const id = table.currentRow?.data?.id;
    if (!id) return;

    //@ts-ignore
    const { err, data } = await removeAction(id);

    if (err) return toast.error(err.message);
    table.removeRow();
    toast.success(m.save_success());
  };

  const actionButtons = [];

  if (createAction)
    actionButtons.push(
      <Button
        variant={'outline'}
        key="create"
        onClick={() => table.setNewRow()}
      >
        <PlusIcon className="size-4" />
      </Button>
    );

  return (
    <>
      <Table<T>
        table={table}
        rowRender={rowRender}
        actionButtons={actionButtons}
      />

      {/* {createAction && (
        <Modal
          open={!!table.newRow}
          showCloseButton={false}
          onClose={() => table.clearNewRow()}
          className="max-w-screen-lg p-0"
        >
          {EditComponent && <EditComponent row={table.newRow} table={table} />}
        </Modal>
      )} */}

      <Modal
        mode="dialog"
        showCloseButton={false}
        open={!!table.currentRow?.data}
        onClose={() => { table.clearCurrentRow(); onClose?.() }}
        className="max-w-screen-lg p-0"
      >
        {/* <Actions table={table} onRemove={removeAction && handleRemove} /> */}
        {EditComponent && <EditComponent row={table.currentRow?.data} table={table} />}
      </Modal>
    </>
  );
};

export default TableView;
