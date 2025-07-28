import React, { useRef, useState, useCallback } from 'react';
// Make sure the file exists at ./components/Navbar.tsx or ./components/Navbar/index.tsx
import { Navbar } from './components/Navbar';
import { InputSection } from './components/InputSection';
import { ActionPanel } from './components/ActionPanel';
import { ResultsSection } from './components/ResultsSection';
import { ErrorDisplay } from './components/ErrorDisplay';
import { extractTextFromPDF } from './utils/pdfParser';
import { analyzeResume } from './services/api';
import { AnalysisResult, AnalysisError } from './types';
import { RotateCcw } from 'lucide-react';

function App() {
  // No need for cursor state, just update CSS variable
  const containerRef = useRef<HTMLDivElement>(null);

  // Neon cursor effect handler for fixed glow
  const glowRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect && glowRef.current) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glowRef.current.style.transform = `translate(${x - 260}px, ${y - 260}px)`;
      glowRef.current.style.opacity = '1';
    }
  };
  const handleMouseLeave = () => {
    if (glowRef.current) {
      glowRef.current.style.opacity = '0';
    }
  };
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [extractedLinks, setExtractedLinks] = useState<{ linkedin?: string; github?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AnalysisError | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setError(null);
  }, []);

  const handleClearFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
  }, []);

  const handleJobDescriptionChange = useCallback((value: string) => {
    setJobDescription(value);
    setError(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile || !jobDescription.trim()) {
      setError({
        message: 'Please upload a resume and provide a job description',
        type: 'validation'
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Extract text and info from PDF
      const resumeInfo = await extractTextFromPDF(selectedFile);
      if (!resumeInfo.text.trim()) {
        throw new Error('Could not extract text from the PDF. Please ensure the PDF contains readable text.');
      }

      // Show extracted links in UI for user verification
      setExtractedLinks({
        linkedin: resumeInfo.linkedin,
        github: resumeInfo.github,
        email: resumeInfo.email,
      });

      // Analyze with AI, passing extracted LinkedIn/email if available
      const analysisResult = await analyzeResume(
        resumeInfo.text,
        jobDescription,
        resumeInfo.linkedin,
        resumeInfo.email,
        resumeInfo.github
      );
      // Merge extracted links into results if AI result is missing them
      const mergedResult = {
        ...analysisResult,
        extractedInfo: {
          ...analysisResult.extractedInfo,
          linkedin: analysisResult.extractedInfo.linkedin && analysisResult.extractedInfo.linkedin !== 'Not found'
            ? analysisResult.extractedInfo.linkedin
            : resumeInfo.linkedin || 'Not found',
          email: analysisResult.extractedInfo.email && analysisResult.extractedInfo.email !== 'Not found'
            ? analysisResult.extractedInfo.email
            : resumeInfo.email || 'Not found',
          github: analysisResult.extractedInfo.github && analysisResult.extractedInfo.github !== 'Not found'
            ? analysisResult.extractedInfo.github
            : resumeInfo.github || undefined,
        },
        resumeText: resumeInfo.text,
      };
      setResults(mergedResult);
      setExtractedLinks(null); // Hide after analysis
    } catch (err) {
      console.error('Analysis error:', err);
      setError({
        message: err instanceof Error ? err.message : 'An unexpected error occurred',
        type: err instanceof Error && err.message.includes('PDF') ? 'parsing' : 'api'
      });
    } finally {
      setLoading(false);
    }
  }, [selectedFile, jobDescription]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setJobDescription('');
    setResults(null);
    setError(null);
    setExtractedLinks(null);
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    if (results) {
      setResults(null);
    }
  }, [results]);

  const isAnalyzeDisabled = !selectedFile || !jobDescription.trim() || loading;

  return (
    <>
      <div
        ref={containerRef}
        className="min-h-screen relative bg-black overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Animated grid background (z-0, behind content but inside main container) */}
        <div className="absolute inset-0 z-0 pointer-events-none animate-stars" />
        {/* Fixed neon glow that follows the cursor */}
        <div
          ref={glowRef}
          className="pointer-events-none neon-cursor-fixed-glow"
        />
        {/* Navbar always on top */}
        <Navbar />
        {/* Add top padding to prevent overlap with fixed navbar */}
        <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28">
          {!results && !error && (
            <>
              <div className="text-center mb-12">
                <h2 className="text-5xl font-extrabold mb-4 text-gray-100 ">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400">Optimize Your Resume for ATS</span>
                </h2>
                <p className="text-xl text-gray-200 max-w-3xl mx-auto neon-subtext">
                  Upload your resume and paste a job description to get instant <span className="text-pink-400">AI-powered</span> analysis<br />
                  with <span className="text-cyan-400">keyword matching</span>, <span className="text-purple-400">score assessment</span>, and <span className="text-pink-400">improvement suggestions</span>.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-900/60 via-black/80 to-cyan-900/60 rounded-2xl p-8 shadow-2xl neon-panel mb-10">
                <InputSection
                  selectedFile={selectedFile}
                  onFileSelect={handleFileSelect}
                  onClearFile={handleClearFile}
                  jobDescription={jobDescription}
                  onJobDescriptionChange={handleJobDescriptionChange}
                  disabled={loading}
                />
                <ActionPanel
                  onAnalyze={handleAnalyze}
                  disabled={isAnalyzeDisabled}
                  loading={loading}
                />
                {extractedLinks && (
                  <div className="mt-6 p-4 rounded-lg bg-gray-900/80 border border-cyan-500 text-cyan-200">
                    <div className="font-semibold mb-2">Extracted from Resume:</div>
                    <div className="space-y-1 text-sm">
                      <div>LinkedIn: {extractedLinks.linkedin ? <span className="text-green-400">Found</span> : <span className="text-pink-400">Not found</span>}</div>
                      {extractedLinks.github && (
                        <div>GitHub: <span className="text-green-400">Found</span></div>
                      )}
                      <div>Email: {extractedLinks.email ? <span className="text-green-400">Found</span> : <span className="text-pink-400">Not found</span>}</div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          {error && (
            <div className="bg-gradient-to-br from-pink-900/60 via-black/80 to-cyan-900/60 rounded-2xl p-8 shadow-2xl neon-panel mb-10">
              <ErrorDisplay error={error} onRetry={handleRetry} />
            </div>
          )}
          {results && !error && (
            <>
              <ResultsSection results={results} />
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleReset}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg neon-btn hover:from-pink-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 transition-all duration-200"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Start New Analysis</span>
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default App;