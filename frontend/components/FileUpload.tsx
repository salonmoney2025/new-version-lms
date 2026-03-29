'use client';

import { useState, useRef } from 'react';
import {
  Upload,
  File,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  FileVideo,
  FileArchive,
} from 'lucide-react';

interface FileUploadProps {
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  multiple?: boolean;
  onUpload?: (files: File[]) => void;
  category?: string;
}

interface UploadedFile {
  file: File;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

export default function FileUpload({
  maxSize = 10,
  acceptedTypes = ['*/*'],
  multiple = false,
  onUpload,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <ImageIcon className="w-6 h-6" />;
    }
    if (['mp4', 'avi', 'mov', 'mkv'].includes(extension || '')) {
      return <FileVideo className="w-6 h-6" />;
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '')) {
      return <FileArchive className="w-6 h-6" />;
    }
    return <FileText className="w-6 h-6" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size exceeds ${maxSize}MB limit`;
    }

    // Check file type
    if (acceptedTypes.length > 0 && !acceptedTypes.includes('*/*')) {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const mimeType = file.type;
      const isAccepted = acceptedTypes.some(
        (type) => type === mimeType || type === fileExtension || type === '*/*'
      );
      if (!isAccepted) {
        return `File type not accepted. Allowed types: ${acceptedTypes.join(', ')}`;
      }
    }

    return null;
  };

  const simulateUpload = (file: File, index: number) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f, i) =>
            i === index ? { ...f, status: 'success', progress: 100 } : f
          )
        );
      } else {
        setFiles((prev) =>
          prev.map((f, i) => (i === index ? { ...f, progress: Math.min(progress, 99) } : f))
        );
      }
    }, 500);
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList);
    const validatedFiles: UploadedFile[] = newFiles.map((file) => {
      const error = validateFile(file);
      return {
        file,
        status: error ? 'error' : 'uploading',
        progress: error ? 0 : 0,
        error,
      };
    });

    setFiles((prev) => (multiple ? [...prev, ...validatedFiles] : validatedFiles));

    // Simulate upload for valid files
    validatedFiles.forEach((uploadedFile, index) => {
      if (uploadedFile.status === 'uploading') {
        const currentIndex = multiple ? files.length + index : index;
        simulateUpload(uploadedFile.file, currentIndex);
      }
    });

    if (onUpload) {
      onUpload(validatedFiles.filter((f) => !f.error).map((f) => f.file));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-portal-teal-500 bg-portal-teal-50 dark:bg-portal-teal-900/20'
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        <Upload
          className={`w-12 h-12 mx-auto mb-4 ${
            isDragging
              ? 'text-portal-teal-600 dark:text-portal-teal-400'
              : 'text-gray-400'
          }`}
        />

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {isDragging ? 'Drop files here' : 'Upload Files'}
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Drag and drop your files here, or click to browse
        </p>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-2 bg-portal-teal-600 text-white rounded-lg hover:bg-portal-teal-700 transition-colors"
        >
          Browse Files
        </button>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
          Maximum file size: {maxSize}MB
          {acceptedTypes.length > 0 && acceptedTypes[0] !== '*/*' && (
            <span> • Accepted: {acceptedTypes.join(', ')}</span>
          )}
        </p>
      </div>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {files.length} {files.length === 1 ? 'File' : 'Files'}
          </h4>
          {files.map((uploadedFile, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className={`flex-shrink-0 ${
                    uploadedFile.status === 'success'
                      ? 'text-green-600'
                      : uploadedFile.status === 'error'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}>
                    {getFileIcon(uploadedFile.file.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(uploadedFile.file.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {uploadedFile.status === 'success' && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {uploadedFile.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              {uploadedFile.status === 'uploading' && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-portal-teal-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadedFile.progress}%` }}
                  />
                </div>
              )}

              {/* Error Message */}
              {uploadedFile.error && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                  {uploadedFile.error}
                </p>
              )}

              {/* Success Message */}
              {uploadedFile.status === 'success' && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  Upload complete
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
