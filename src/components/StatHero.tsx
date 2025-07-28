import React, { ReactNode } from 'react';
import './StatHero.css';

interface StatHeroProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  colorClass?: 'blue' | 'green' | 'red';
}

const StatHero: React.FC<StatHeroProps> = ({ icon, value, label, colorClass = 'blue' }) => (
  <div className="flex items-center gap-2">
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-lg">
      {icon}
    </span>
    <div>
      <div className={`stat-hero-value ${colorClass}`}>{value}</div>
      <div className="text-xs text-gray-500 font-medium">{label}</div>
    </div>
  </div>
);

export default StatHero;
