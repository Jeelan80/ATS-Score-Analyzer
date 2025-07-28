import React from 'react';
import './KeywordHeatmapSection.css';

interface KeywordHeatmapSectionProps {
  matchingKeywords: string[];
  missingKeywords: string[];
}

const KeywordHeatmapSection: React.FC<KeywordHeatmapSectionProps> = ({ matchingKeywords, missingKeywords }) => {
  const allKeywords = [...matchingKeywords, ...missingKeywords];
  return (
    <section className="keyword-heatmap-section">
      <h3 className="keyword-heatmap-title">Keyword Coverage Heatmap</h3>
      <div className="keyword-heatmap-grid">
        {allKeywords.map((keyword) => {
          const isMissing = missingKeywords.includes(keyword);
          return (
            <div
              key={keyword}
              className={`keyword-heatmap-tile ${isMissing ? 'missing' : 'present'}`}
            >
              <span className="heatmap-emoji" role="img" aria-label={isMissing ? 'Missing' : 'Present'}>
                {isMissing ? '❌' : '✅'}
              </span>
              {keyword}
              <span className="heatmap-tooltip">
                {isMissing ? 'Missing from resume' : 'Present in resume'}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 text-xs text-gray-500">❌ = missing, ✅ = present</div>
    </section>
  );
};

export default KeywordHeatmapSection;
