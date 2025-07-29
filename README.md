# ATS Resume Analyzer

![MIT License](https://img.shields.io/badge/license-MIT-green)
![Author](https://img.shields.io/badge/author-Jeelan80-blue)
![GitHub Repo](https://img.shields.io/badge/repo-ATS--Score--Analyzer-blue?logo=github)

---

ATS Resume Analyzer is a modern, open-source web application that helps you optimize your resume for Applicant Tracking Systems (ATS) using AI. Upload your resume, paste a job description, and get instant feedback, keyword analysis, and improvement suggestions—all in a beautiful, interactive interface.

## Features

- **PDF Resume Upload**: Drag-and-drop or click to upload your PDF resume. Text is extracted securely in your browser.
- **Job Description Analysis**: Paste any job description to see how well your resume matches.
- **AI-Powered Scoring**: Uses Google Gemini API to analyze and score your resume against the job description.
- **Keyword Analysis**: Instantly see which keywords are present or missing.
- **Contact Extraction**: Automatically extracts your LinkedIn, GitHub, and email from your resume.
- **Improvement Suggestions**: Get actionable feedback to boost your chances.
- **Modern UI**: Responsive, visually engaging, and easy to use on any device.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **PDF Parsing**: PDF.js (client-side)
- **AI Integration**: Google Gemini API
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Google AI Studio account (for Gemini API key)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Jeelan80/ATS-Score-Analyzer.git
   cd ATS-Score-Analyzer
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up env variables with gemini api**
4. **Start the application:**
   ```bash
   npm run dev:full
   ```
   - Or start frontend and backend separately:
     ```bash
     npm run dev:server   # Backend
     npm run dev         # Frontend
     ```

The app will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Usage

1. **Upload Resume**: Drag-and-drop or click to select your PDF resume.
2. **Paste Job Description**: Copy and paste the job description for your target role.
3. **Analyze**: Click "Analyze Resume" to get your match score, keyword analysis, and suggestions.
4. **Review Results**: See your compatibility score, extracted info, keyword matches, and improvement tips.
5. **Start Over**: Use "Start New Analysis" to try again with a different resume or job description.

## Recent Updates

- **Deterministic ATS Score Calculation**: The backend now uses a robust, deterministic algorithm to extract keywords from the job description and match them against the resume. This ensures the ATS match score is always accurate and does not fluctuate due to AI inconsistencies.
- **PDF Download Improvements**: The PDF report generation now handles keywords with special characters correctly, preventing errors and ensuring all analysis sections are included.
- **.env Example**: See below for a sample .env configuration.
---env example is removed due to deployement issue---

## Project Structure

```
├── src/                      # Frontend React app
│   ├── components/           # All UI components
│   │   ├── ActionPanel.tsx
│   │   ├── ErrorDisplay.tsx
│   │   ├── ExtractedInfo.tsx
│   │   ├── Feedback.tsx
│   │   ├── Header.tsx
│   │   ├── InputSection.tsx
│   │   ├── JobDescriptionInput.tsx
│   │   ├── KeywordAnalysis.tsx
│   │   ├── ResultsSection.tsx
│   │   ├── ResumeUploader.tsx
│   │   ├── ScoreCard.tsx
│   │   └── ...
│   ├── services/             # API integration (e.g., api.ts)
│   ├── utils/                # Utility functions (e.g., pdfParser.ts)
│   ├── types/                # TypeScript type definitions
│   ├── App.tsx               # Main application component
│   ├── index.css             # Global styles
│   └── main.tsx              # App entry point
├── server/                   # Backend Express server
│   └── index.js              # Main server file with API endpoints
├── public/                   # Static assets (e.g., Author.jpg)
├── .env                      # Environment variables
├── package.json              # Dependencies and scripts
├── README.md                 # Project documentation
└── ...
```

## API Endpoints

### POST /api/analyze-resume
Analyze a resume against a job description.

**Request Body:**
```json
{
  "resumeText": "string",
  "jobDescriptionText": "string"
}
```
**Response:**
```json
{
  "matchScore": 85,
  "summary": "Strong match with relevant experience",
  "extractedInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0123",
    "linkedin": "linkedin.com/in/johndoe"
  },
  "keywordAnalysis": {
    "matchingKeywords": ["JavaScript", "React", "Node.js"],
    "missingKeywords": ["Python", "AWS", "Docker"]
  },
  "improvementFeedback": "Consider adding more specific examples..."
}
```

## Security
- API keys are stored in environment variables
- PDF parsing is done client-side for privacy
- CORS-enabled API endpoints
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to your branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is open source under the [MIT License](LICENSE).

## Author

[Jeelan80](https://github.com/Jeelan80)  
[LinkedIn](https://www.linkedin.com/in/jeelan80)  
[WhatsApp – Click to Chat](https://wa.me/8197973038)

## Support

If you have questions or issues, please open an issue on GitHub.