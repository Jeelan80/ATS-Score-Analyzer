import React from 'react';
import { ResumeUploader } from './ResumeUploader';
import { JobDescriptionInput } from './JobDescriptionInput';

interface InputSectionProps {
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onClearFile: () => void;
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  disabled?: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({
  selectedFile,
  onFileSelect,
  onClearFile,
  jobDescription,
  onJobDescriptionChange,
  disabled = false,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        <div className="min-w-0 break-words">
          <ResumeUploader
            selectedFile={selectedFile}
            onFileSelect={onFileSelect}
            onClearFile={onClearFile}
            disabled={disabled}
          />
        </div>
        <div className="min-w-0 break-words">
          <JobDescriptionInput
            value={jobDescription}
            onChange={onJobDescriptionChange}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};