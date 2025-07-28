import React from 'react';
import { Loader2, Zap } from 'lucide-react';

interface ActionPanelProps {
  onAnalyze: () => void;
  disabled: boolean;
  loading: boolean;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({
  onAnalyze,
  disabled,
  loading,
}) => {
  return (
    <div className="flex justify-center py-8">
      <button
        onClick={onAnalyze}
        disabled={disabled || loading}
        className="flex items-center space-x-3 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <Zap className="h-5 w-5" />
            <span>Analyze Resume</span>
          </>
        )}
      </button>
    </div>
  );
};