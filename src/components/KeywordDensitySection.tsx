import React from 'react';
import { Info } from 'lucide-react';
import './KeywordDensitySection.css';

interface KeywordDensity {
  keyword: string;
  count: number;
  percentage: number;
}

interface KeywordDensitySectionProps {
  densities: KeywordDensity[];
}


// Helper to pick a color class for the bar fill
const getBarClass = (percentage: number) => {
  if (percentage > 7) return 'bar-fill-high';
  if (percentage > 4) return 'bar-fill-mid';
  return 'bar-fill-low';
};

const KeywordDensitySection: React.FC<KeywordDensitySectionProps> = ({ densities }) => {
  return (
    <section className="keyword-density-section">
      <h3>Keyword Density Analysis</h3>
      <div className="section-desc mb-6">See which keywords appear most in your resume. Aim for a natural, balanced distribution.</div>
      <div>
        {densities.length === 0 && (
          <div className="text-gray-400 italic">No keywords found.</div>
        )}
        {densities.map((item) => (
          <div key={item.keyword} className="mb-5">
            <div className="flex items-center mb-1">
              {/* Animated icon based on density */}
              <span className="mr-2 animate-bounce" aria-label="keyword icon" role="img">
                {item.percentage > 7 ? '🔥' : item.percentage > 4 ? '✨' : '🌱'}
              </span>
              <span className="keyword-density-badge mr-2">{item.keyword}</span>
              <span className="keyword-density-label">{item.count} times</span>
              <span className="ml-auto text-xs text-sky-700 font-semibold flex items-center gap-1">
                {item.percentage}%
                <span className="tooltip-container">
                  <Info className="info-icon" size={14} />
                  <span className="tooltip-text">{item.keyword} appears {item.count} times ({item.percentage}%)</span>
                </span>
              </span>
            </div>
            <div className="keyword-density-bar">
              <div
                className={`keyword-density-bar-fill shimmer ${getBarClass(item.percentage)} bar-width-${Math.round(item.percentage / 5) * 5}`}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default KeywordDensitySection;
