/**
 * ATS Resume Analyzer - Server API
 * Author: GitHub Copilot (https://github.com/github/copilot)
 * Project by Jeelan80 | https://github.com/Jeelan80
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
// ...existing code...

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
    const { resumeText, jobDescriptionText, extractedLinkedin, extractedGithub, extractedEmail } = req.body;

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

    // --- Enhanced Gemini Prompt for Professional ATS Analysis ---
    const prompt = `You are a highly sophisticated, industry-leading Applicant Tracking System (ATS) model, designed by top recruitment specialists. Your analysis goes far beyond simple keyword matching. You must evaluate a candidate's resume against a job description by understanding context, inferring proficiency, and weighting skills based on their relevance.\n\nYour final output MUST be a single, valid JSON object and nothing else. Do not include any text before or after the JSON.\n\nThe JSON object must have the following top-level structure: { \"matchScore\": ..., \"summary\": ..., \"extractedInfo\": ..., \"keywordAnalysis\": ..., \"improvementFeedback\": ... }\n\nHere is the detailed logic you must follow to generate the value for each key:\n\n1. matchScore (Number):\nCalculate this score as a weighted average of the following factors. Do not simply guess.\n\nHard Skills Match (60% weight): How many of the required technical skills, tools, and platforms from the job description are present in the resume?\n\nExperience Relevance (30% weight): Does the candidate's project or work experience (e.g., IoT, Healthcare Chatbot) align with the role described in the job description? Analyze the substance of the projects, not just their titles.\n\nEducation & Certifications (10% weight): Does the candidate's educational background and certifications (like Ideathon Winner) align with the role?\n\n2. summary (String):\nProvide a concise, professional one-sentence summary of the candidate's fit. Example: \"A strong candidate with excellent alignment on core Python skills, but lacks the specified professional cloud and database experience.\"\n\n3. extractedInfo (Object):\nExtract the candidate's contact information as specified: { \"name\": \"...\", \"email\": \"...\", \"phone\": \"...\", \"linkedin\": \"...\" }.\n\n4. keywordAnalysis (Object):\nThis is the most critical section. Structure your analysis into the following nested objects. This provides a much deeper analysis than a simple list.\n\nhardSkills: An object containing two arrays:\nmatched: A list of essential technical skills (languages, frameworks, tools, platforms) mentioned in both the job description and the resume.\nmissing: A list of essential technical skills required by the job description but not found in the resume.\n\nsoftSkills: An object containing two arrays:\nmatched: A list of soft skills (e.g., \"Team Player\", \"Problem-Solving\", \"Communication\") found in both documents.\nmissing: A list of soft skills mentioned in the job description but not found in the resume.\n\nsemanticMatches: An array of objects demonstrating your contextual understanding. Identify concepts in the job description and find evidence in the resume, even if the exact words are not used. The format should be { \"jdRequirement\": \"...\", \"resumeEvidence\": \"...\" }.\n\nExample: { \"jdRequirement\": \"Experience with data visualization\", \"resumeEvidence\": \"Designed a web application to display user statistics and provide actionable insights.\" }\n\nproficiencyInference: An array of objects where you infer the candidate's proficiency level in key skills based on the language used in the resume. Use levels like \"Expert\", \"Proficient\", or \"Familiar\".\n\nExample: { \"skill\": \"IoT Development\", \"level\": \"Proficient\", \"evidence\": \"PROJECT LEAD... Developed an IoT-based solution\" }\n\n5. improvementFeedback (String):\nProvide a multi-point, actionable paragraph of feedback for the candidate. The advice should be specific and directly related to the missing skills and gaps identified in the analysis. Example: \"To better align with this role, consider: 1. Gaining hands-on experience with a major cloud platform like AWS or GCP. 2. Highlighting any SQL or NoSQL database experience, as this was a key requirement. 3. Quantifying achievements in your projects with metrics...\"\n\nResume Text:\n\n${resumeText}\nJob Description Text:\n\n${jobDescriptionText}`;

    console.log('Making request to Gemini API with enhanced ATS prompt...');
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

    // Validate the response structure (top-level keys)
    const requiredKeys = ['matchScore', 'summary', 'extractedInfo', 'keywordAnalysis', 'improvementFeedback'];
    const missingKeys = requiredKeys.filter(key => !(key in analysisData));
    if (missingKeys.length > 0) {
      console.error('Invalid response structure, missing keys:', missingKeys);
      return res.status(500).json({ 
        message: 'Invalid response format from AI service. Please try again.' 
      });
    }

    // Optionally, patch in extractedLinkedin, extractedGithub, extractedEmail if Gemini missed them
    if (extractedLinkedin && (!analysisData.extractedInfo.linkedin || analysisData.extractedInfo.linkedin === 'N/A')) {
      analysisData.extractedInfo.linkedin = extractedLinkedin;
    }
    if (extractedEmail && (!analysisData.extractedInfo.email || analysisData.extractedInfo.email === 'N/A')) {
      analysisData.extractedInfo.email = extractedEmail;
    }
    // (Github is not in the required structure, but you could add it if needed)

    // --- Deterministic keyword extraction and matching ---
    // Extract keywords from job description (split by comma, semicolon, or new line, filter out stopwords)
    function extractKeywords(text) {
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
      // Normalize resume text: lowercase, replace punctuation with spaces, collapse whitespace
      // Normalize resume: lowercase, collapse whitespace, but keep special chars for keywords like C++
      let resumeNorm = resumeText.toLowerCase().replace(/\s+/g, ' ').trim();
      const matching = [];
      const missing = [];
      keywords.forEach(kw => {
        // Normalize keyword: lowercase, collapse whitespace
        let normKw = kw.toLowerCase().replace(/\s+/g, ' ').trim();
        // Escape regex special chars in keyword (so c++ matches literally)
        const pattern = normKw.split(' ').map(w => w.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")).join('\\s+');
        // Match keyword as a whole word or phrase, case-insensitive
        const regex = new RegExp(`(^|[^a-z0-9])${pattern}([^a-z0-9]|$)`, 'i');
        if (regex.test(resumeNorm)) {
          matching.push(kw);
        } else {
          missing.push(kw);
        }
      });
      return { matching, missing };
    }

    // Use deterministic matching for keyword analysis
    const { matching, missing } = getKeywordMatch(req.body.jobDescriptionText || '', req.body.resumeText || '');
    if (!analysisData.keywordAnalysis) analysisData.keywordAnalysis = {};
    analysisData.keywordAnalysis.matchingKeywords = matching;
    analysisData.keywordAnalysis.missingKeywords = missing;

    return res.json(analysisData);
  } catch (err) {
    console.error('Error in /api/analyze-resume:', err);
    return res.status(500).json({ message: 'Internal server error.' });
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