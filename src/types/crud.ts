import { CallShape } from '@/lib/errors';
import { Model } from '@/lib/prisma';

interface Options {
  [key: string]: any;
}

export interface SearchOptions<T> extends Options {
  page?: number;
  search?: string;
  searchKeys?: (keyof T)[];
  sortField?: keyof T;
  sortOrder?: 'asc' | 'desc' | undefined;
  dateFrom?: Date;
  dateTo?: Date;
  dateKeys?: (keyof T)[];
  pageSize?: number;
}

export type FindReturn<T> = {
  rows: T[];
  currentPage: number;
  totalPages: number;
  totalRows: number;
};
export type Find<T> = (
  model: Model,
  options: SearchOptions<T>
) => Promise<FindReturn<T>>;

export type Get = (
  model: Model,
  id: string,
  options?: Options
) => Promise<CallShape>;
export type Create = (model: Model, data: any) => Promise<CallShape>;
export type Update = (
  model: Model,
  id: string,
  data: any
) => Promise<CallShape>;
export type Remove = (model: Model, id: string) => Promise<CallShape>;
