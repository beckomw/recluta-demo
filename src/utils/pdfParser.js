/**
 * PDF Parsing Utilities
 *
 * Functions for extracting text and structured data from PDF resumes.
 * Handles various PDF formats and provides graceful error handling.
 */

import * as pdfjsLib from 'pdfjs-dist';
import { FILE_LIMITS } from '../data/constants';
import { ALL_COMMON_SKILLS, normalizeSkillName } from '../data/skills';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

/**
 * Parsed resume data structure
 * @typedef {Object} ParsedResume
 * @property {string} firstName - Extracted first name
 * @property {string} lastName - Extracted last name
 * @property {string} email - Extracted email address
 * @property {string} zipcode - Extracted US zipcode
 * @property {string} skills - Comma-separated skills string
 * @property {string} rawText - Full extracted text for debugging
 */

/**
 * PDF extraction result
 * @typedef {Object} PdfExtractionResult
 * @property {boolean} success - Whether extraction succeeded
 * @property {string|null} text - Extracted text or null on failure
 * @property {string|null} error - Error message or null on success
 * @property {number} pageCount - Number of pages in the PDF
 */

/**
 * Extracts text content from a PDF file
 *
 * Handles multi-page PDFs and provides graceful error handling for
 * corrupted or password-protected files.
 *
 * @param {File} file - PDF file to extract text from
 * @returns {Promise<PdfExtractionResult>} Extraction result
 *
 * @example
 * const { success, text, error } = await extractTextFromPDF(file);
 * if (success) {
 *   console.log('Extracted:', text);
 * }
 */
export const extractTextFromPDF = async (file) => {
  try {
    // Validate file
    if (!file) {
      return { success: false, text: null, error: 'No file provided', pageCount: 0 };
    }

    if (file.size > FILE_LIMITS.maxPdfSize) {
      return {
        success: false,
        text: null,
        error: `File too large. Maximum size is ${FILE_LIMITS.maxPdfSize / (1024 * 1024)}MB`,
        pageCount: 0,
      };
    }

    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pageCount = pdf.numPages;

    // Check page limit
    if (pageCount > FILE_LIMITS.maxPdfPages) {
      return {
        success: false,
        text: null,
        error: `PDF has too many pages (${pageCount}). Maximum is ${FILE_LIMITS.maxPdfPages} pages.`,
        pageCount,
      };
    }

    // Extract text from all pages
    const textParts = [];
    for (let i = 1; i <= pageCount; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(' ');
      textParts.push(pageText);
    }

    const fullText = textParts.join('\n\n');

    // Check if extraction yielded meaningful content
    if (!fullText || fullText.trim().length < 10) {
      return {
        success: false,
        text: null,
        error: 'Could not extract text from PDF. The file may be image-based or corrupted.',
        pageCount,
      };
    }

    return { success: true, text: fullText, error: null, pageCount };
  } catch (err) {
    // Handle specific PDF.js errors
    if (err.name === 'PasswordException') {
      return {
        success: false,
        text: null,
        error: 'This PDF is password protected. Please provide an unprotected file.',
        pageCount: 0,
      };
    }

    if (err.name === 'InvalidPDFException') {
      return {
        success: false,
        text: null,
        error: 'Invalid PDF file. The file may be corrupted or not a valid PDF.',
        pageCount: 0,
      };
    }

    console.error('PDF parsing error:', err);
    return {
      success: false,
      text: null,
      error: `Failed to parse PDF: ${err.message || 'Unknown error'}`,
      pageCount: 0,
    };
  }
};

/**
 * Parses extracted PDF text to extract structured resume data
 *
 * Uses regex patterns to identify common resume fields:
 * - Names (various formats)
 * - Email addresses
 * - US zipcodes
 * - Skills (from section headers and keyword matching)
 *
 * @param {string} text - Raw text extracted from PDF
 * @returns {ParsedResume} Structured resume data
 *
 * @example
 * const resume = parseResumeText(extractedText);
 * console.log(resume.firstName, resume.lastName, resume.skills);
 */
export const parseResumeText = (text) => {
  if (!text) {
    return createEmptyParsedResume();
  }

  const result = createEmptyParsedResume();
  result.rawText = text;

  // Extract email (most reliable field)
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) {
    result.email = emailMatch[0].toLowerCase();
  }

  // Extract US zipcode (5 digits, optionally followed by -4 digits)
  const zipcodeMatch = text.match(/\b(\d{5})(?:-\d{4})?\b/);
  if (zipcodeMatch) {
    result.zipcode = zipcodeMatch[1];
  }

  // Extract name - try multiple patterns
  result.firstName = extractFirstName(text);
  result.lastName = extractLastName(text, result.firstName);

  // Extract skills
  result.skills = extractSkillsFromResumeText(text);

  return result;
};

/**
 * Attempts to extract first name from resume text
 * @param {string} text - Resume text
 * @returns {string} Extracted first name or empty string
 */
const extractFirstName = (text) => {
  // Common patterns for names at the start of resumes
  const namePatterns = [
    // "First Last" at start of line
    /^([A-Z][a-z]+)\s+[A-Z][a-z]+/m,
    // "FIRST LAST" in all caps
    /^([A-Z]{2,})\s+[A-Z]{2,}/m,
    // Name after "Name:" label
    /Name:\s*([A-Z][a-z]+)/i,
  ];

  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      // Normalize to title case
      return match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
    }
  }

  return '';
};

/**
 * Attempts to extract last name from resume text
 * @param {string} text - Resume text
 * @param {string} firstName - Already extracted first name
 * @returns {string} Extracted last name or empty string
 */
const extractLastName = (text, firstName) => {
  if (!firstName) return '';

  // Look for last name following first name
  const pattern = new RegExp(
    `${firstName}\\s+([A-Z][a-z]+(?:-[A-Z][a-z]+)?)`,
    'i'
  );
  const match = text.match(pattern);

  if (match && match[1]) {
    return match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
  }

  return '';
};

/**
 * Extracts skills from resume text using multiple strategies
 * @param {string} text - Resume text
 * @returns {string} Comma-separated skills string
 */
const extractSkillsFromResumeText = (text) => {
  const foundSkills = new Set();
  const lowerText = text.toLowerCase();

  // Strategy 1: Look for skills section
  const skillsSectionPatterns = [
    /skills?\s*[:\-]\s*([^]*?)(?=experience|education|projects|$)/i,
    /technical\s+skills?\s*[:\-]\s*([^]*?)(?=experience|education|$)/i,
    /core\s+competencies\s*[:\-]\s*([^]*?)(?=experience|education|$)/i,
    /technologies?\s*[:\-]\s*([^]*?)(?=experience|education|$)/i,
  ];

  for (const pattern of skillsSectionPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      // Extract known skills from the section
      ALL_COMMON_SKILLS.forEach((skill) => {
        const skillPattern = new RegExp(
          `\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
          'i'
        );
        if (skillPattern.test(match[1])) {
          foundSkills.add(normalizeSkillName(skill));
        }
      });
    }
  }

  // Strategy 2: Search entire document for known skills
  ALL_COMMON_SKILLS.forEach((skill) => {
    const skillPattern = new RegExp(
      `\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
      'i'
    );
    if (skillPattern.test(lowerText)) {
      foundSkills.add(normalizeSkillName(skill));
    }
  });

  return Array.from(foundSkills).join(', ');
};

/**
 * Creates an empty parsed resume object
 * @returns {ParsedResume} Empty resume object
 */
const createEmptyParsedResume = () => ({
  firstName: '',
  lastName: '',
  email: '',
  zipcode: '',
  skills: '',
  rawText: '',
});

export default extractTextFromPDF;
