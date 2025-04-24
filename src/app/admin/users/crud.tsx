'use client';


import { User } from '@/generated/prisma';
import { create, find, remove, update } from '@/actions/crud';
import { Crud } from '@/components/crud';
import { Cell, Row, RowRender } from '@/components/table';
import { FormSchema } from '@/types/form';
import { TableSchema } from '@/types/table';
import { RolesOptionList } from '@/types/user';
import useDataset from '@/hooks/use-dataset';
import { useEffect } from 'react';


const tableSchema: TableSchema = [
  { key: 'ref', label: 'Ref', width: '10px' },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'roles', label: 'Roles', sortable: true, width: '100px' },
];

const formCreateSchema: FormSchema = [
  { name: 'name', type: 'input', label: 'Name', required: true },
  { name: 'email', type: 'input', label: 'Email' },
];

const formUpdateSchema: FormSchema = [
  { name: 'name', type: 'input', label: 'Name', required: true },
  { name: 'email', type: 'input', label: 'Email' },
  { name: 'phone', type: 'phone', label: 'Phone' },
  {
    name: 'roles',
    type: 'select-multi',
    label: 'Roles',
    options: RolesOptionList,
    required: true,
    defaultValue: ['USER'],
    disabled: true,
  },
];

export default function () {

  const dataset = useDataset<User>({
    fetchFn: (options) => find('user', { ...options, searchKeys: ['ref', 'name'] }),
    createFn: (data) => create('user', data),
    updateFn: (id, updateData) => update('user', id, updateData),
    removeFn: (id) => remove('user', id),
  });

  const rowRender: RowRender<User> = (row, index) => (
    <Row key={index} onClick={() => dataset.selectItem(row)}>
      <Cell type='ref' value={row.ref} />
      <Cell>{row.name}</Cell>
      <Cell>{row.roles.join(', ')}</Cell>
    </Row>
  );

  useEffect(() => {
    dataset.refresh()
  }, []);

  return (<>
    <Crud
      dataset={dataset}
      tableSchema={tableSchema}
      formCreateSchema={formCreateSchema}
      formUpdateSchema={formUpdateSchema}
      rowRender={rowRender}
    />
  </>
  );
};