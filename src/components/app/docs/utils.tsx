import { FileText, FileType, Image as FileImage, FileSpreadsheet } from 'lucide-react';
import React from 'react';

/**
 * File type categories
 */
export const FILE_TYPES = {
  IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'],
  DOCUMENT: ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'],
  SPREADSHEET: ['xls', 'xlsx', 'csv', 'ods'],
  PRESENTATION: ['ppt', 'pptx', 'odp'],
  ARCHIVE: ['zip', 'rar', '7z', 'tar', 'gz'],
  CODE: [
    'js',
    'ts',
    'jsx',
    'tsx',
    'html',
    'css',
    'json',
    'xml',
    'py',
    'rb',
    'php',
    'java',
    'c',
    'cpp',
  ],
  AUDIO: ['mp3', 'wav', 'ogg', 'flac', 'm4a'],
  VIDEO: ['mp4', 'mov', 'avi', 'mkv', 'wmv', 'webm'],
};

export const getFileCategory = (ext?: string) => {
  if (!ext) return 'unknown';

  const lowerExt = ext.toLowerCase();

  const category = Object.keys(FILE_TYPES).find((key) =>
    FILE_TYPES[key as keyof typeof FILE_TYPES].includes(lowerExt)
  );

  return category?.toLowerCase() || 'unknown';
};
/**
 * Get appropriate icon for a file based on its extension
 */
export function getFileTypeIcon(
  ext?: string,
  className?: string
): React.ReactNode {
  if (!ext) {
    return <FileType className={className || 'h-4 w-4'} />;
  }

  const lowerExt = ext.toLowerCase();

  // Images
  if (FILE_TYPES.IMAGE.includes(lowerExt)) {
    return <FileImage className='size-4' />;
  }

  // Documents
  if (lowerExt === 'pdf') {
    return <FileText className='size-4' />;
  }

  if (FILE_TYPES.DOCUMENT.includes(lowerExt)) {
    return '📝';
  }

  // Spreadsheets
  if (FILE_TYPES.SPREADSHEET.includes(lowerExt)) {
    return <FileSpreadsheet className='size-4' />;
  }

  // Presentations
  if (FILE_TYPES.PRESENTATION.includes(lowerExt)) {
    return '📊';
  }

  // Archives
  if (FILE_TYPES.ARCHIVE.includes(lowerExt)) {
    return '🗄️';
  }

  // Code files
  if (FILE_TYPES.CODE.includes(lowerExt)) {
    return '📋';
  }

  // Audio files
  if (FILE_TYPES.AUDIO.includes(lowerExt)) {
    return '🎵';
  }

  // Video files
  if (FILE_TYPES.VIDEO.includes(lowerExt)) {
    return '🎬';
  }

  // Default
  return '📑';
}

/**
 * Format file size in a human-readable way
 */
export function formatFileSize(bytes?: number): string {
  if (bytes === undefined || bytes === null) return 'Unknown';

  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Check if a file is previewable in the browser
 */
export function isPreviewable(file: {
  title?: string;
  ext?: string;
  type?: string;
}): boolean {
  if (!file.ext) return false;

  const ext = file.ext.toLowerCase();

  // Images can be previewed
  if (FILE_TYPES.IMAGE.includes(ext)) {
    return true;
  }

  // PDFs can be previewed in most browsers
  if (ext === 'pdf') {
    return true;
  }

  // Text files
  if (['txt', 'md', 'json', 'xml', 'html', 'css', 'js', 'ts'].includes(ext)) {
    return true;
  }

  return false;
}
