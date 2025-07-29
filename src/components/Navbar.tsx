import React from 'react';

export const Navbar: React.FC = () => (
  <nav
    className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur navbar-blur border-b border-gray-200 shadow-sm flex items-center justify-between px-8 py-3 animate-navbar-fade-in"
  >
    <div className="flex items-center space-x-3">
      {/* Static document-text icon for resume look */}
      <span className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-blue-600 shadow-lg">
        {/* Document-text icon (heroicons outline) */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10M7 11h10M7 15h6M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5z" />
        </svg>
      </span>
      <span className="text-2xl font-bold text-gray-900 tracking-tight">ATS Resume Analyzer</span>
    </div>
    <a
      href="https://github.com/Jeelan80/ATS-Score-Analyzer"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-2 text-cyan-700 hover:text-cyan-900 font-medium group transition-colors duration-200"
    >
      {/* Animated GitHub icon */}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-300 group-hover:scale-110 animate-navbar-github-bounce" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.254-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.396.1 2.65.64.7 1.028 1.594 1.028 2.687 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.578.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
      </svg>
      <span className="animate-navbar-link-fade">Open Source</span>
    </a>
  </nav>
);
