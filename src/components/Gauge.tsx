import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './Gauge.css';

interface GaugeProps {
  value: number;
  max: number;
  text: string;
  color: string;
  trailColor?: string;
  size?: number;
}

const getSizeClass = (size: number) => {
  if (size <= 80) return 'gauge-size-80';
  if (size <= 100) return 'gauge-size-100';
  if (size <= 120) return 'gauge-size-120';
  return 'gauge-size-80';
};

const Gauge: React.FC<GaugeProps> = ({ value, max, text, color, trailColor = '#e5e7eb', size = 80 }) => (
  <div className={`gauge-container ${getSizeClass(size)}`}>
    <CircularProgressbar
      value={value}
      maxValue={max}
      text={text}
      styles={buildStyles({
        pathColor: color,
        textColor: color,
        trailColor,
        textSize: '1.2rem',
        strokeLinecap: 'round',
      })}
    />
  </div>
);

export default Gauge;
