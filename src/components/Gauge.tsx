import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './Gauge.css';

interface GaugeProps {
  value: number;
  max: number;
  text: string;
  color?: string; // Now optional, will use theme if not provided
  trailColor?: string;
  size?: number;
  theme?: 'blue' | 'teal' | 'purple' | 'orange' | 'pink';
}

const getSizeClass = (size: number) => {
  if (size <= 80) return 'gauge-size-80';
  if (size <= 100) return 'gauge-size-100';
  if (size <= 120) return 'gauge-size-120';
  return 'gauge-size-80';
};


// Vibrant color themes
const gaugeThemes = {
  blue:   { path: '#2563eb', text: '#2563eb', trail: '#dbeafe' },
  teal:   { path: '#14b8a6', text: '#14b8a6', trail: '#ccfbf1' },
  purple: { path: '#a21caf', text: '#a21caf', trail: '#f3e8ff' },
  orange: { path: '#f59e42', text: '#f59e42', trail: '#ffedd5' },
  pink:   { path: '#ec4899', text: '#ec4899', trail: '#fce7f3' },
};

const Gauge: React.FC<GaugeProps> = ({ value, max, text, color, trailColor, size = 80, theme = 'teal' }) => {
  // Pick theme colors
  const t = gaugeThemes[theme] || gaugeThemes.teal;
  const pathColor = color || t.path;
  const textColor = color || t.text;
  const trail = trailColor || t.trail;
  return (
    <div className={`gauge-container ${getSizeClass(size)}`}>
      <CircularProgressbar
        value={value}
        maxValue={max}
        text={text}
        styles={buildStyles({
          pathColor,
          textColor,
          trailColor: trail,
          textSize: '1.2rem',
          strokeLinecap: 'round',
        })}
      />
    </div>
  );
};

export default Gauge;
