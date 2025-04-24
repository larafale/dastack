'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import FileBox from '@/components/file-box';
import { useApp } from './app';
import ItemsList from './items-list';
import { toast } from 'sonner';
interface SidebarProps {
    className?: string;
}

export default function ListView({ className }: SidebarProps) {

    const { dataset } = useApp();

    const handleUpload = async (files: File[]) => {
        try {
            const formData = new FormData();
            files.forEach(file => formData.append('files', file));

            const response = await fetch('/api/docs/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            dataset.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error uploading files');
        }
    };

    return (
        <div className={cn('flex flex-col md:flex-row w-full h-full', className)}>
            <div className="md:w-[300px] border-r shadow bg-muted">
                <FileBox multiple={true} onUpload={handleUpload} />
            </div>
            <div className="flex-1">
                <ItemsList />
            </div>
        </div>
    );
}
