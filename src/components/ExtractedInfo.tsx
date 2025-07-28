import React from 'react';
import { User, Mail, Phone, Linkedin } from 'lucide-react';

interface ExtractedInfoProps {
  extractedInfo: {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    github?: string;
  };
}

export const ExtractedInfo: React.FC<ExtractedInfoProps> = ({ extractedInfo }) => {

  const infoItems = [
    { icon: User, label: 'Name', value: extractedInfo.name },
    { icon: Mail, label: 'Email', value: extractedInfo.email },
    { icon: Phone, label: 'Phone', value: extractedInfo.phone },
    { icon: Linkedin, label: 'LinkedIn', value: extractedInfo.linkedin ? 'Found' : 'Not found' },
  ];
  // Only show GitHub if present
  const showGithub = extractedInfo.github && extractedInfo.github !== 'Not found';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Extracted Information</h3>
      
      <div className="space-y-4">
        {infoItems.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <Icon className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700">{label}</p>
              <p className="text-sm text-gray-900 truncate">
                {value || 'Not found'}
              </p>
            </div>
          </div>
        ))}
        {showGithub && (
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              {/* You can use a GitHub icon here if you have one, or just text */}
              <span className="h-5 w-5 text-gray-600">🐙</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700">GitHub</p>
              <p className="text-sm text-green-600">Found</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};