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
    <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        <ResumeUploader
          selectedFile={selectedFile}
          onFileSelect={onFileSelect}
          onClearFile={onClearFile}
          disabled={disabled}
        />
        
        <JobDescriptionInput
          value={jobDescription}
          onChange={onJobDescriptionChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};