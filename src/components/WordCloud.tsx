import React, { useRef, useEffect, useState } from 'react';
import './AdvancedStats.css';

interface WordCloudProps {
  resumeText: string;
}

const WordCloud: React.FC<WordCloudProps> = ({ resumeText }) => {
  interface PlacedWord {
    left: number;
    top: number;
    width: number;
    height: number;
    z: number;
    color: string;
    vertical: boolean;
    idx: number;
  }
  const [positions, setPositions] = useState<PlacedWord[]>([]);
  const [ready, setReady] = useState(false);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Prepare words and frequencies
  const stopwords = new Set(['the','and','a','to','of','in','for','on','with','at','by','an','be','is','are','as','from','that','this','it','or','was','but','if','not','your','you','i','we','our','us','they','their','them','he','she','his','her','my','me','so','do','does','did','have','has','had','will','would','can','could','should','may','might','about','which','who','whom','been','were','than','then','there','here','when','where','how','what','why','all','any','each','other','some','such','no','nor','too','very','just','also','more','most','own','same','s','t','don','now']);
  const text = resumeText.toLowerCase();
  const words = text.match(/\b[a-z]{3,}\b/g) || [];
  const freq: Record<string, number> = {};
  words.forEach(word => {
    if (!stopwords.has(word)) freq[word] = (freq[word] || 0) + 1;
  });
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 25);
  // Shuffle for cloud effect
  for (let k = sorted.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [sorted[k], sorted[j]] = [sorted[j], sorted[k]];
  }
  const max = sorted.length > 0 ? sorted[0][1] : 0;
  const min = sorted.length > 0 ? sorted[sorted.length - 1][1] : 0;
  const fontSizeClass = (count: number) => {
    if (max === min) return 'text-xl';
    const rel = (count - min) / Math.max(1, max - min);
    if (rel > 0.85) return 'text-4xl';
    if (rel > 0.65) return 'text-3xl';
    if (rel > 0.45) return 'text-2xl';
    if (rel > 0.25) return 'text-xl';
    return 'text-lg';
  };
  const palette = [
    '#b6e354', '#f9dd16', '#f7a700', '#f95d53', '#6ad7e5', '#4e9be6', '#b97fff', '#f7b7e0', '#fff', '#e6e6e6',
    '#e3e354', '#e3b354', '#e354b6', '#54e3b6', '#54b6e3', '#b654e3', '#e35454', '#54e354', '#e3e354', '#e354e3'
  ];
  const width = 600, height = 320;

  // First render: measure all words off-screen
  useEffect(() => {
    if (ready || sorted.length === 0 || wordRefs.current.length !== sorted.length) return;
    const placed: PlacedWord[] = [];
    // Helper: check if all 4 corners of a box are inside the ellipse
    function isBoxInEllipse(left: number, top: number, w: number, h: number, rx: number, ry: number, cx: number, cy: number) {
      // Check all 4 corners
      const corners = [
        [left, top],
        [left + w, top],
        [left, top + h],
        [left + w, top + h],
      ];
      return corners.every(([x, y]) => {
        const normX = (x - cx) / rx;
        const normY = (y - cy) / ry;
        return normX * normX + normY * normY <= 1;
      });
    }
    for (let i = 0; i < sorted.length; ++i) {
      const ref = wordRefs.current[i];
      if (!ref) continue;
      const rect = ref.getBoundingClientRect();
      const w = rect.width, h = rect.height;
      let attempt = 0; const maxAttempts = 500;
      let left = 0, top = 0;
      let found = false;
      const vertical = Math.random() < 0.18;
      const color = palette[Math.floor(Math.random() * palette.length)];
      const rx = width / 2;
      const ry = height / 2;
      const cx = width / 2;
      const cy = height / 2;
      while (attempt < maxAttempts && !found) {
        const angle = Math.random() * 2 * Math.PI;
        const r = Math.sqrt(Math.random());
        // Try to place the word anywhere in the ellipse
        const centerX = cx + Math.cos(angle) * r * (rx - w / 2);
        const centerY = cy + Math.sin(angle) * r * (ry - h / 2);
        left = Math.round(centerX - w / 2);
        top = Math.round(centerY - h / 2);
        // Ensure the entire box is inside the ellipse
        if (!isBoxInEllipse(left, top, w, h, rx, ry, cx, cy)) {
          attempt++;
          continue;
        }
        found = true;
        for (let j = 0; j < placed.length; ++j) {
          const p = placed[j];
          if (
            left < p.left + p.width &&
            left + w > p.left &&
            top < p.top + p.height &&
            top + h > p.top
          ) {
            found = false;
            break;
          }
        }
        attempt++;
      }
      placed.push({ left, top, width: w, height: h, z: 10 + Math.floor(Math.random() * 10), color, vertical, idx: i });
    }
    setPositions(placed);
    setReady(true);
    // palette is a constant, so it's safe to ignore exhaustive-deps warning
    // eslint-disable-next-line
  }, [ready, sorted.length]);

  // Early return if no keywords
  if (sorted.length === 0) {
    return <div className="text-gray-500 text-sm">No significant keywords found.</div>;
  }

  // First pass: render invisible words for measurement
  if (!ready) {
    return (
      <div className="cloud-measure-area">
        {sorted.map(([word, count], idx) => (
          <span
            key={word}
            ref={el => (wordRefs.current[idx] = el)}
            className={`cloud-word font-bold whitespace-nowrap select-none ${fontSizeClass(count)}`}
          >
            {word}
          </span>
        ))}
      </div>
    );
  }

  // Second pass: render positioned words
  return (
    <div
      className="cloud-area cloud-area-modern mx-auto my-4"
      ref={containerRef}
      data-width={width}
      data-height={height}
    >
      {positions.map((pos) => (
        <span
          key={sorted[pos.idx][0]}
          className={`cloud-word absolute font-bold whitespace-nowrap select-none transition-all duration-300 ${fontSizeClass(sorted[pos.idx][1])}${pos.vertical ? ' vertical-word' : ''}`}
          title={`Count: ${sorted[pos.idx][1]}`}
          data-cloud-idx={pos.idx}
        >
          {sorted[pos.idx][0]}
        </span>
      ))}
      <style>{`
        ${positions.map((pos) => `
          .cloud-word[data-cloud-idx="${pos.idx}"] {
            left: ${pos.left}px;
            top: ${pos.top}px;
            z-index: ${pos.z};
            color: ${pos.color};
            text-shadow: 2px 2px 6px #222, 0 0 2px #000;
          }
        `).join('')}
      `}</style>
    </div>
  );
};

export default WordCloud;
