# ATS Resume Analyzer

A modern, full-stack web application that analyzes resumes against job descriptions using AI to help candidates optimize their applications for Applicant Tracking Systems (ATS).

## Features

- **PDF Resume Upload**: Drag-and-drop or click to upload PDF resumes with client-side text extraction
- **Job Description Analysis**: Paste job descriptions for comprehensive matching analysis
- **AI-Powered Analysis**: Uses Google Gemini API for intelligent resume evaluation
- **Match Scoring**: Get percentage-based compatibility scores with visual indicators
- **Keyword Analysis**: Identify matching and missing keywords between resume and job description
- **Contact Extraction**: Automatically extract candidate information from resumes
- **Improvement Suggestions**: Receive personalized feedback to optimize your resume
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + Node.js
- **Styling**: Tailwind CSS
- **PDF Processing**: PDF.js (client-side)
- **AI Integration**: Google Gemini API
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google AI Studio account (for Gemini API key)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ats-resume-analyzer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Get your Google Gemini API key:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key to your `.env` file

5. Configure your environment variables in `.env`:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
VITE_API_URL=http://localhost:3001
PORT=3001
```

6. Start the application:
```bash
# Start both frontend and backend
npm run dev:full

# Or start them separately:
# Terminal 1 - Backend server
npm run dev:server

# Terminal 2 - Frontend development server
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## API Setup

### Google Gemini API

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the key to your `.env` file as `GEMINI_API_KEY`

## Project Structure

```
├── src/                    # Frontend React application
│   ├── components/         # React components
│   │   ├── Header.tsx     # Application header
│   │   ├── InputSection.tsx # File upload and job description input
│   │   ├── ActionPanel.tsx # Analysis trigger button
│   │   ├── ResultsSection.tsx # Analysis results display
│   │   └── ...
│   ├── services/          # API integration
│   ├── utils/             # Utility functions (PDF parsing)
│   ├── types/             # TypeScript type definitions
│   └── App.tsx           # Main application component
├── server/                # Backend Express server
│   └── index.js          # Main server file with API endpoints
├── .env                  # Environment variables
└── package.json          # Dependencies and scripts
```

## Usage

1. **Start the Application**: Run `npm run dev:full` to start both frontend and backend
2. **Upload Resume**: Click the upload area or drag-and-drop a PDF resume
3. **Add Job Description**: Paste the complete job description in the text area
4. **Analyze**: Click the "Analyze Resume" button to start the AI analysis
5. **Review Results**: View your match score, extracted information, keyword analysis, and improvement suggestions
6. **Start Over**: Use the "Start New Analysis" button for additional analyses

## API Endpoints

### POST /api/analyze-resume

Analyzes a resume against a job description.

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

## Security Features

- API keys are stored securely in environment variables
- Client-side PDF processing (no files sent to servers)
- CORS-enabled API endpoints
- Input validation and sanitization
- Request timeout protection

## Development

### Available Scripts

- `npm run dev` - Start frontend development server
- `npm run dev:server` - Start backend server
- `npm run dev:full` - Start both frontend and backend concurrently
- `npm run build` - Build frontend for production
- `npm run lint` - Run ESLint

### Environment Variables

- `GEMINI_API_KEY` - Your Google Gemini API key (required)
- `VITE_API_URL` - Backend API URL (default: http://localhost:3001)
- `PORT` - Backend server port (default: 3001)

## Troubleshooting

### Common Issues

1. **"Unable to connect to the analysis service"**
   - Make sure the backend server is running (`npm run dev:server`)
   - Check that the `VITE_API_URL` in your `.env` file is correct

2. **"AI service is not properly configured"**
   - Verify your `GEMINI_API_KEY` is set in the `.env` file
   - Make sure the API key is valid and has the necessary permissions

3. **PDF parsing errors**
   - Ensure the uploaded file is a valid PDF
   - Try with a different PDF file
   - Check browser console for detailed error messages

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue on GitHub.