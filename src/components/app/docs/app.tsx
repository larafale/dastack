'use client';

import * as React from 'react';
import DataView from './data-view';
import { cn } from '@/lib/utils';
import { Sidebar } from './sidebar';
import { useDocs } from './use-app';

// Define props interface without app prop
interface AppProps {
  className?: string;
  style?: React.CSSProperties;
  sidebar?: boolean;
}

export const DocsApp = ({ className, style, sidebar = true }: AppProps) => {
  const { doc } = useDocs();

  return (
    <div className={cn('app-docs h-full', className)} style={style}>
      {sidebar && !doc?.id && <Sidebar />}
      <DataView />
    </div>
  );
};

// Add display name for better debugging
DocsApp.displayName = 'DocsApp';
