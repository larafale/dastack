'use client';


import {
  Pagination,
  PaginationContent,
  PaginationFirstLink,
  PaginationItem,
  PaginationLastLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface TablePaginationProps {
  page: string;
  totalPages: number;
  totalRows: number;
  isPending: boolean;
  onPageChangeAction: (page: string) => void;
  showEdges?: boolean;
}

export function TablePagination({
  page,
  totalPages,
  totalRows,
  isPending,
  onPageChangeAction,
  showEdges = false,
}: TablePaginationProps) {

  if (totalPages <= 1) return null;

  return (
    <Pagination className="items-center justify-between gap-4">
      <PaginationContent>
        <div
          className="select-none font-mono hidden md:flex flex-col items-end text-muted-foreground"
          style={{ fontSize: '12px' }}
        >
          <small>Total: {totalRows}</small>
          <small>Page: {`${page}/${totalPages}`}</small>
        </div>
        {showEdges && (
          <PaginationItem>
            <PaginationFirstLink
              onClick={() => onPageChangeAction('1')}
              disabled={page === '1' || isPending}
            />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              if (page === '1') {
                onPageChangeAction(totalPages.toString()); // Cycle to last page
              } else {
                onPageChangeAction((parseInt(page) - 1).toString());
              }
            }}
            disabled={isPending || page === '1'}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            onClick={() => {
              if (parseInt(page) === totalPages) {
                onPageChangeAction('1'); // Cycle to first page
              } else {
                onPageChangeAction((parseInt(page) + 1).toString());
              }
            }}
            disabled={isPending || totalPages === 0}
          />
        </PaginationItem>
        {showEdges && (
          <PaginationItem>
            <PaginationLastLink
              onClick={() => onPageChangeAction(totalPages.toString())}
              disabled={
                parseInt(page) === totalPages || isPending || totalPages === 0
              }
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
