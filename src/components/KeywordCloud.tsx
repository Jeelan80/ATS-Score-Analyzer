import React, { useEffect, useState } from 'react';
import WordCloud from 'react-wordcloud';
import 'tippy.js/dist/tippy.css'; // Optional: for tooltips
import 'tippy.js/animations/scale.css'; // Optional: for tooltips

// Define the shape of our data
interface WordData {
  text: string;
  value: number; // This determines the font size
}

// Sample data - In a real app, this would come from props or an API
const words: WordData[] = [
  { text: 'content', value: 64 },
  { text: 'words', value: 58 },
  { text: 'cloud', value: 50 },
  { text: 'tools', value: 45 },
  { text: 'want', value: 42 },
  { text: 'use', value: 40 },
  { text: 'keyword', value: 38 },
  { text: 'SEO', value: 35 },
  { text: 'help', value: 33 },
  { text: 'create', value: 30 },
  { text: 'website', value: 28 },
  { text: 'Google', value: 25 },
  { text: 'important', value: 24 },
  { text: 'text', value: 23 },
  { text: 'Word', value: 22 },
  { text: 'popular', value: 21 },
  { text: 'link', value: 20 },
  { text: 'Discovery', value: 19 },
  { text: 'easy', value: 18 },
  { text: 'SocialNicole', value: 15 },
  { text: 'RSS', value: 12 },
];


const options = {
  colors: ['#a3d478', '#42a5f5', '#ffffff', '#ffeb3b', '#a1887f'], // Green, Blue, White, Yellow, Brown
  enableTooltip: true,
  deterministic: false,
  fontFamily: 'sans-serif',
  fontSizes: [12, 90] as [number, number],
  fontStyle: 'normal',
  fontWeight: 'bold',
  padding: 1,
  rotations: 1, // Number of rotation angles
  rotationAngles: [0, 0] as [number, number], // All words will be horizontal
  scale: 'sqrt' as 'sqrt' | 'linear' | 'log',
  spiral: 'archimedean' as 'archimedean' | 'rectangular',
  transitionDuration: 1000,
};


// Accept real data as props
interface KeywordCloudComponentProps {
  words?: WordData[];
}

const KeywordCloudComponent: React.FC<KeywordCloudComponentProps> = ({ words: propWords }) => {
  const displayWords = propWords && propWords.length > 0 ? propWords : words;
  // Timer state to force re-layout
  const [cloudKey, setCloudKey] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCloudKey(k => k + 1);
    }, 20000); // 20 seconds
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="keyword-cloud-bg">
      <WordCloud key={cloudKey} words={displayWords} options={options} />
    </div>
  );
};

export default KeywordCloudComponent;
