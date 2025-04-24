'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Info, Search } from 'lucide-react';
import { DatasetPager, Pager } from '@/components/pager';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from "@/components/ui/badge"
import { SearchInput } from '@/components/search-input';
import { getFileTypeIcon } from './utils';
import { useApp } from './app';

interface DocMeta {
  ext?: string;
  [key: string]: any;
}

export default function ItemsList() {
  const { dataset } = useApp();
  const { items, isLoading, pager } = dataset
  const t = useTranslations('Apps.docs');


  return (
    <Wrapper>
      <SearchInput
        isPending={isLoading}
        onSearch={dataset.handleSearch}
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

        {!isLoading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center" style={{ height: '264px' }}>
            <div className="rounded-full bg-muted p-3 mb-3">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg">{t('list.noResults')}</h3>
            <p className="text-muted-foreground mt-1 mb-4 max-w-md">
              {t('list.noResultsDescription')}
            </p>
          </div>
        )}

        {!isLoading && items.length > 0 && items.map((item) => (
          <div
            key={item.id}
            className={`p-4 border-b last:border-0 cursor-pointer transition-colors hover:bg-muted`}
            onClick={() => dataset.selectItem(item)}
          >
            <div className="flex justify-between items-center">
              <div className="min-w-0 flex-1">
                <h4 className="font-medium flex items-center gap-2">
                  <span className="flex-shrink-0">{getFileTypeIcon((item.meta as DocMeta)?.ext)}</span>
                  <span className="flex-1">{item.title}</span>
                  <Badge variant="outline" size="sm">{(item.meta as DocMeta)?.ext}</Badge>
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      <DatasetPager dataset={dataset} />

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
