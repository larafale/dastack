'use client';

import { useHotkeys } from 'react-hotkeys-hook';

import { TableState } from './table';

const isDialogActive = () => !!document.querySelector('[role="dialog"]');

const keyHandler =
  (handler: (e: KeyboardEvent) => void) => (e: KeyboardEvent) => {
    if (isDialogActive()) return;
    handler(e);
  };

const handleTableNavigation = (
  e: KeyboardEvent,
  direction: 'up' | 'down',
  table: TableState<any>
) => {
  const { searchInput, rows } = table.getTableElements();
  if (!rows?.length) return;

  const currentRow = document.activeElement?.closest('tr');
  const isInSearchInput = document.activeElement === searchInput;

  e.preventDefault();

  if (!currentRow && !isInSearchInput) {
    table.focusRow(0);
    return;
  }

  if (isInSearchInput && direction === 'down') {
    table.focusRow(0);
    return;
  }

  if (currentRow) {
    const currentIndex = Array.from(rows).indexOf(currentRow);
    if (direction === 'up') {
      if (currentIndex === 0) {
        table.focusSearch();
      } else {
        table.focusRow(currentIndex - 1);
      }
    } else {
      if (currentIndex === rows.length - 1) {
        table.focusSearch();
      } else {
        table.focusRow(currentIndex + 1);
      }
    }
  }
};

export const useTableHotkeys = <T extends Record<string, any>>(
  table: TableState<T>
) => {
  useHotkeys(
    'alt+f',
    keyHandler((e) => {
      e.preventDefault();
      table.focusSearch();
    }),
    {
      enableOnFormTags: false,
    }
  );

  useHotkeys(
    'alt+n',
    keyHandler((e) => {
      e.preventDefault();
      if (table.isPending) return;
      table.setNewRow();
    }),
    {
      enableOnFormTags: true,
    }
  );

  useHotkeys(
    'up',
    keyHandler((e) => {
      //@ts-ignore
      handleTableNavigation(e, 'up', table);
    }),
    {
      enableOnFormTags: true,
    }
  );

  useHotkeys(
    'down',
    keyHandler((e) => {
      //@ts-ignore
      handleTableNavigation(e, 'down', table);
    }),
    {
      enableOnFormTags: true,
    }
  );

  useHotkeys(
    'enter',
    keyHandler((e) => {
      //@ts-ignore
      const { rows } = table.getTableElements();
      if (!rows?.length) return;

      const currentRow = document.activeElement?.closest('tr');
      if (!currentRow) return;

      e.preventDefault();
      const currentIndex = Array.from(rows).indexOf(currentRow);
      const newCurrentRow = {
        data: table.rows[currentIndex],
        index: currentIndex,
      }
      table.setCurrentRow(newCurrentRow);
      table.onSelectRow?.(newCurrentRow);
    }),
    {
      enableOnFormTags: false,
    }
  );

  useHotkeys(
    ['tab', 'shift+tab'],
    keyHandler((e) => {
      //@ts-ignore
      const { searchInput, rows } = table.getTableElements();
      if (!rows?.length) return;

      const currentRow = document.activeElement?.closest('tr');
      const isInSearchInput = document.activeElement === searchInput;

      if (!isInSearchInput && !currentRow) {
        e.preventDefault();
        table.focusSearch();
        return;
      }

      if (e.shiftKey) {
        const currentIndex = Array.from(rows).indexOf(currentRow!);
        if (currentIndex === 0) {
          e.preventDefault();
          table.focusSearch();
          return;
        }
      }

      e.preventDefault();
      if (e.shiftKey) {
        if (isInSearchInput) {
          table.focusRow(rows.length - 1);
        } else {
          const currentIndex = Array.from(rows).indexOf(currentRow!);
          table.focusRow(currentIndex - 1);
        }
      } else {
        if (isInSearchInput) {
          table.focusRow(0);
        } else {
          const currentIndex = Array.from(rows).indexOf(currentRow!);
          if (currentIndex === rows.length - 1) {
            table.focusSearch();
          } else {
            table.focusRow(currentIndex + 1);
          }
        }
      }
    }),
    {
      enableOnFormTags: true,
      preventDefault: false,
    }
  );

  useHotkeys(
    'alt+left',
    keyHandler((e) => {
      e.preventDefault();
      if (table.isPending) return;

      const currentPage = parseInt(table.page);
      if (currentPage === 1) {
        // Cycle to last page
        table.setPage(table.totalPages.toString());
      } else {
        table.setPage((currentPage - 1).toString());
      }
    }),
    {
      enableOnFormTags: true,
    }
  );

  useHotkeys(
    'alt+right',
    keyHandler((e) => {
      e.preventDefault();
      if (table.isPending) return;

      const currentPage = parseInt(table.page);
      if (currentPage === table.totalPages) {
        // Cycle to first page
        table.setPage('1');
      } else {
        table.setPage((currentPage + 1).toString());
      }
    }),
    {
      enableOnFormTags: true,
    }
  );
};

//@ts-ignore
export const Hotkeys = ({ table }: { table: TableState }) => {
  return table.hotkeys ? <HotKeysComponent table={table} /> : null;
};

//@ts-ignore
const HotKeysComponent = ({ table }: { table: TableState }) => {
  useTableHotkeys(table);
  return null;
};
