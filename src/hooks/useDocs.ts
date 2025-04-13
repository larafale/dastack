'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDocs, deleteDoc, processText } from '@/actions/docs';
import { useDocs as useDocsContext } from '@/components/app/docs/use-app';

// Query keys for better cache management
export const docsKeys = {
  all: ['docs'] as const,
  lists: () => [...docsKeys.all, 'list'] as const,
  list: (filters: any) => [...docsKeys.lists(), filters] as const,
  details: () => [...docsKeys.all, 'detail'] as const,
  detail: (id: string) => [...docsKeys.details(), id] as const,
};

interface UseDocsListOptions {
  page?: number;
  pageSize?: number;
  sortOrder?: string;
  search?: string;
}

export function useDocsList(options: UseDocsListOptions = {}) {
  const { page = 1, pageSize = 5, sortOrder = 'desc', search = '' } = options;
  
  // Get the context from the existing provider
  const docsContext = useDocsContext();
  
  // Create a unique query key based on the filter parameters
  const queryKey = docsKeys.list({ page, pageSize, sortOrder, search });
  
  // Use React Query for data fetching with caching
  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const result = await getDocs({
          pageSize,
          sortOrder,
          page,
          search,
        });
        return result;
      } catch (error) {
        console.error('Error fetching documents:', error);
        return { rows: [], totalPages: 0, currentPage: 1, totalRows: 0 };
      }
    },
  });
  
  return {
    docs: data?.rows || [],
    totalPages: data?.totalPages || 0,
    currentPage: data?.currentPage || 1,
    totalRows: data?.totalRows || 0,
    isLoading,
    error,
    refetch,
    setDoc: docsContext.setDoc,
    selectedDoc: docsContext.doc,
    close: docsContext.close,
    remove: docsContext.remove,
  };
}

export function useDeleteDoc() {
  const queryClient = useQueryClient();
  const docsContext = useDocsContext();
  
  return useMutation({
    mutationFn: async (docId: string) => {
      await deleteDoc(docId);
      return docId;
    },
    onSuccess: (docId) => {
      // Close the document view
      docsContext.close();
      
      // Update the document state
      docsContext.remove();
      
      // Invalidate all doc lists to trigger a refresh
      queryClient.invalidateQueries({ queryKey: docsKeys.lists() });
      
      return docId;
    },
  });
}

export function useUploadDocs() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (files: File[]) => {
      console.log('Starting file upload with', files.length, 'files');
      
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/docs/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      console.log('Upload successful, uploaded docs:', result);
      return result;
    },
    onSuccess: () => {
      // Invalidate all doc lists to trigger a refresh
      queryClient.invalidateQueries({ queryKey: docsKeys.lists() });
    },
  });
}

export function useProcessText() {
  const queryClient = useQueryClient();
  const docsContext = useDocsContext();
  
  return useMutation({
    mutationFn: async (docId: string) => {
      const result = await processText({ id: docId });
      if (result.err) throw result.err;
      return result.data;
    },
    onSuccess: (data) => {
      // Update the document in the context
      docsContext.setDoc(data);
      
      // Invalidate the specific document detail query if it exists
      if (data && data.id) {
        queryClient.invalidateQueries({ queryKey: docsKeys.detail(data.id) });
      }
    },
  });
} 