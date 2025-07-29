import React, { useMemo, useState } from 'react';
import WordCloud from 'react-d3-cloud';
import styles from './HeroWordCloud.module.css';

export interface CloudWord {
  text: string;
  value: number;
  rotate?: number;
  color?: string;
  title?: string;
}

interface HeroWordCloudProps {
  heroWord: string;
  cloudWords: CloudWord[];
  width?: number;
  height?: number;
}

const palette = [
  '#ffffff', '#ff5252', '#ffd600', '#00e676', '#ff9100', '#42a5f5', '#f50057', '#00bcd4', '#ffeb3b', '#aeea00', '#ff6d00', '#00bfae', '#e040fb', '#ff3d00', '#c6ff00', '#ff1744', '#00e5ff', '#76ff03', '#ffea00', '#ffab00', '#00c853'
];

// Custom render function for WordCloud to show a visible tooltip
const getRenderWord = (heroWord: string, setTooltip: (tip: { x: number; y: number; text: string } | null) => void) =>
  (word: CloudWord, props: { x: number; y: number; rotate: number; fontSize: number }) => (
    <g>
      <rect
        x={props.x - props.fontSize * word.text.length / 4}
        y={props.y - props.fontSize / 2}
        width={props.fontSize * word.text.length / 2}
        height={props.fontSize + 8}
        fill="transparent"
        onMouseOver={e => {
          console.log('MouseOver rect:', word.text, e.clientX, e.clientY);
          const svg = (e.target as SVGElement).ownerSVGElement;
          if (!svg) {
            console.warn('SVG owner not found for rect:', word.text);
            return;
          }
          const rect = svg.getBoundingClientRect();
          console.log('SVG bounding rect:', rect);
          setTooltip({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top - 30,
            text: `${word.text} (${word.value})`,
          });
        }}
        onMouseOut={() => {
          console.log('MouseOut rect:', word.text);
          setTooltip(null);
        }}
        className={styles.wordCloudRect}
      />
      <text
        key={word.text}
        className={styles.wordCloudText}
        textAnchor="middle"
        transform={`translate(${props.x},${props.y}) rotate(${props.rotate})`}
        fontFamily="Impact, Arial Black, sans-serif"
        fontWeight={word.text.toLowerCase() === heroWord.toLowerCase() ? "900" : "bold"}
        fontSize={props.fontSize}
        fill={word.color || palette[0]}
      >
        {word.text}
      </text>
    </g>
  );

const HeroWordCloud: React.FC<HeroWordCloudProps> = ({ heroWord, cloudWords, width = 700, height = 400 }) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  // Add hero word to cloud with a much larger value
  const allCloudWords = useMemo(() => {
    const maxValue = cloudWords.length ? Math.max(...cloudWords.map(w => w.value)) : 1;
    const heroCloudWord: CloudWord = {
      text: heroWord,
      value: maxValue * 2.2, // Make it much larger than others
      rotate: 0,
      color: undefined,
      title: `${heroWord} (${maxValue * 2.2})`,
    };
    return [
      heroCloudWord,
      ...cloudWords
        .filter(w => w.text.toLowerCase() !== heroWord.toLowerCase())
        .map(w => ({ ...w, title: `${w.text} (${w.value})` })),
    ];
  }, [heroWord, cloudWords]);

  // Assign random rotation and color to non-hero words
  const dataWithRotation = useMemo(
    () =>
      allCloudWords.map(word =>
        word.text.toLowerCase() === heroWord.toLowerCase()
          ? word
          : {
              ...word,
              rotate: Math.random() < 0.3 ? 90 : 0,
              color: palette[Math.floor(Math.random() * palette.length)]
            }
      ),
    [allCloudWords, heroWord]
  );

  // Map value to font size (18-70)
  const minFont = 18, maxFont = 70;
  const minValue = dataWithRotation.length ? Math.min(...dataWithRotation.map(w => w.value)) : 1;
  const maxCloudValue = dataWithRotation.length ? Math.max(...dataWithRotation.map(w => w.value)) : 1;
  const fontSize = (word: CloudWord) => {
    if (maxCloudValue === minValue) return maxFont;
    return minFont + ((word.value - minValue) / (maxCloudValue - minValue)) * (maxFont - minFont);
  };

  // Use the tooltip prop if available, otherwise rely on the title property in the data
  return (
    <div className={styles.wordCloudContainer + ' wordcloud-canvas'}>
      <WordCloud
        width={width}
        height={height}
        data={dataWithRotation}
        font="Impact, Arial Black, sans-serif"
        fontWeight="bold"
        fontStyle="normal"
        fontSize={fontSize}
        spiral="archimedean"
        padding={2}
        rotate={(word: CloudWord) => word.rotate ?? 0}
        fill={(word: CloudWord) => word.color || palette[0]}
        random={Math.random}
        // @ts-expect-error: renderWord is not in the type definition but is supported by react-d3-cloud
        renderWord={getRenderWord(heroWord, setTooltip)}
      />
      {tooltip && (
        <div
          className={styles.wordCloudTooltip}
          data-tooltip-left={tooltip.x}
          data-tooltip-top={tooltip.y}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

export default HeroWordCloud;