import { ChevronFirst, ChevronLast } from 'lucide-react';
import { Button } from './ui/button';

interface PagerProps {
  currentPage: number | string;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  className?: string;
}

export function Pager({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 3,
}: PagerProps) {
  // Convert currentPage to number if it's a string
  const currentPageNum = typeof currentPage === 'string' ? parseInt(currentPage, 10) : currentPage;

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Generate pagination links
  const renderPageButtons = () => {
    const items = [];

    // Only show navigation buttons when we have more pages than we can display at once
    const showNavigationButtons = totalPages > maxVisiblePages;

    // First page button (only when not on first page and there are more pages than maxVisiblePages)
    if (showNavigationButtons && currentPageNum >= maxVisiblePages) {
      items.push(
        <PageButton onClick={() => handlePageChange(1)}><ChevronFirst /></PageButton>
      );
    }

    // Calculate which page numbers to show
    let pagesToShow = [];

    if (totalPages <= maxVisiblePages) {
      // If there are fewer pages than maxVisiblePages, show all pages
      pagesToShow = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // We have more pages than we can display
      if (currentPageNum <= Math.ceil(maxVisiblePages / 2)) {
        // Near the start - show first maxVisiblePages pages
        pagesToShow = Array.from({ length: maxVisiblePages }, (_, i) => i + 1);
      } else if (currentPageNum >= totalPages - Math.floor(maxVisiblePages / 2)) {
        // Near the end - show last maxVisiblePages pages
        pagesToShow = Array.from({ length: maxVisiblePages }, (_, i) => totalPages - maxVisiblePages + i + 1);
      } else {
        // In the middle - calculate pages around current
        const offset = Math.floor(maxVisiblePages / 2);
        pagesToShow = Array.from(
          { length: maxVisiblePages },
          (_, i) => currentPageNum - offset + i
        );
      }
    }

    // Add page number buttons
    for (let i = 1; i <= totalPages; i++) {
      if (pagesToShow.includes(i)) {
        items.push(
          <PageButton
            key={i}
            isActive={i === currentPageNum}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PageButton>
        );
      }
    }

    // Last page button (only when not on last page and there are more pages than maxVisiblePages)
    if (showNavigationButtons && currentPageNum < totalPages) {
      items.push(
        <PageButton onClick={() => handlePageChange(totalPages)}><ChevronLast /></PageButton>
      );
    }

    return items;
  };

  return (
    <ul className="flex flex-row items-center gap-2">
      {renderPageButtons()}
    </ul>
  );
}


const PageButton = ({
  disabled,
  isActive,
  ...props
}: React.ComponentProps<typeof Button> & { isActive?: boolean }) => (
  <>
    <Button
      variant={isActive ? 'default' : 'ghost'}
      disabled={disabled}
      size="icon"
      className={"rounded-full select-none"}
      {...props}
    />
  </>
);
