'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import FileBox from '@/components/file-box';
import DocsList from './docs-list';
import { useUploadDocs } from '@/hooks/useDocs';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  // Use React Query mutation for file uploads
  const uploadMutation = useUploadDocs();

  const handleUpload = async (files: File[]) => {
    try {
      // Upload files using the mutation
      await uploadMutation.mutateAsync(files);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  return (
    <div className={cn('flex flex-col md:flex-row w-full h-full', className)}>
      <div className="md:w-[300px] border-r shadow bg-muted">
        <FileBox multiple={true} onUpload={handleUpload} />
      </div>
      <div className="flex-1">
        <DocsList />
      </div>
    </div>
  );
}
