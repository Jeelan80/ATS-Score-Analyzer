
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
    const allTextItems: string[] = [];
    let foundLinkedin: string | undefined;
    let foundGithub: string | undefined;
    let foundEmail: string | undefined;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      textContent.items.forEach((item) => {
        if ('str' in item && typeof item.str === 'string') {
          allTextItems.push(item.str);
        }
      });

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
    // Join all text items into a single string, normalize whitespace
    let fullText = allTextItems.join(' ');
    fullText = fullText.replace(/\s+/g, ' ').replace(/\n+/g, ' ').trim();
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

    // Extract all possible gmail addresses, including obfuscated forms
    // 1. Standard gmail (strict: no dots/dashes before @ unless allowed by Gmail)
    const gmailRegex = /\b([a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{0,62}[a-zA-Z0-9])?)@gmail\.com\b/g;
    // 2. Obfuscated: (at), [at], {at}, spaces, etc
    const obfuscatedGmailRegex = /\b([a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{0,62}[a-zA-Z0-9])?)\s*(\(|\[|\{|<)?\s*at\s*(\)|\]|\}|>)?\s*gmail\s*(\.|dot|\s)+\s*com\b/gi;

    let gmailCandidates: string[] = [];
    // Standard
    gmailCandidates.push(...Array.from(fullText.matchAll(gmailRegex)).map(m => m[0]));
    // Obfuscated
    let match;
    while ((match = obfuscatedGmailRegex.exec(fullText)) !== null) {
      // Normalize to standard form
      gmailCandidates.push(match[1] + '@gmail.com');
    }
    // Remove duplicates
    gmailCandidates = Array.from(new Set(gmailCandidates));
    // Filter out artifacts and invalid usernames (no dots/dashes at start/end, no double dots, length 6-30)
    gmailCandidates = gmailCandidates.filter(email => {
      const username = email.split('@')[0];
      return (
        /^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9._%+-]{4,28}[a-zA-Z0-9]$/.test(username) &&
        !/noreply|example|test|your@email|dummy|sample/i.test(email)
      );
    });
    if (gmailCandidates.length > 0) {
      foundEmail = gmailCandidates[0];
    } else {
      // Fallback: any email
      const allEmails = Array.from(fullText.matchAll(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)).map(m => m[0]);
      const filteredEmails = allEmails.filter(email =>
        !/noreply|example|test|your@email|dummy|sample|\[at\]|\(at\)/i.test(email)
      );
      if (filteredEmails.length > 0) {
        foundEmail = filteredEmails[0];
      }
    }

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