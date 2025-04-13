'use client';

import { User } from '@prisma/client';

import { Cell, Row } from '@/components/table';
import { RowRender } from '@/components/table/table';
import { create, remove, update } from '@/actions/crud';
import { getUsers } from '@/actions/users';
import CrudView from '@/components/crud/view';
import { RolesOptionList } from '@/types/user';
import { FormSchema } from '@/types/form';
import { TableSchema } from '@/types/table';

export const tableSchema: TableSchema = [
  { key: 'ref', label: 'Ref', width: '10px' },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'roles', label: 'Roles', sortable: true, width: '100px' },
];

export const formCreateSchema: FormSchema = [
  { name: 'name', type: 'input', label: 'Name', required: true },
  { name: 'email', type: 'input', label: 'Email' },
  {
    name: 'roles',
    type: 'select-multi',
    label: 'Roles',
    options: RolesOptionList,
    required: true,
    defaultValue: ['USER'],
  },
];

export const formUpdateSchema: FormSchema = [
  { name: 'ref', type: 'input', label: 'Ref', disabled: true },
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

export const Crud = function () {
  const rowRender: RowRender<User> = (row, index, table) => (
    <Row key={index} onClick={() => table.setCurrentRow({ data: row, index })}>
      <Cell type='ref' value={row.ref} />
      <Cell>{row.name}</Cell>
      <Cell>{row.roles.join(', ')}</Cell>
    </Row>
  );

  return (
    <CrudView<User>
      model="user"
      tableSchema={tableSchema}
      formCreateSchema={formCreateSchema}
      formUpdateSchema={formUpdateSchema}
      rowRender={rowRender}
      createAction={(data) => {
        return create('user', data);
      }}
      updateAction={(id, updateData) => {
        return update('user', id, updateData);
      }}
      fetchAction={(options) => {
        return getUsers(options);
      }}
      removeAction={(id) => {
        return remove('user', id);
      }}
    />
  );
};
