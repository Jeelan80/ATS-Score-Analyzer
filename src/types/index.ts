export interface AnalysisResult {
  matchScore: number;
  summary: string;
  extractedInfo: {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    github?: string;
  };
  keywordAnalysis: {
    matchingKeywords: string[];
    missingKeywords: string[];
  };
  improvementFeedback: string;
  resumeText?: string;
}

export interface AnalysisError {
  message: string;
  type: 'upload' | 'api' | 'parsing' | 'validation';
}