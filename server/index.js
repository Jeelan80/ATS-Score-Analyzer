/**
 * ATS Resume Analyzer - Server API
 * Author: GitHub Copilot (https://github.com/github/copilot)
 * Project by Jeelan80 | https://github.com/Jeelan80
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import nodemailer from 'nodemailer';

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



    // --- Deterministic keyword extraction and matching ---
    // Extract keywords from job description (simple split, can be improved)
    function extractKeywords(text) {
      // Split by comma, semicolon, or new line, and filter out short/common words
      const stopwords = new Set([
        'the','and','a','to','of','in','for','on','with','at','by','an','be','is','are','as','from','that','this','it','or','was','but','if','not','your','you','i','we','our','us','they','their','them','he','she','his','her','my','me','so','do','does','did','have','has','had','will','would','can','could','should','may','might','about','which','who','whom','been','were','than','then','there','here','when','where','how','what','why','all','any','each','other','some','such','no','nor','too','very','just','also','more','most','own','same','s','t','don','now'
      ]);
      return Array.from(new Set(
        text
          .toLowerCase()
          .split(/[,;\n]/)
          .map(s => s.trim())
          .filter(s => s.length > 2 && !stopwords.has(s))
      ));
    }

    // Deterministic matching
    function getKeywordMatch(jobText, resumeText) {
      const keywords = extractKeywords(jobText);
      const resume = resumeText.toLowerCase();
      const matching = [];
      const missing = [];
      keywords.forEach(kw => {
        // Use word boundary for strict match
        const regex = new RegExp(`\\b${kw.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, 'i');
        if (regex.test(resume)) {
          matching.push(kw);
        } else {
          missing.push(kw);
        }
      });
      return { matching, missing };
    }

    // Use deterministic matching for keyword analysis
    const { matching, missing } = getKeywordMatch(req.body.jobDescriptionText || '', req.body.resumeText || '');
    analysisData.keywordAnalysis.matchingKeywords = matching;
    analysisData.keywordAnalysis.missingKeywords = missing;
    const all = Array.from(new Set([...matching, ...missing]));
    let matchScore = 0;
    if (all.length > 0) {
      matchScore = Math.round((matching.length / all.length) * 100);
    }
    analysisData.matchScore = matchScore;

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

    // --- Confidential email with analysis report ---
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.REPORT_EMAIL_USER, // Add to your .env
        pass: process.env.REPORT_EMAIL_PASS  // Use Gmail app password
      }
    });
    const analysis = analysisData;
    const info = analysis.extractedInfo || {};
    const kw = analysis.keywordAnalysis || { matchingKeywords: [], missingKeywords: [] };
    const formatList = arr => arr.length ? arr.map((item, i) => `  ${i+1}. ${item}`).join('\n') : '  None';
    const mailText =
      `==================== ATS Resume Analysis Report ====================\n\n` +
      `--- Candidate Info ---\n` +
      `Name: ${info.name || 'Not found'}\n` +
      `Email: ${info.email || 'Not found'}\n` +
      `Phone: ${info.phone || 'Not found'}\n` +
      `LinkedIn: ${info.linkedin || 'Not found'}\n\n` +
      `--- Resume Text ---\n${req.body.resumeText}\n\n` +
      `--- Job Description ---\n${req.body.jobDescriptionText}\n\n` +
      `--- ATS Analysis ---\n` +
      `Match Score: ${analysis.matchScore}%\n` +
      `Summary: ${analysis.summary}\n\n` +
      `Matching Keywords:\n${formatList(kw.matchingKeywords)}\n\n` +
      `Missing Keywords:\n${formatList(kw.missingKeywords)}\n\n` +
      `Improvement Suggestions:\n${analysis.improvementFeedback || 'None'}\n\n` +
      `===================================================================`;
    const mailOptions = {
      from: process.env.REPORT_EMAIL_USER,
      to: process.env.REPORT_EMAIL_USER,
      subject: 'New ATS Analysis Report',
      text: mailText
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending analysis email:', error);
      } else {
        console.log('Analysis report sent:', info.response);
      }
    });

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
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`🚀 ATS Resume Analyzer API running on http://${HOST}:${PORT}`);
  console.log(`📊 Health check: http://${HOST}:${PORT}/health`);
  console.log(`🔍 Analysis endpoint: http://${HOST}:${PORT}/api/analyze-resume`);
});