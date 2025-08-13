// File validation utilities for upload functionality

export interface FileValidationError {
  file: File;
  errors: string[];
}

export interface FileValidationResult {
  validFiles: File[];
  errors: FileValidationError[];
  totalSize: number;
}

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp'
];

const FILE_EXTENSIONS = [
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt',
  '.jpg', '.jpeg', '.png', '.gif', '.webp'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file
const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB total

export function validateFiles(files: File[]): FileValidationResult {
  const validFiles: File[] = [];
  const errors: FileValidationError[] = [];
  let totalSize = 0;

  for (const file of files) {
    const fileErrors: string[] = [];

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      fileErrors.push(`File size exceeds 10MB limit (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    }

    // Check file type by MIME type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      // Fallback to file extension if MIME type is not recognized
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!FILE_EXTENSIONS.includes(fileExtension)) {
        fileErrors.push('File type not allowed. Supported types: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, JPEG, PNG, GIF, WEBP');
      }
    }

    // Check if file name is valid
    if (!file.name || file.name.trim().length === 0) {
      fileErrors.push('Invalid file name');
    }

    if (fileErrors.length > 0) {
      errors.push({ file, errors: fileErrors });
    } else {
      validFiles.push(file);
      totalSize += file.size;
    }
  }

  // Check total size
  if (totalSize > MAX_TOTAL_SIZE) {
    // Mark all files as having total size error
    const totalSizeError = `Total file size exceeds 50MB limit (${(totalSize / 1024 / 1024).toFixed(2)}MB)`;
    
    // Add error to all valid files
    for (const file of validFiles) {
      const existingError = errors.find(e => e.file === file);
      if (existingError) {
        existingError.errors.push(totalSizeError);
      } else {
        errors.push({ file, errors: [totalSizeError] });
      }
    }
    
    return { validFiles: [], errors, totalSize };
  }

  return { validFiles, errors, totalSize };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileValidationSummary(result: FileValidationResult): string {
  if (result.errors.length === 0) {
    return `${result.validFiles.length} files ready for upload (${formatFileSize(result.totalSize)})`;
  }
  
  const errorCount = result.errors.length;
  const validCount = result.validFiles.length;
  
  if (validCount === 0) {
    return `${errorCount} file${errorCount > 1 ? 's' : ''} with errors - none can be uploaded`;
  }
  
  return `${validCount} valid file${validCount > 1 ? 's' : ''}, ${errorCount} with errors`;
}