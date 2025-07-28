import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'ATS Resume Analyzer API is running' });
});

// Resume analysis endpoint
app.post('/api/analyze-resume', async (req, res) => {
  try {
    const { resumeText, jobDescriptionText } = req.body;

    // Validate input
    if (!resumeText?.trim() || !jobDescriptionText?.trim()) {
      return res.status(400).json({ 
        message: 'Both resume text and job description are required' 
      });
    }

    // Initialize Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return res.status(500).json({ 
        message: 'AI service is not properly configured. Please check your API key.' 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use a supported Gemini model name
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    // Construct the prompt with explicit LinkedIn/email extraction instructions
    const prompt = `You are an expert AI-powered Applicant Tracking System (ATS). Your task is to analyze a resume against a job description. Provide your output ONLY in a valid JSON format. Do not include any introductory text or markdown formatting.

The JSON object must have the following structure:
{
  "matchScore": <A number between 0 and 100 representing the match percentage>,
  "summary": "<A one-sentence summary like 'Strong Match' or 'Good Candidate'>",
  "extractedInfo": {
    "name": "<Candidate's full name>",
    "email": "<Candidate's email address>",
    "phone": "<Candidate's phone number>",
    "linkedin": "<Candidate's LinkedIn profile URL, if available>"
  },
  "keywordAnalysis": {
    "matchingKeywords": ["<list of skills found in both resume and JD>"],
    "missingKeywords": ["<list of important skills from JD not found in resume>"]
  },
  "improvementFeedback": "<A paragraph of constructive feedback on how the candidate could improve their resume to better match this specific job description.>"
}

If you find LinkedIn URLs or emails that are split across lines or contain extra spaces, reconstruct them accurately. If a LinkedIn or email is provided below (from PDF extraction), use it as the primary value unless you find a better one in the text.


Extracted from PDF (if available):
LinkedIn: ${req.body.extractedLinkedin || 'N/A'}
GitHub: ${req.body.extractedGithub || 'N/A'}
Email: ${req.body.extractedEmail || 'N/A'}

Here is the resume text:
---
${resumeText}
---

Here is the job description text:
---
${jobDescriptionText}
---`;

    console.log('Making request to Gemini API...');
    
    // Make the API call with timeout
    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 30000)
      )
    ]);

    const response = await result.response;
    const text = response.text();

    console.log('Received response from Gemini API');

    // Parse and validate the JSON response
    let analysisData;
    try {
      // Clean the response text (remove any markdown formatting)
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysisData = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw response:', text);
      return res.status(500).json({ 
        message: 'Failed to process AI response. Please try again.' 
      });
    }

    // Validate the response structure
    if (!analysisData.matchScore || !analysisData.summary || !analysisData.extractedInfo) {
      console.error('Invalid response structure:', analysisData);
      return res.status(500).json({ 
        message: 'Invalid response format from AI service. Please try again.' 
      });
    }

    // Ensure matchScore is within valid range
    analysisData.matchScore = Math.max(0, Math.min(100, Math.round(analysisData.matchScore)));

    // Ensure arrays exist for keyword analysis
    if (!analysisData.keywordAnalysis) {
      analysisData.keywordAnalysis = {
        matchingKeywords: [],
        missingKeywords: []
      };
    }

    // Ensure arrays are actually arrays
    if (!Array.isArray(analysisData.keywordAnalysis.matchingKeywords)) {
      analysisData.keywordAnalysis.matchingKeywords = [];
    }
    if (!Array.isArray(analysisData.keywordAnalysis.missingKeywords)) {
      analysisData.keywordAnalysis.missingKeywords = [];
    }

    // Ensure extracted info has default values
    const defaultInfo = {
      name: 'Not found',
      email: 'Not found',
      phone: 'Not found',
      linkedin: 'Not found'
    };
    analysisData.extractedInfo = { ...defaultInfo, ...analysisData.extractedInfo };

    console.log('Analysis completed successfully');
    res.json(analysisData);

  } catch (error) {
    console.error('Error in analyze-resume endpoint:', error);
    
    if (error.message.includes('timeout')) {
      return res.status(408).json({ 
        message: 'Request timeout. Please try again with a shorter resume or job description.' 
      });
    }
    
    if (error.message.includes('API key')) {
      return res.status(401).json({ 
        message: 'Invalid API key. Please check your Gemini API configuration.' 
      });
    }
    
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ATS Resume Analyzer API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Analysis endpoint: http://localhost:${PORT}/api/analyze-resume`);
});