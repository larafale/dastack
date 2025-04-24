'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslations } from 'next-intl';
import {
  Upload,
  AlertCircle,
  X,
  FileIcon,
  Camera,
  Link as LinkIcon,
  ArrowRight,
} from 'lucide-react';
import { Button, LoadingButton } from '@/components/ui/button';
import CameraCapture from '@/components/camera-capture';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type InputMode = 'drop' | 'camera' | 'url';

interface FileBoxProps {
  accept?: Record<string, string[]>;
  maxSizeMB?: number;
  multiple?: boolean;
  maxFiles?: number;
  onUpload?: (files: File[]) => Promise<void>;
  showUploadButton?: boolean;
}

export function FileBox({
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    'application/pdf': ['.pdf'],
    'text/*': ['.txt', '.md', '.docx', '.doc'],
  },
  multiple = false,
  maxFiles = 10,
  maxSizeMB = 5,
  onUpload,
  showUploadButton = true,
}: FileBoxProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [sizeError, setSizeError] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState<number[]>([]);
  const [activeMode, setActiveMode] = useState<InputMode>('drop');
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const t = useTranslations('FileBox')

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Reset size error state when new files are dropped
      setSizeError(false);

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
        if (multiple) {
          // Combine with existing files, respecting maxFiles limit
          const newFiles = [...files, ...validFiles].slice(0, maxFiles);
          handleFileChange(newFiles);
          // Mark newly added files for animation
          setRecentlyAdded(
            Array.from(
              { length: validFiles.length },
              (_, i) => files.length + i
            )
          );
        } else {
          // Just use the first file in single mode
          handleFileChange([validFiles[0]]);
          setRecentlyAdded([0]);
        }
      }
    },
    [files, maxSizeMB, multiple, maxFiles]
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
    handleFileChange(newFiles);
  };

  const handleCameraCapture = (imageFiles: File[]) => {
    if (!imageFiles.length) return;

    if (multiple) {
      // Add all captured images, respecting the maxFiles limit
      const newFiles = [...files, ...imageFiles].slice(0, maxFiles);
      handleFileChange(newFiles);

      // Mark newly added files for animation
      setRecentlyAdded(
        Array.from(
          { length: Math.min(imageFiles.length, maxFiles - files.length) },
          (_, i) => files.length + i
        )
      );
    } else {
      // In single mode, just use the first image
      handleFileChange([imageFiles[0]]);
      setRecentlyAdded([0]);
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError('');

    if (!urlInput.trim()) {
      setUrlError(t('urlError'));
      return;
    }

    try {
      // Validate URL format
      setIsUploading(true);
      new URL(urlInput);

      try {
        // Try multiple approaches to fetch the file
        let response;
        let blob;

        // First attempt: Try direct fetch (works for CORS-enabled resources)
        try {
          response = await fetch(urlInput);
          if (response.ok) {
            blob = await response.blob();
          }
        } catch (directError) {
          console.log('Direct fetch failed, trying alternatives:', directError);
        }

        // Second attempt: Try a different CORS proxy if direct fetch failed
        if (!blob) {
          try {
            const corsProxies = [
              `https://corsproxy.io/?${encodeURIComponent(urlInput)}`,
              `https://api.allorigins.win/raw?url=${encodeURIComponent(urlInput)}`,
              `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(urlInput)}`,
            ];

            for (const proxyUrl of corsProxies) {
              try {
                console.log(`Trying proxy: ${proxyUrl}`);
                response = await fetch(proxyUrl);
                if (response.ok) {
                  blob = await response.blob();
                  break;
                }
              } catch (e) {
                console.log(`Proxy ${proxyUrl} failed:`, e);
              }
            }
          } catch (proxyError) {
            console.log('All proxies failed:', proxyError);
          }
        }

        // Third attempt: Try with no-cors mode as last resort, with redirect limit
        if (!blob) {
          try {
            console.log('Attempting no-cors mode fetch with redirect handling');

            // Create a controller to abort fetch if it takes too long (potential redirect loop)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            try {
              response = await fetch(urlInput, {
                mode: 'no-cors',
                signal: controller.signal,
                redirect: 'follow',
                headers: {
                  Referer: 'https://example.com', // Sometimes helps with anti-hotlinking
                },
              });

              clearTimeout(timeoutId);
              blob = await response.blob();
            } catch (fetchError) {
              clearTimeout(timeoutId);
              if (fetchError.name === 'AbortError') {
                console.log('Fetch aborted due to potential redirect loop');
                throw new Error('Fetch aborted - too many redirects');
              }
              throw fetchError;
            }
          } catch (noCorsError) {
            console.log('No-cors fetch failed:', noCorsError);
            throw new Error('Cannot access this resource');
          }
        }

        if (!blob) {
          throw new Error('Failed to retrieve file content');
        }

        // Check file size
        if (blob.size > maxSizeMB * 1024 * 1024) {
          setUrlError(`File size exceeds ${maxSizeMB}MB limit`);
          return;
        }

        // Extract filename from URL or use a default
        const urlParts = urlInput.split('/');
        const fileName =
          urlParts[urlParts.length - 1].split('?')[0] || 'downloaded-file';

        // Create a File object
        const file = new File([blob], fileName, {
          type: blob.type || 'application/octet-stream',
        });

        if (multiple) {
          const newFiles = [...files, file].slice(0, maxFiles);
          handleFileChange(newFiles);
          setRecentlyAdded([files.length]);
        } else {
          handleFileChange([file]);
          setRecentlyAdded([0]);
        }

        // Clear input
        setUrlInput('');
      } catch (error) {
        console.error('Error fetching file from URL:', error);
        setUrlError(
          'Unable to access this image. The website may have anti-hotlinking protection. ' +
          'Try downloading the file to your device first, then upload it directly.'
        );
      }
    } catch (error) {
      setUrlError('Please enter a valid URL');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = async () => {
    if (!onUpload || files.length === 0) return;

    setIsUploading(true);
    try {
      await onUpload(files);
      // Clear files after successful upload
      setFiles([]);
    } catch (err) {
      console.error('Upload failed:', err, err?.message);
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: multiple ? maxFiles : 1,
    multiple,
  });

  return (
    <div className="flex flex-col gap-2 p-4">
      <Tabs
        value={activeMode}
        onValueChange={(v) => setActiveMode(v as InputMode)}
        className="w-full"
      >
        <TabsList className="flex justify-around mb-2">
          <TabsTrigger value="drop" className="flex-1">
            <Upload className='size-4' />
          </TabsTrigger>
          <TabsTrigger value="camera" className="flex-1">
            <Camera className='size-4' />
          </TabsTrigger>
          <TabsTrigger value="url" className="flex-1">
            <LinkIcon className='size-4' />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="drop">
          <div
            {...getRootProps()}
            className={cn(
              'rounded-lg p-6 text-center cursor-pointer transition-colors',
              'border-2 border-dashed hover:border-muted-foreground',
              {
                'border-muted-foreground': isDragActive,
                'border-red-500': sizeError,
              }
            )}
          >
            <input {...getInputProps()} />
            {sizeError ? (
              <AlertCircle className="mx-auto size-8 text-red-500" />
            ) : isDragActive ? (
              <Upload className="mx-auto size-8 text-brand" />
            ) : (<Upload className="mx-auto size-8 text-muted-foreground" />
            )}
            <div className="mt-2 text-sm text-muted-foreground select-none">
              {sizeError ? (
                <span className="text-red-500">
                  {t('sizeError', { maxSizeMB })}
                </span>
              ) : isDragActive ? (
                <span className="font-medium">
                  {t('drop')}
                </span>
              ) : (
                `${t('drop')} (${multiple ? `${maxFiles} x` : ''} ${maxSizeMB}MB)`
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="camera">
          <CameraCapture multiple={multiple} onImage={handleCameraCapture} t={t}>
            <div className={cn(
              'rounded-lg p-6 text-center cursor-pointer transition-colors',
              'border-2 border-dashed hover:border-muted-foreground',
            )}
            >
              <Camera className="mx-auto size-8 text-muted-foreground" />
              <div className="mt-2 text-sm text-muted-foreground">
                {t('camera.open')}
              </div>
            </div>
          </CameraCapture>
        </TabsContent>

        <TabsContent value="url">
          <form
            onSubmit={handleUrlSubmit}
            className={cn(
              'space-y-2 px-2 rounded-lg p-2',
              'border-2 border-dashed'
            )}
          >
            <div className="flex flex-col gap-2 ">
              <Input
                type="text"
                placeholder="https://"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className={urlError ? 'border-red-500' : ''}
              />
              <LoadingButton
                icon={<ArrowRight />}
                disabled={!urlInput.trim()}
                type="submit"
                isLoading={isUploading}
              >
              </LoadingButton>
            </div>
            {urlError && <p className="text-red-500 text-xs">{urlError}</p>}
            <p className="text-xs text-muted-foreground pt-4">
              {t('urlNote')}
            </p>
          </form>
        </TabsContent>
      </Tabs>

      {files.length > 0 && (
        <div className="mt-2">
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className={cn(
                  'flex items-center justify-between bg-card rounded p-2 text-sm',
                  {
                    'border': recentlyAdded.includes(index),
                  }
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <div>
                    <FileIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <span className="truncate text-xs font-medium" title={file.name}>
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  className="ml-2 size-6 flex-shrink-0"
                  onClick={(e) => removeFile(index, e)}
                  aria-label="Remove file"
                >
                  <X className="size-2" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showUploadButton && files.length > 0 && onUpload && (
        <LoadingButton
          onClick={handleUpload}
          isLoading={isUploading}
          disabled={isUploading}
          icon={<ArrowRight />}
          className="mt-4"
        >
          {isUploading ? t('uploading') : t('upload')}
        </LoadingButton>
      )}
    </div>
  );
}

export default FileBox;
