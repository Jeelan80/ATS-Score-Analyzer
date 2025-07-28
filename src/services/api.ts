import { AnalysisResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function analyzeResume(
  resumeText: string,
  jobDescriptionText: string,
  extractedLinkedin?: string,
  extractedEmail?: string,
  extractedGithub?: string
): Promise<AnalysisResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze-resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resumeText: resumeText.trim(),
        jobDescriptionText: jobDescriptionText.trim(),
        ...(extractedLinkedin && { extractedLinkedin }),
        ...(extractedEmail && { extractedEmail }),
        ...(extractedGithub && { extractedGithub }),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    const result = await response.json();
    
    // Validate the response structure
    if (typeof result.matchScore !== 'number' || !result.summary || !result.extractedInfo) {
      throw new Error('Invalid response format from analysis service');
    }

    return result;
  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the analysis service. Please make sure the server is running.');
    }
    
    throw error instanceof Error ? error : new Error('Failed to analyze resume');
  }
}