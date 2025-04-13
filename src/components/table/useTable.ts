'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { DateRange } from 'react-day-picker';
import { useQueryState } from 'nuqs';

import { TableSchema } from '@/components/table/table';
import { addClassname, removeClassname } from '@/lib/dom';

interface UseTableProps<T> {
  fetchAction: any;
  schema: TableSchema[];
  hotkeys?: boolean;
  onSelectRow?: (row: { data: T, index: number }) => void;
}

export default function useTable<T extends Record<string, any>>({
  fetchAction,
  schema,
  hotkeys = true,
  onSelectRow,
}: UseTableProps<T>) {
  type RowType = T;
  interface CurrentRow {
    index: number;
    data: T | null;
  }

  const [rows, setRows] = useState<RowType[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [newRow, setNewRow_] = useState<Partial<T> | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useQueryState('page', { defaultValue: '1' });
  const [search, setSearch] = useQueryState('search', { defaultValue: '' });
  const [sort, setSort] = useQueryState('sort', { defaultValue: 'id' });
  const [order, setOrder] = useQueryState('order', { defaultValue: 'desc' });
  const [dateFrom, setDateFrom] = useQueryState('dateFrom');
  const [dateTo, setDateTo] = useQueryState('dateTo');

  const setNewRow = (data?: Partial<T> | null) => {
    setNewRow_(data || {});
  };

  const clearNewRow = () => {
    setNewRow_(null);
  };

  const nullRow = { index: -1, data: null };
  const [currentRow, setCurrentRow_] = useState<CurrentRow>(nullRow);

  const setCurrentRow = (row: CurrentRow) => {
    setCurrentRow_(row);
    focusRow(row.index);
  };

  // return provided index or current row.index
  const getIndex = (index?: number) => {
    return typeof index == 'number' ? index : currentRow.index;
  };

  const isValidIndex = (index: number) => {
    return typeof index === 'number' && index > -1 && index <= rows.length;
  };

  const clearCurrentRow = (keepFocus: boolean = true) => {
    const idx = getIndex();
    if (!isValidIndex(idx)) return;
    setCurrentRow(nullRow);
    // keep focus on current row
    keepFocus && focusRow(idx);
  };

  const updateRow = (newData: RowType, index?: number) => {
    const idx = getIndex(index);
    if (!isValidIndex(idx)) return;
    setRows((prevRows) =>
      prevRows.map((row, i) => (i === idx ? newData : row))
    );
  };

  const selectRow = (index: number) => {
    const idx = getIndex(index);
    if (!isValidIndex(idx)) return;
    setCurrentRow({ index, data: rows[idx] });
  };

  const prependRow = (newData: RowType) => {
    setRows((prevRows) => [newData, ...prevRows]);
  };

  const removeRow = (index?: number) => {
    const idx = getIndex(index);
    if (!isValidIndex(idx)) return;
    setRows((prevRows) => prevRows.filter((_, i) => i !== idx));
    clearCurrentRow(false);
  };

  const focusRow = (index: number) => {
    if (!isValidIndex(index)) return;

    requestAnimationFrame(() => {
      const { rows } = getTableElements();
      rows.forEach((row) => removeClassname(row, 'is-focused'));
      if (!rows[index]) return;
      rows[index] && addClassname(rows[index], 'is-focused');
      rows[index].focus();
    });
  };

  const focusSearch = () => {
    requestAnimationFrame(() => {
      const { searchInput, rows } = getTableElements();
      rows.forEach((row) => removeClassname(row, 'is-focused'));
      searchInput?.focus();
    });
  };

  // return table dom elements
  const getTableElements = () => {
    if (!tableRef) return { rows: [] };
    const searchInput = tableRef.current?.querySelector(
      'input[id="table-search"]'
    ) as HTMLInputElement;
    const tbody = tableRef.current?.querySelector('tbody');
    const rows = (tbody?.querySelectorAll('tr[tabindex="0"]') ||
      []) as HTMLElement[];

    return { searchInput, rows };
  };

  const fetchRows = async () => {
    try {
      const result = await fetchAction({
        page: parseInt(page),
        search,
        sortField: sort,
        sortOrder: order,
        dateFrom: dateFrom ? new Date(dateFrom) : undefined,
        dateTo: dateTo ? new Date(dateTo) : undefined,
      });
      setRows(result.rows);
      setTotalPages(result.totalPages);
      setTotalRows(result.totalRows);
      setError(null);
    } catch (err) {
      console.error('Error fetching rows:', err);
      setError('Failed to fetch rows. Please try again.');
    }
  };

  const handleSearch = (value: string) => {
    startTransition(() => {
      setPage('1');
      setSearch(value);
    });
  };

  const handleSort = (field: keyof T) => {
    startTransition(() => {
      const newOrder = field === sort && order === 'asc' ? 'desc' : 'asc';
      //@ts-ignore
      setSort(field);
      setOrder(newOrder);
    });
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    startTransition(() => {
      if (!range) {
        setDateFrom(null);
        setDateTo(null);
        return;
      }
      setDateFrom(range.from?.toISOString() || null);
      setDateTo(range.to?.toISOString() || null);
    });
  };

  useEffect(() => {
    // we want a minimum of 1 second delay before getting results
    const load = async () => {
      startTransition(async () => {
        await Promise.all([
          fetchRows(),
          new Promise((resolve) => setTimeout(resolve, 600)),
        ]);
      });
    };
    load();
  }, [page, search, dateFrom, dateTo, sort, order]);

  return {
    ref: tableRef,
    schema,
    getTableElements,
    rows,
    totalPages,
    totalRows,
    isPending,
    error,
    page,
    search,
    sort,
    order,
    dateFrom,
    dateTo,
    setPage,
    fetchRows,
    handleSearch,
    handleSort,
    handleDateRangeChange,
    currentRow,
    setCurrentRow,
    clearCurrentRow,
    selectRow,
    updateRow,
    prependRow,
    removeRow,
    focusRow,
    newRow,
    setNewRow,
    clearNewRow,
    focusSearch,
    hotkeys,
    onSelectRow,
  };
}
