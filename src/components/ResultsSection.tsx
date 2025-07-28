import React, { useState } from 'react';
import './ResultsSection.css';
import { AdvancedStats } from './AdvancedStats';
import { ScoreCard } from './ScoreCard';
import { ExtractedInfo } from './ExtractedInfo';
import { KeywordAnalysis } from './KeywordAnalysis';
import { Feedback } from './Feedback';
import { AnalysisResult } from '../types';


interface ResultsSectionProps {
  results: AnalysisResult;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ results }) => {
  const [showMore, setShowMore] = useState(false);
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold mb-2 text-white drop-shadow-lg results-title-glow">Analysis Results</h2>
        <p className="text-lg font-semibold text-white/90 drop-shadow-sm results-subtitle-glow">Here's how your resume matches the job description</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ScoreCard score={results.matchScore} summary={results.summary} />
        </div>
        <div className="lg:col-span-2">
          <ExtractedInfo extractedInfo={results.extractedInfo} />
        </div>
      </div>
      <KeywordAnalysis
        matchingKeywords={results.keywordAnalysis.matchingKeywords}
        missingKeywords={results.keywordAnalysis.missingKeywords}
      />
      <Feedback feedback={results.improvementFeedback} />
      <div className="flex justify-center mt-8">
        {!showMore && (
          <button
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg neon-btn hover:from-pink-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 transition-all duration-200"
            onClick={() => setShowMore(true)}
          >
            Want more results?
          </button>
        )}
      </div>
      {showMore && (
        <div className="mt-8 p-6 bg-gray-100 rounded-xl shadow-inner">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Advanced Statistics & Insights</h3>
          <AdvancedStats results={results} />
        </div>
      )}
    </div>
  );
};