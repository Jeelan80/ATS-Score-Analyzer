import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface ScoreCardProps {
  score: number;
  summary: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score, summary }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Needs Improvement';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center flex flex-col items-center">
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Match Score</h3>
      <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6">
        <CircularProgressbar
          value={score}
          text={`${score}%`}
          styles={buildStyles({
            textSize: '16px',
            pathColor: getScoreColor(score),
            textColor: getScoreColor(score),
            trailColor: '#E5E7EB',
            backgroundColor: '#F3F4F6',
          })}
        />
      </div>
      
      <div className="space-y-1 sm:space-y-2">
        <p className={`text-base sm:text-lg font-semibold ${score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}> 
          {getScoreLabel(score)}
        </p>
        <p className="text-gray-600 text-sm sm:text-base">
          {summary}
        </p>
      </div>
    </div>
  );
};