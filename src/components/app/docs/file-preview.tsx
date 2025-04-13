'use client';

import React, { useState, useEffect } from 'react';
import { getFile } from '@/actions/docs';
import { Loader2, Download, Maximize2, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatFileSize, getFileTypeIcon } from './utils';
import { useDocs } from './use-app';
import { cn } from '@/lib/utils';
import Modal from '@/components/modal';
import { Badge } from '@/components/ui/badge';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { formatDistanceToNow } from 'date-fns';
import { ObjectBlock } from './blocks/object';

export const FilePreview = ({ className }: { className?: string }) => {
  const [fileData, setFileData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const { doc } = useDocs();

  useEffect(() => {
    const fetchFile = async () => {
      if (!doc?.fileId) return;

      setLoading(true);
      try {
        const call = await getFile(doc.fileId);
        if (call.err) throw call.err;
        setFileData(call.data);
      } catch (err) {
        console.error('Error fetching file:', err);
        setError('Failed to load file preview');
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [doc?.fileId]);

  const handleDownload = () => {
    if (!fileData) return;

    const blob = new Blob([fileData.data], { type: doc.meta.type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.meta.originalName || `file.${doc.meta.ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleModalClose = () => {
    setExpanded(false);
  };

  const FileDisplay = {
    filename: doc.meta?.originalName || 'Unknown file',
    size: doc.meta?.size ? formatFileSize(doc.meta.size) : 'Unknown size',
    type: doc.meta?.type || 'Unknown',
    uploadDate: doc.created_at
      ? formatDistanceToNow(new Date(doc.created_at), {
        addSuffix: true,
      })
      : 'Unknown date',
    ref: doc.ref || '',
  };

  if (!doc?.fileId) return null;

  if (loading) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="flex items-center justify-center h-64 p-6">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="flex flex-col items-center justify-center h-64 p-6">
          <p className="text-destructive mb-2">{error}</p>
          {getFileTypeIcon(
            doc.meta.ext,
            'h-12 w-12 text-muted-foreground mb-2'
          )}
          <p className="text-muted-foreground">{doc.meta.originalName}</p>
        </CardContent>
      </Card>
    );
  }

  if (!fileData) return null;

  // Improved image detection - check both MIME type and extension
  const isImage =
    doc.meta.type?.startsWith('image/') ||
    ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(
      doc.meta.ext?.toLowerCase()
    );

  const isPdf = doc.meta.type === 'application/pdf' || doc.meta.ext === 'pdf';

  const renderPreview = () => {
    if (!fileData?.data) return null;

    // Convert the buffer to a blob URL for display
    const blob = new Blob([fileData.data], {
      type: doc.meta.type || getTypeFromExt(doc.meta.ext),
    });
    const url = URL.createObjectURL(blob);

    if (isImage) {
      return (
        <div
          className="relative flex justify-center cursor-pointer"
          onClick={toggleExpand}
        >
          <img
            src={url}
            alt={doc.meta.originalName || 'File preview'}
            className="object-contain rounded-md"
            style={{ maxHeight: expanded ? 'calc(100vh - 100px)' : '300px' }}
            onLoad={() => URL.revokeObjectURL(url)}
          />
        </div>
      );
    }

    if (isPdf) {
      return (
        <div className={cn('relative w-full')}>
          <iframe
            src={`${url}#toolbar=0`}
            className={cn('w-full h-full min-h-[300px] hide-scrollbar')}
            title={doc.meta.originalName || 'PDF preview'}
          />
        </div>
      );
    }

    // Fallback for non-previewable files
    return (
      <div className="flex flex-col items-center justify-center py-12">
        {getFileTypeIcon(doc.meta.ext, 'h-16 w-16 text-muted-foreground mb-4')}
        <p className="text-muted-foreground text-center mb-2">
          {doc.meta.originalName}
        </p>
        <p className="text-sm text-muted-foreground">
          This file type cannot be previewed
        </p>
      </div>
    );
  };

  const filePreviewContent = (
    <Card className={cn('w-full overflow-hidden p-2', className)}>
      <div className="flex items-center justify-between border-b pb-2 mb-2">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Badge variant="outline" size="sm">
              {doc.meta?.ext ? doc.meta.ext.toUpperCase() : 'Unknown'}
            </Badge>
          </HoverCardTrigger>
          <HoverCardContent className="w-60">
            <ObjectBlock title="File Details" data={FileDisplay} />
          </HoverCardContent>
        </HoverCard>
        <div>
          <Button variant="ghost" size="icon" onClick={handleDownload}>
            <Download />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleExpand}>
            {expanded ? <X /> : <Maximize2 />}
          </Button>
        </div>
      </div>
      {renderPreview()}
    </Card>
  );

  return (
    <>
      <Modal
        mode="dialog"
        showCloseButton={false}
        open={expanded}
        onClose={handleModalClose}
        className={cn(' p-0 h-full sm:h-auto', {
          'max-w-max': isImage,
          'max-w-screen-lg': isPdf,
        })}
      >
        {filePreviewContent}
      </Modal>

      {!expanded && filePreviewContent}
    </>
  );
};

function getTypeFromExt(ext: string): string {
  const extMap: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    pdf: 'application/pdf',
    txt: 'text/plain',
    md: 'text/markdown',
    json: 'application/json',
    html: 'text/html',
    css: 'text/css',
    js: 'text/javascript',
  };

  return extMap[ext?.toLowerCase()] || 'application/octet-stream';
}
