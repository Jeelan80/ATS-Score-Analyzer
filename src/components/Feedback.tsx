import React from 'react';
import { Lightbulb } from 'lucide-react';

interface FeedbackProps {
  feedback: string;
}

export const Feedback: React.FC<FeedbackProps> = ({ feedback }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex items-center space-x-2 mb-3 sm:mb-4">
        <Lightbulb className="h-5 w-5 text-yellow-600" />
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Improvement Suggestions</h3>
      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
        <p className="text-gray-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
          {feedback}
        </p>
      </div>
    </div>
  );
};