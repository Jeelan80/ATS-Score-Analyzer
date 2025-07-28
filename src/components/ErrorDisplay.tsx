import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { AnalysisError } from '../types';

interface ErrorDisplayProps {
  error: AnalysisError;
  onRetry: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  const getErrorIcon = () => {
    switch (error.type) {
      case 'upload':
        return <AlertCircle className="h-12 w-12 text-red-500" />;
      case 'api':
        return <RefreshCw className="h-12 w-12 text-red-500" />;
      default:
        return <AlertCircle className="h-12 w-12 text-red-500" />;
    }
  };

  const getErrorTitle = () => {
    switch (error.type) {
      case 'upload':
        return 'Upload Error';
      case 'api':
        return 'Analysis Failed';
      case 'parsing':
        return 'PDF Parsing Error';
      case 'validation':
        return 'Validation Error';
      default:
        return 'Error';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <div className="mb-4">
        {getErrorIcon()}
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {getErrorTitle()}
      </h3>
      
      <p className="text-gray-600 mb-6">
        {error.message}
      </p>
      
      <button
        onClick={onRetry}
        className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
      >
        <RefreshCw className="h-4 w-4" />
        <span>Try Again</span>
      </button>
    </div>
  );
};