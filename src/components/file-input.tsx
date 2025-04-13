'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle, X, FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileInputProps {
  files: File[];
  onFileChange: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxSizeMB?: number;
  multiple?: boolean;
  maxFiles?: number;
}

export function FileInput({
  files,
  onFileChange,
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    'application/pdf': ['.pdf'],
    'text/*': ['.txt', '.md'],
  },
  maxSizeMB = 5,
  multiple = false,
  maxFiles = 10,
}: FileInputProps) {
  const [sizeError, setSizeError] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState<number[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Filter files that are too large
      const validFiles = acceptedFiles.filter((file) => {
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
          setSizeError(true);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        setSizeError(false);
        if (multiple) {
          // Combine with existing files, respecting maxFiles limit
          const newFiles = [...files, ...validFiles].slice(0, maxFiles);
          onFileChange(newFiles);
          // Mark newly added files for animation
          setRecentlyAdded(
            Array.from(
              { length: validFiles.length },
              (_, i) => files.length + i
            )
          );
        } else {
          // Just use the first file in single mode
          onFileChange([validFiles[0]]);
          setRecentlyAdded([0]);
        }
      }
    },
    [files, onFileChange, maxSizeMB, multiple, maxFiles]
  );

  // Clear "recently added" status after animation completes
  useEffect(() => {
    if (recentlyAdded.length) {
      const timer = setTimeout(() => {
        setRecentlyAdded([]);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [recentlyAdded]);

  const removeFile = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the dropzone
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onFileChange(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: multiple ? maxFiles : 1,
    multiple,
  });

  return (
    <div className="flex flex-col gap-2">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                    ${sizeError ? 'border-red-500 bg-red-50' : ''}`}
      >
        <input {...getInputProps()} />
        {sizeError ? (
          <AlertCircle className="mx-auto size-8 text-red-500" />
        ) : isDragActive ? (
          <Upload className="mx-auto size-8 text-blue-500" />
        ) : (
          <Upload className="mx-auto size-8 text-muted-foreground" />
        )}
        <div className="mt-2 text-sm text-muted-foreground">
          {sizeError ? (
            <span className="text-red-500">
              File size exceeds {maxSizeMB}MB limit
            </span>
          ) : isDragActive ? (
            <span className="text-blue-500 font-medium">
              Drop the file(s) here...
            </span>
          ) : (
            `Drag & drop file${multiple ? 's' : ''} here, or click to select (max ${maxSizeMB}MB${multiple ? ` × ${maxFiles}` : ''})`
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-2">
          {/* <h4 className="text-sm font-medium mb-2">Selected Files ({files.length})</h4> */}
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className={`flex items-center justify-between bg-muted rounded p-2 text-sm
                                    ${recentlyAdded.includes(index) ? 'bg-blue-50 border border-blue-200' : ''}`}
              >
                <div className="flex items-center gap-2 truncate">
                  <div>
                    <FileIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="truncate text-xs font-medium">
                    {file.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-muted flex-shrink-0"
                  onClick={(e) => removeFile(index, e)}
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
