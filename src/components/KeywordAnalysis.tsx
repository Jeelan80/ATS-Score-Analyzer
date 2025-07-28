import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface KeywordAnalysisProps {
  matchingKeywords: string[];
  missingKeywords: string[];
}

export const KeywordAnalysis: React.FC<KeywordAnalysisProps> = ({
  matchingKeywords,
  missingKeywords,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Keyword Analysis</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Matching Keywords */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h4 className="text-lg font-semibold text-green-800">
              Matching Keywords ({matchingKeywords.length})
            </h4>
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {matchingKeywords.length > 0 ? (
              matchingKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full mr-2 mb-2"
                >
                  {keyword}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No matching keywords found</p>
            )}
          </div>
        </div>
        
        {/* Missing Keywords */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <XCircle className="h-5 w-5 text-red-600" />
            <h4 className="text-lg font-semibold text-red-800">
              Missing Keywords ({missingKeywords.length})
            </h4>
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {missingKeywords.length > 0 ? (
              missingKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full mr-2 mb-2"
                >
                  {keyword}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No missing keywords identified</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};