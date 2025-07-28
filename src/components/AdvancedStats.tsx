import React from 'react';
import Card from './Card';
import 'tippy.js/dist/tippy.css';
import './BuzzwordGlow.css';
import Gauge from './Gauge';
import StatHero from './StatHero';
// import { faFileAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import KeywordCloudComponent from './KeywordCloud';
import { AnalysisResult } from '../types';
import './AdvancedStats.css';

interface AdvancedStatsProps {
  results: AnalysisResult;
}

export const AdvancedStats: React.FC<AdvancedStatsProps> = ({ results }) => {
  // For Skill Match Breakdown
  const totalRequired = results.keywordAnalysis.matchingKeywords.length + results.keywordAnalysis.missingKeywords.length;
  const matched = results.keywordAnalysis.matchingKeywords.length;
  const matchedPercent = totalRequired ? Math.round((matched / totalRequired) * 100) : 0;
  const missingPercent = totalRequired ? 100 - matchedPercent : 0;

  // Pie chart math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const matchedStroke = (matchedPercent / 100) * circumference;
  const missingStroke = circumference - matchedStroke;

  return (
    <>
      <Card>
        <h4 className="text-lg font-semibold mb-2 text-gray-800">Skill Match Breakdown</h4>
        <div className="flex items-center space-x-4">
          <div className="w-32 h-32 flex items-center justify-center">
            {/* Improved pie chart using SVG, not cut off */}
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle
                r={radius}
                cx="60"
                cy="60"
                fill="#e5e7eb"
              />
              <circle
                r={radius}
                cx="60"
                cy="60"
                fill="transparent"
                stroke="#06b6d4"
                strokeWidth="12"
                strokeDasharray={`${matchedStroke} ${missingStroke}`}
                strokeDashoffset={circumference * 0.25}
                strokeLinecap="round"
                className="pie-skill-transition"
              />
            </svg>
          </div>
          <div>
            <div className="text-cyan-600 font-bold text-2xl">{matchedPercent}%</div>
            <div className="text-gray-700">Matched Skills</div>
            <div className="text-pink-500 font-bold text-lg mt-2">{missingPercent}%</div>
            <div className="text-gray-700">Missing Skills</div>
            <div className="mt-2 text-xs text-gray-500">Total required: {totalRequired}</div>
          </div>
        </div>
      </Card>

      {/* Resume Keyword Cloud */}
      <Card>
        <h4 className="text-lg font-semibold mb-2 text-gray-800">Resume Keyword Cloud</h4>
        {/* Non-overlapping word cloud using measurement and placement */}
        <div className="cloud-area-modern">
          {/* Generate real keyword frequency data for the cloud */}
          {(() => {
            const stopwords = new Set([
              'the','and','a','to','of','in','for','on','with','at','by','an','be','is','are','as','from','that','this','it','or','was','but','if','not','your','you','i','we','our','us','they','their','them','he','she','his','her','my','me','so','do','does','did','have','has','had','will','would','can','could','should','may','might','about','which','who','whom','been','were','than','then','there','here','when','where','how','what','why','all','any','each','other','some','such','no','nor','too','very','just','also','more','most','own','same','s','t','don','now'
            ]);
            const text = (results.resumeText ?? '').toLowerCase();
            const words = text.match(/\b[a-z]{3,}\b/g) || [];
            const freq: Record<string, number> = {};
            words.forEach(word => {
              if (!stopwords.has(word)) freq[word] = (freq[word] || 0) + 1;
            });
            const wordArray = Object.entries(freq)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 40)
              .map(([text, value]) => ({ text, value }));
            return <KeywordCloudComponent words={wordArray} />;
          })()}
        </div>
        <div className="mt-2 text-xs text-gray-500">Larger words = more frequent in your resume (common words excluded). Cloud is randomized for visual effect.</div>
      </Card>

      {/* Resume Readability & Length Analysis */}
      <Card>
        <h4 className="text-lg font-semibold mb-2 text-gray-800">Resume Readability & Length Analysis</h4>
        {(() => {
          const text = (results.resumeText ?? '').replace(/\s+/g, ' ').trim();
          const wordCount = text ? text.split(' ').length : 0;
          const readingTime = wordCount ? Math.max(1, Math.round(wordCount / 200)) : 0; // 200 wpm
          const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1;
          const syllables = text.split(/\b/).reduce((acc, word) => acc + (word.match(/[aeiouy]+/gi)?.length || 0), 0);
          const fkScore = wordCount ? Math.round(206.835 - 1.015 * (wordCount / sentences) - 84.6 * (syllables / wordCount)) : 0;
          let lengthStatus = '';
          type ColorType = 'green' | 'yellow' | 'red';
          let lengthColor: ColorType = 'green';
          if (wordCount < 250) { lengthStatus = 'Too short (add more detail)'; lengthColor = 'red'; }
          else if (wordCount > 900) { lengthStatus = 'Too long (consider condensing)'; lengthColor = 'red'; }
          else { lengthStatus = 'Good length'; lengthColor = 'green'; }
          let readabilityColor: ColorType = 'green';
          if (fkScore < 50) readabilityColor = 'red';
          else if (fkScore < 60) readabilityColor = 'yellow';
          else readabilityColor = 'green';
          const getColor = (color: ColorType) => color === 'green' ? '#22c55e' : color === 'yellow' ? '#eab308' : '#ef4444';
          return (
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="flex flex-col gap-4 items-center md:items-start">
                <StatHero icon="📄" value={wordCount} label="Word count" colorClass="blue" />
                <StatHero icon="⏱️" value={`${readingTime} min`} label="Estimated reading time" colorClass="blue" />
              </div>
              <div className="flex flex-col gap-4 items-center md:items-start">
                <div className="flex flex-col items-center">
                  <Gauge value={fkScore} max={100} text={`${fkScore}`} color={getColor(readabilityColor)} />
                  <div className="mt-2 text-sm font-semibold">Readability score</div>
                  <div className="text-xs text-gray-500">(higher is easier to read)</div>
                </div>
                <div className="flex flex-col items-center">
                  <Gauge value={wordCount > 900 ? 900 : wordCount} max={900} text={lengthStatus === 'Good length' ? '✔' : wordCount.toString()} color={getColor(lengthColor)} />
                  <div className="mt-2 text-sm font-semibold">Length status</div>
                  <div className={`text-xs font-bold ${lengthColor === 'green' ? 'text-green-600' : 'text-red-600'}`}>{lengthStatus}</div>
                </div>
              </div>
            </div>
          );
        })()}
        <div className="mt-2 text-xs text-gray-500">Aim for 250-900 words. Readability 60+ is good for most resumes.</div>
      </Card>

      {/* Buzzword & Filler Word Detector */}
      <Card>
        <h4 className="text-lg font-semibold mb-2 text-gray-800">Buzzword & Filler Word Detector</h4>
        <div className="mb-2 text-sm font-semibold text-gray-700">Buzzwords:</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {['hardworking','synergy','dynamic','go-getter','results-driven','innovative','passionate','motivated','strategic','proactive','detail-oriented','self-starter','team player','fast learner','visionary','guru','rockstar','ninja','thought leader','disruptive'].map(word => {
            const present = (results.resumeText ?? '').toLowerCase().includes(word);
            const suggestion = `Instead of "${word}", describe a specific achievement or role.`;
            return present ? (
              <span
                key={word}
                className="px-3 py-1 rounded text-xs font-semibold border transition-all duration-200 bg-yellow-100 text-yellow-700 border-yellow-300 buzzword-glow tippy"
                data-tippy-content={suggestion}
              >
                {word}
              </span>
            ) : (
              <span key={word} className="px-3 py-1 rounded text-xs font-semibold border transition-all duration-200 bg-gray-100 text-gray-400 border-gray-200 opacity-60">{word}</span>
            );
          })}
        </div>
        <div className="mb-2 text-sm font-semibold text-gray-700">Filler Phrases:</div>
        <div className="flex flex-wrap gap-2">
          {['responsible for','helped with','worked on','participated in','assisted with','involved in','tasked with','contributed to','supported','assisted','aided','made sure','ensured','took part in'].map(phrase => {
            const present = (results.resumeText ?? '').toLowerCase().includes(phrase);
            const suggestion = `Try to replace "${phrase}" with a specific, impactful description.`;
            return present ? (
              <span
                key={phrase}
                className="px-3 py-1 rounded text-xs font-semibold border transition-all duration-200 bg-orange-100 text-orange-700 border-orange-300 buzzword-glow orange tippy"
                data-tippy-content={suggestion}
              >
                {phrase}
              </span>
            ) : (
              <span key={phrase} className="px-3 py-1 rounded text-xs font-semibold border transition-all duration-200 bg-gray-100 text-gray-400 border-gray-200 opacity-60">{phrase}</span>
            );
          })}
        </div>

        <div className="mt-2 text-xs text-gray-500">Yellow/Orange = present, Gray = not found. Try to replace these with specific, impactful language.</div>
      </Card>

      {/* Soft Skills & Action Verbs Detection */}
      <Card>
        <h4 className="text-lg font-semibold mb-2 text-gray-800">Soft Skills & Action Verbs Detection</h4>
        <div className="mb-2 text-sm font-semibold text-gray-700">Soft Skills:</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {['teamwork','leadership','communication','problem solving','adaptability','creativity','time management','collaboration','initiative','critical thinking','organization','flexibility','work ethic','attention to detail','empathy'].map(skill => {
            const present = (results.resumeText ?? '').toLowerCase().includes(skill);
            return (
              <span key={skill} className={`px-3 py-1 rounded text-xs font-semibold border transition-all duration-200 ${present ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-400 border-gray-200 opacity-60'}`}>{skill}</span>
            );
          })}
        </div>
        <div className="mb-2 text-sm font-semibold text-gray-700">Action Verbs:</div>
        <div className="flex flex-wrap gap-2">
          {['led','managed','developed','designed','implemented','created','improved','achieved','coordinated','analyzed','built','launched','initiated','delivered','organized','increased','reduced','solved','mentored','presented','negotiated','researched','supported','trained','streamlined','executed'].map(verb => {
            const present = (results.resumeText ?? '').toLowerCase().includes(verb);
            return (
              <span key={verb} className={`px-3 py-1 rounded text-xs font-semibold border transition-all duration-200 ${present ? 'bg-cyan-100 text-cyan-700 border-cyan-300' : 'bg-gray-100 text-gray-400 border-gray-200 opacity-60'}`}>{verb}</span>
            );
          })}
        </div>
        <div className="mt-2 text-xs text-gray-500">Green/Cyan = present, Gray = missing (detected by keyword match)</div>
      </Card>

      {/* Top Missing Keywords Suggestions */}
      {results.keywordAnalysis.missingKeywords.length > 0 && (
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-2 text-gray-800">Top Missing Keywords Suggestions</h4>
          <ul className="space-y-2">
            {results.keywordAnalysis.missingKeywords.slice(0, 5).map((keyword) => (
              <li key={keyword} className="bg-pink-50 border border-pink-200 rounded p-3 flex items-start space-x-3">
                <span className="text-pink-500 font-bold">{keyword}</span>
                <span className="text-xs text-gray-700">Try to naturally include this keyword in your resume, e.g., in your skills, experience, or summary section.</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 text-xs text-gray-500">Add these keywords to improve your match score.</div>
        </div>
      )}

      {/* Keyword Density Analysis */}
      <Card>
        <h4 className="text-lg font-semibold mb-2 text-gray-800">Keyword Density Analysis</h4>
        <div className="space-y-2">
          {results.keywordAnalysis.matchingKeywords.concat(results.keywordAnalysis.missingKeywords).map((keyword) => {
            // Count occurrences in resumeText (case-insensitive)
            const regex = new RegExp(`\\b${keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") }\\b`, 'gi');
            const count = ((results.resumeText ?? '').match(regex) || []).length;
            const isMissing = results.keywordAnalysis.missingKeywords.includes(keyword);
            return (
              <div key={keyword} className="flex items-center">
                <span className={`w-32 text-sm ${isMissing ? 'text-pink-500' : 'text-cyan-700'} font-medium`}>{keyword}</span>
                <div className="flex-1 mx-2 bg-gray-200 rounded h-4 relative">
                  {(() => {
                    // Map count to width class (max 5+)
                    const widthClass = count >= 5
                      ? 'w-full'
                      : count === 4
                        ? 'w-4/5'
                        : count === 3
                          ? 'w-3/5'
                          : count === 2
                            ? 'w-2/5'
                            : count === 1
                              ? 'w-1/5'
                              : 'w-0';
                    return (
                      <div
                        className={`h-4 rounded bar-width-transition ${widthClass} ${isMissing ? 'bg-pink-300' : 'bg-cyan-400'}`}
                      ></div>
                    );
                  })()}
                  <span className="absolute right-2 top-0 text-xs text-gray-700">{count}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 text-xs text-gray-500">Bar length = frequency (max 5+)</div>
      </Card>

      {/* Keyword Coverage Heatmap */}
      <Card>
        <h4 className="text-lg font-semibold mb-2 text-gray-800">Keyword Coverage Heatmap</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {results.keywordAnalysis.matchingKeywords.concat(results.keywordAnalysis.missingKeywords).map((keyword) => {
            const isMissing = results.keywordAnalysis.missingKeywords.includes(keyword);
            return (
              <div
                key={keyword}
                className={`px-3 py-2 rounded text-center text-xs font-semibold shadow-sm transition-all duration-200
                  ${isMissing ? 'bg-pink-100 text-pink-500 border border-pink-300 opacity-60' : 'bg-cyan-100 text-cyan-700 border border-cyan-300 opacity-100'}`}
                title={isMissing ? 'Missing from resume' : 'Present in resume'}
              >
                {keyword}
              </div>
            );
          })}
        </div>
        <div className="mt-2 text-xs text-gray-500">Pink = missing, Cyan = present</div>
      </Card>
      {/* Resume Section Coverage */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-2 text-gray-800">Resume Section Coverage</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {[
            { label: 'Summary', keywords: ['summary', 'profile', 'objective'] },
            { label: 'Skills', keywords: ['skills', 'technologies', 'competencies'] },
            { label: 'Experience', keywords: ['experience', 'employment', 'work history'] },
            { label: 'Education', keywords: ['education', 'degree', 'university', 'college'] },
            { label: 'Projects', keywords: ['projects', 'portfolio'] },
            { label: 'Certifications', keywords: ['certification', 'certifications', 'certificate'] },
            { label: 'Awards', keywords: ['award', 'honor', 'achievement'] },
            { label: 'Languages', keywords: ['languages', 'language'] },
          ].map(section => {
            const present = section.keywords.some(kw => (results.resumeText ?? '').toLowerCase().includes(kw));
            return (
              <div
                key={section.label}
                className={`flex items-center px-3 py-2 rounded text-xs font-semibold shadow-sm border transition-all duration-200
                  ${present ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-400 border-gray-200 opacity-60'}`}
                title={present ? 'Section found in resume' : 'Section not found'}
              >
                <span className="mr-2">{present ? '✔️' : '❌'}</span> {section.label}
              </div>
            );
          })}
        </div>
        <div className="mt-2 text-xs text-gray-500">Green = present, Gray = missing (detected by keywords)</div>
      </div>
    </>
  );
};
