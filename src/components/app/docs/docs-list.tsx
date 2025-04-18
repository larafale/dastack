'use client';

import { Doc } from '@/generated/prisma';
import { useState } from 'react';
import { Pager } from '@/components/pager';
import { getFileTypeIcon } from './utils';
import React from 'react';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';
import { Info, Search } from 'lucide-react';
import { useDocsList } from '@/hooks/useDocs';
import { Badge } from "@/components/ui/badge"
import { SearchInput } from '@/components/table/search';

interface DocMeta {
  ext?: string;
  [key: string]: any;
}

export default function DocsList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const t = useTranslations('Apps.docs');

  // Use React Query hook instead of direct data fetching
  const {
    docs,
    isLoading,
    totalPages,
    totalRows,
    setDoc,
    selectedDoc
  } = useDocsList({
    page: currentPage,
    search: searchQuery,
  });

  // Handle pagination change - React Query will automatically refetch
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Handle document selection
  const handleDocSelect = (doc: Doc) => {
    setDoc(doc);
  };

  return (
    <Wrapper>
      <SearchInput
        defaultValue={searchQuery}
        isPending={isLoading}
        onSearch={(value) => setSearchQuery(value)}
        className="w-full"
      />

      <div className="rounded-md border">
        {isLoading && Array(5)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="p-4 border-b last:border-0">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48" />
                </div>
              </div>
            </div>
          ))}

        {!isLoading && docs.length === 0 && (
          <div>
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg">{t('list.noResults')}</h3>
              <p className="text-muted-foreground mt-1 mb-4 max-w-md">
                {t('list.noResultsDescription')}
              </p>
            </div>
          </div>
        )}

        {!isLoading && docs.length > 0 && docs.map((doc) => (
          <div
            key={doc.id}
            className={`p-4 border-b last:border-0 cursor-pointer transition-colors hover:bg-muted ${selectedDoc?.id === doc.id ? 'bg-muted' : ''
              }`}
            onClick={() => handleDocSelect(doc)}
          >
            <div className="flex justify-between items-center">
              <div className="min-w-0 flex-1">
                <h4 className="font-medium flex items-center gap-2">
                  <span className="flex-shrink-0">{getFileTypeIcon((doc.meta as DocMeta)?.ext)}</span>
                  <span className="flex-1">{doc.title}</span>
                  <Badge variant="outline" size="sm">{doc.meta?.ext}</Badge>
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 items-center justify-between p-2 sm:py-0">
        <span className="text-muted-foreground flex items-center gap-2 text-xs sm:text-base">
          <Info className="w-4 h-4" />
          {t('list.items', { count: totalRows })}
        </span>
        <Pager
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </Wrapper>
  );
}

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full max-w-2xl p-4 space-y-4">
      {children}
    </div>
  );
};
