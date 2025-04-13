import { TableState } from './table';

import { TablePagination } from '@/components/table/pagination';
import { SearchInput } from '@/components/table/search';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Pager } from '@/components/pager';


interface FiltersProps<T extends Record<string, any>> {
  table: TableState<T>;
  actionButtons?: React.ReactNode[];
}

const DefaultTableFilters = <T extends Record<string, any>>({
  table,
  actionButtons,
}: FiltersProps<T>) => {
  return (
    <div className="section flex justify-between items-center gap-2">
      <div className="flex justify-between gap-2">
        <SearchInput
          defaultValue={table.search}
          isPending={table.isPending}
          onSearch={table.handleSearch}
        />
        <DateRangePicker
          placeholder={false}
          onChange={table.handleDateRangeChange}
          value={
            table.dateFrom && table.dateTo
              ? {
                from: new Date(table.dateFrom),
                to: new Date(table.dateTo),
              }
              : undefined
          }
        />
      </div>
      <div className="flex justify-between items-center gap-2">
        {actionButtons && (
          <div className="flex gap-2">
            {actionButtons.map((button, index) => (
              <div key={index}>{button}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DefaultTableFilters;
