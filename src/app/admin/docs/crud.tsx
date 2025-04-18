'use client';

import { Doc } from '@/generated/prisma';

import { Cell, Row } from '@/components/table';
import { RowRender } from '@/components/table/table';
import { create, find, update } from '@/actions/crud';
import { deleteDoc } from '@/actions/docs';
import CrudView from '@/components/crud/view';
import { FormSchema } from '@/types/form';
import { TableSchema } from '@/types/table';

export const tableSchema: TableSchema = [
  { key: 'ref', label: 'Ref', width: '10px' },
  { key: 'title', label: 'Name', sortable: true },
];

export const formCreateSchema: FormSchema = [
  { name: 'title', type: 'input', label: 'Title', required: true },
];

export const formUpdateSchema: FormSchema = [
  // { name: 'id', type: 'id', label: 'ID', disabled: true },
  // { name: 'created_at', type: 'date-picker', label: m.created_at() },
  ...formCreateSchema,
];

export const Crud = function () {
  const rowRender: RowRender<Doc> = (row, index, table) => (
    <Row key={index} onClick={() => table.setCurrentRow({ data: row, index })}>
      <Cell type='ref' value={row.ref} />
      <Cell>{row.title}</Cell>
    </Row>
  );

  return (
    <CrudView<Doc>
      model="doc"
      tableSchema={tableSchema}
      formCreateSchema={formCreateSchema}
      formUpdateSchema={formUpdateSchema}
      rowRender={rowRender}
      createAction={(data) => {
        return create('doc', data);
      }}
      updateAction={(id, updateData) => {
        return update('doc', id, updateData);
      }}
      fetchAction={(options) => {
        return find('doc', options);
      }}
      removeAction={(id) => {
        return deleteDoc(id);
      }}
    />
  );
};
