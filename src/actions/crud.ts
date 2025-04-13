'use server';

import { getModel } from '@/lib/prisma';
import { nope, ok, CallShape } from '@/lib/errors';
import { Get, Create, Update, Remove, Find, FindReturn } from '@/types/crud';

export const find = async <T>(
  model: Parameters<Find<T>>[0],
  options: Parameters<Find<T>>[1] = {}
): Promise<FindReturn<T>> => {
  const {
    page = 1,
    search = '',
    searchKeys = ['id', 'ref'] as (keyof T)[],
    sortField = 'id' as keyof T,
    sortOrder = 'asc',
    dateFrom,
    dateTo,
    dateKeys = ['created_at'] as (keyof T)[],
    pageSize = 10,
  } = options;

  const skip = (page - 1) * pageSize;

  const searchFilter = search
    ? {
        OR: searchKeys.map((key) => {
          // Check if the key contains dots, indicating a JSON path
          if (String(key).includes('.')) {
            // Split the path into components
            const pathParts = String(key).split('.');
            // For JSON path queries, construct a path query
            return {
              [pathParts[0]]: {
                path: pathParts.slice(1),
                string_contains: search,
                mode: 'insensitive',
              },
            };
          }
          // Normal direct field search
          return {
            [key]: { contains: search, mode: 'insensitive' },
          };
        }),
      }
    : {};

  const dateFilter =
    dateFrom && dateTo
      ? {
          OR: dateKeys.map((key) => ({
            [key]: {
              gte: dateFrom,
              lte: dateTo,
            },
          })),
        }
      : {};

  const filters: any = {
    AND: [searchFilter, dateFilter],
  };

  const totalRows = await (getModel(model) as any).count({
    where: filters,
  });

  const query = {
    where: filters,
    orderBy: {
      [sortField]: sortOrder,
    },
    skip,
    take: pageSize,
  };
  const rows = await (getModel(model) as any).findMany(query);

  return {
    rows,
    currentPage: page,
    totalPages: Math.ceil(totalRows / pageSize),
    totalRows,
  };
};

export async function get(
  model: Parameters<Get>[0],
  id: Parameters<Get>[1],
  options: Parameters<Get>[2] = {}
): Promise<CallShape> {
  try {
    if (!id) throw new Error('missing id');
    const query = {
      ...(options.select && { select: options.select }),
      where: { id },
      ...(options.include && { include: options.include }),
    };
    const row = await (getModel(model) as any).findUnique(query);
    return row ? ok(row) : nope('record not found');
  } catch (err) {
    return nope(err);
  }
}

export async function create(
  model: Parameters<Create>[0],
  data: Parameters<Create>[1] = {}
): Promise<CallShape> {
  try {
    // if (!id) throw new Error('missing id');
    const row = await (getModel(model) as any).create({
      data,
    });

    return ok(row);
  } catch (err) {
    return nope(err);
  }
}

export async function update(
  model: Parameters<Update>[0],
  id: Parameters<Update>[1],
  data: Parameters<Update>[2] = {}
): Promise<CallShape> {
  try {
    if (!id) throw new Error('missing id');
    const row = await (getModel(model) as any).update({
      where: { id },
      data,
    });

    return ok(row);
  } catch (err) {
    return nope(err);
  }
}

export async function remove(
  model: Parameters<Remove>[0],
  id: Parameters<Remove>[1]
): Promise<CallShape> {
  try {
    if (!id) throw new Error('missing id');
    const row = await (getModel(model) as any).delete({
      where: { id },
    });

    return ok(row);
  } catch (err) {
    return nope(err);
  }
}
