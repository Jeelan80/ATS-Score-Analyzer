
import * as pdfjsLib from 'pdfjs-dist';
// Configure PDF.js worker to use the available minified ES module worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export interface PDFExtractedInfo {
  text: string;
  linkedin?: string;
  github?: string;
  email?: string;
}

export async function extractTextFromPDF(file: File): Promise<PDFExtractedInfo> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const lines: string[] = [];
    let foundLinkedin: string | undefined;
    let foundGithub: string | undefined;
    let foundEmail: string | undefined;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      // Join text items for each line, preserving line breaks
      let line = '';
      textContent.items.forEach((item) => {
        if ('str' in item && typeof item.str === 'string') {
          line += item.str;
        }
      });
      if (line.trim()) lines.push(line.trim());

      // --- Extract hyperlinks from annotations ---
      const annotations = await page.getAnnotations();
      for (const annot of annotations) {
        if (annot.url) {
          if (!foundLinkedin && /linkedin\.com/i.test(annot.url)) {
            foundLinkedin = annot.url;
          }
          if (!foundGithub && /github\.com/i.test(annot.url)) {
            foundGithub = annot.url;
          }
        }
      }
    }
    const fullText = lines.join('\n');
    // Regex for LinkedIn, GitHub, and email in visible text (fallback)
    if (!foundLinkedin) {
      // Try full LinkedIn URL
      const linkedinMatch = fullText.match(/https?:\/\/(www\.)?linkedin\.com\/[a-zA-Z0-9_\-/.?=&#%]+/i);
      if (linkedinMatch) {
        foundLinkedin = linkedinMatch[0];
      } else {
        // Try LinkedIn username (e.g., jeelan-basha-508a19314)
        // Look for common LinkedIn username patterns (after 'linkedin:' or 'LinkedIn:')
        const usernameMatch = fullText.match(/linkedin\s*[:-]?\s*([a-zA-Z0-9-_.]+)/i);
        if (usernameMatch && usernameMatch[1]) {
          foundLinkedin = `https://www.linkedin.com/in/${usernameMatch[1]}`;
        }
      }
    }
    if (!foundGithub) {
      // Try full GitHub URL
      const githubMatch = fullText.match(/https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_\-/.?=&#%]+/i);
      if (githubMatch) {
        foundGithub = githubMatch[0];
      } else {
        // Try GitHub username (e.g., github: Jeelan80)
        const usernameMatch = fullText.match(/github\s*[:-]?\s*([a-zA-Z0-9-_.]+)/i);
        if (usernameMatch && usernameMatch[1]) {
          foundGithub = `https://github.com/${usernameMatch[1]}`;
        }
      }
    }
    const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) foundEmail = emailMatch[0];

    return {
      text: fullText.trim(),
      linkedin: foundLinkedin,
      github: foundGithub,
      email: foundEmail,
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file. Please ensure it\'s a valid PDF document.');
  }
}