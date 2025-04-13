import { ChevronsUpDown } from 'lucide-react';

import { TableState } from './table';

import { Button } from '@/components/ui/button';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
interface TableHeadersProps<T extends Record<string, any>> {
  table: TableState<T>;
}

const TableHeaders = <T extends Record<string, any>>({
  table,
}: TableHeadersProps<T>) => {
  return (
    <TableHeader>
      <TableRow className="hover:bg-muted bg-muted border-b-0">
        {table.schema.map((header, index) => {
          const radius = index === 0 ? 'rounded-none' : '';
          const radius2 =
            index === table.schema.length - 1 ? 'rounded-none' : '';
          const radiusClass = `${radius} ${radius2}`;

          const isSortable = header.sortable;

          return (
            <TableHead
              key={header.key}
              className={`py-2 ${radiusClass}`}
              //@ts-ignore
              width={header.width || 'auto'}
            >
              <Button
                variant="ghost"
                onClick={() =>
                  isSortable ? table.handleSort(header.key as keyof T) : null
                }
              >
                {header.label || header.key}{' '}
                {isSortable && <ChevronsUpDown className="size-4" />}
              </Button>
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
};

export default TableHeaders;
