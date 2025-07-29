import React, { useCallback, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface ResumeUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClearFile: () => void;
  disabled?: boolean;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  onFileSelect,
  selectedFile,
  onClearFile,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    if (pdfFile) {
      if (pdfFile.size > 10 * 1024 * 1024) {
        setError('PDF file size must be 10MB or less.');
        return;
      }
      setError(null);
      onFileSelect(pdfFile);
    }
  }, [onFileSelect, disabled]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('PDF file size must be 10MB or less.');
        e.target.value = '';
        return;
      }
      if (file.type === 'application/pdf') {
        setError(null);
        onFileSelect(file);
      }
    }
    e.target.value = '';
  }, [onFileSelect]);

  return (
    <div className="space-y-4 min-w-0 break-words">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Resume Upload
      </label>
      
      {error && (
        <div className="text-xs text-red-600 font-semibold mb-2">{error}</div>
      )}
      {selectedFile ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg min-w-0 break-words">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 break-words">
            <FileText className="h-5 w-5 text-green-600" />
            <span className="text-xs sm:text-sm font-medium text-green-800 break-words">
              {selectedFile.name}
            </span>
          </div>
          <button
            onClick={onClearFile}
            disabled={disabled}
            className="p-1 hover:bg-green-100 rounded-full transition-colors duration-200 disabled:opacity-50"
            title="Clear file"
            aria-label="Clear file"
          >
            <X className="h-4 w-4 text-green-600" />
          </button>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            isDragOver && !disabled
              ? 'border-blue-400 bg-blue-50'
              : disabled
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 hover:border-gray-400 cursor-pointer'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label htmlFor="resume-upload-input" className="sr-only">Upload your resume file</label>
          <input
            id="resume-upload-input"
            type="file"
            accept=".pdf"
            onChange={handleFileInput}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            title="Upload your resume file"
            aria-label="Upload your resume file"
            placeholder="Select resume file"
          />
          
          <Upload className={`mx-auto h-12 w-12 mb-4 ${
            disabled ? 'text-gray-300' : 'text-gray-400'
          }`} />
          
          <p className={`text-lg font-medium mb-2 ${
            disabled ? 'text-gray-400' : 'text-gray-700'
          }`}>
            Click to Upload or Drag and Drop Resume
          </p>
          
          <p className={`text-sm ${
            disabled ? 'text-gray-300' : 'text-gray-500'
          }`}>
            PDF files only, up to 10MB
          </p>
        </div>
      )}
    </div>
  );
};