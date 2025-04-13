'use client';

import { Hotkeys } from './hotkeys';
import useTable from './useTable';

import DefaultTableFilters from '@/components/table/default-table-filters';
import TableHeaders from '@/components/table/headers';
import {
  Table as TableMain,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { useTranslations } from 'next-intl';
import { Pager } from '@/components/pager';
import { Info } from 'lucide-react';

export interface TableSchema {
  key: string;
  label: string;
  sortable?: boolean;
}

export type TableState<T extends Record<string, any>> = ReturnType<
  typeof useTable<T>
>;

export type RowRender<T extends Record<string, any>> = (
  row: T,
  index: number,
  table: TableState<T>
) => React.ReactNode;

interface TableProps<T extends Record<string, any>> {
  table: TableState<T>;
  rowRender: RowRender<T>;
  tableTop?: React.ReactNode;
  forcePending?: boolean;
  actionButtons?: React.ReactNode[];
  onSelectRow?: (table: TableState<T>) => void;
}

const Table = <T extends Record<string, any>>({
  table,
  rowRender,
  tableTop,
  forcePending = false,
  actionButtons,
}: TableProps<T>) => {
  const isPending = forcePending || table.isPending;

  return (
    <div ref={table.ref}>
      {table.error && (
        <p role="alert" className="text-red-500">
          {table.error}
        </p>
      )}
      {tableTop || (
        <DefaultTableFilters<T> table={table} actionButtons={actionButtons} />
      )}

      <div className="rounded-md">
        <TableMain>
          <TableHeaders<T> table={table} />
          <TableBody>
            {isPending ? (
              <LoadingRows colSpan={table.schema.length} />
            ) : table.rows.length === 0 ? (
              <NoResults colSpan={table.schema.length} />
            ) : (
              table.rows.map((row: T, index: number) =>
                rowRender(row, index, table)
              )
            )}
          </TableBody>
        </TableMain>
      </div>

      <div className='flex justify-between items-center p-4 border-t border-dashed'>
        <span className="text-muted-foreground flex items-center gap-2 text-xs sm:text-base">
          <Info className="w-4 h-4" />
          Total: {table.totalRows}
        </span>
        <Pager
          currentPage={table.page}
          totalPages={table.totalPages}
          onPageChange={table.setPage}
        />
      </div>

      <Hotkeys table={table} />
    </div>
  );
};

const LoadingRows = (props: any) => (
  <TableRow className="hover:bg-transparent">
    <TableCell {...props} className="py- text-center">
      <div className="animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-muted mb-7 h-6 rounded opacity-60"></div>
        ))}
      </div>
    </TableCell>
  </TableRow>
);

const NoResults = (props: any) => {
  const t = useTranslations('Crud.main');
  return (
    <TableRow>
      <TableCell {...props} className="py-20 text-center">
        {t('noResults')}
      </TableCell>
    </TableRow>
  );
};

export default Table;
