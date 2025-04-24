'use client';

import { Doc } from '@/generated/prisma';
import { find, create, remove, update } from '@/actions/crud';
import { Crud } from '@/components/crud';
import { Cell, Row, RowRender } from '@/components/table';
import { FormSchema } from '@/types/form';
import { TableSchema } from '@/types/table';
import useDataset from '@/hooks/use-dataset';


export const tableSchema: TableSchema = [
  { key: 'ref', label: 'Ref', width: '10px' },
  { key: 'title', label: 'Name', sortable: true },
];

export const formCreateSchema: FormSchema = [
  { name: 'title', type: 'input', label: 'Title', required: true },
  { name: 'meta', type: 'json', label: 'Meta', defaultValue: {}, disabled: true },
];

export const formUpdateSchema: FormSchema = [
  // { name: 'id', type: 'id', label: 'ID', disabled: true },
  // { name: 'created_at', type: 'date-picker', label: m.created_at() },
  ...formCreateSchema,
];

export default function () {

  const dataset = useDataset<Doc>({
    fetchFn: (options) => find('doc', { ...options, searchKeys: ['ref', 'title'] }),
    createFn: (data) => create('doc', data),
    updateFn: (id, updateData) => update('doc', id, updateData),
    removeFn: (id) => remove('doc', id),
  });

  const rowRender: RowRender<Doc> = (row, index) => (
    <Row key={index} onClick={() => dataset.selectItem(row)}>
      <Cell type='ref' value={row.ref} />
      <Cell>{row.title}</Cell>
    </Row>
  );

  return (
    <Crud
      dataset={dataset}
      tableSchema={tableSchema}
      formCreateSchema={formCreateSchema}
      formUpdateSchema={formUpdateSchema}
      rowRender={rowRender}
    />
  );
};
