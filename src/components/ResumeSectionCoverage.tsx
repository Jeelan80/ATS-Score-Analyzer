import React from 'react';
import './ResumeSectionCoverage.css';

interface ResumeSectionCoverageProps {
  resumeText: string;
}

const sections = [
  { label: 'Summary', emoji: '📝', keywords: ['summary', 'profile', 'objective'] },
  { label: 'Skills', emoji: '🛠️', keywords: ['skills', 'technologies', 'competencies'] },
  { label: 'Experience', emoji: '💼', keywords: ['experience', 'employment', 'work history'] },
  { label: 'Education', emoji: '🎓', keywords: ['education', 'degree', 'university', 'college'] },
  { label: 'Projects', emoji: '📁', keywords: ['projects', 'portfolio'] },
  { label: 'Certifications', emoji: '📜', keywords: ['certification', 'certifications', 'certificate'] },
  { label: 'Awards', emoji: '🏆', keywords: ['award', 'honor', 'achievement'] },
  { label: 'Languages', emoji: '🌐', keywords: ['languages', 'language'] },
];

const ResumeSectionCoverage: React.FC<ResumeSectionCoverageProps> = ({ resumeText }) => {
  const lowerText = (resumeText ?? '').toLowerCase();
  return (
    <section className="resume-section-coverage">
      <h3 className="resume-section-coverage-title">Resume Section Coverage</h3>
      <div className="resume-section-coverage-grid">
        {sections.map(section => {
          const present = section.keywords.some(kw => lowerText.includes(kw));
          return (
            <div
              key={section.label}
              className={`resume-section-tile ${present ? 'present' : 'missing'}`}
            >
              <span className="section-emoji" role="img" aria-label={section.label}>
                {present ? '✅' : '❌'}
              </span>
              {section.label}
              <span className={`section-status-badge ${present ? 'present-badge' : 'missing-badge'}`}>{present ? 'Present' : 'Missing'}</span>
              <span className="section-tooltip">
                {present ? 'Section found in resume' : 'Section not found'}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 text-xs text-gray-500">Green = present, Pink = missing (detected by keywords)</div>
    </section>
  );
};

export default ResumeSectionCoverage;
