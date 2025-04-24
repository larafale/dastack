'use client';

import * as React from 'react';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Dataset } from '@/hooks/use-dataset';
import { Doc } from '@/generated/prisma';
import ListView from './view-list';
import ItemView from './view-item';
import { processText } from '@/actions/docs';



// Create App Context
export const AppContext = React.createContext<AppMutations & AppProps | undefined>(undefined);

// App Context Hook
export const useApp = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within a AppProvider');
  }
  return context;
};

// Define props interface without app prop
interface AppProps {
  dataset: Dataset<Doc>;
  className?: string;
}

interface AppMutations {
  removeItemMutation: UseMutationResult<string, Error, string>;
  processTextMutation: UseMutationResult<any, Error, string>;
}

export const DocsApp = ({
  dataset,
  className,
}: AppProps) => {

  const removeItemMutation = useMutation({
    mutationFn: async (id: string) => {
      await dataset.removeFn?.(id);
      return id;
    },
  });

  const processTextMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, err } = await processText({ id });
      if (err) throw err;
      return data;
    }
  });

  return (
    <AppContext.Provider value={{ dataset, removeItemMutation, processTextMutation }}>
      <div className={cn('app-docs h-full', className)}>
        {dataset.selectedItem?.id ? <ItemView /> : <ListView />}
      </div>
    </AppContext.Provider>
  );
};
