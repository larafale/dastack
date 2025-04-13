'use server';

import { User } from '@prisma/client';
import { find, get, update } from './crud';

export async function getUsers(props: any) {
  return find<User>('user', {
    ...props,
    searchKeys: ['ref', 'name'],
  });
}

export async function getUser(id: string, options?: any) {
  return get('user', id, options);
}

export async function editUser(id: string, updateData: Partial<User>) {
  return update('user', id, updateData);
}
