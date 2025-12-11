/**
 * Input Validation Utilities
 *
 * Centralized validation functions for forms and data throughout the application.
 * Returns error messages for invalid inputs, or null/undefined for valid inputs.
 */

import { VALIDATION_PATTERNS, FILE_LIMITS } from '../data/constants';

/**
 * Validates an email address
 * @param {string} email - Email to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return 'Email is required';
  }
  if (!VALIDATION_PATTERNS.email.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

/**
 * Validates a US zipcode (supports ZIP and ZIP+4)
 * @param {string} zipcode - Zipcode to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateZipcode = (zipcode) => {
  if (!zipcode || !zipcode.trim()) {
    return 'Zipcode is required';
  }
  if (!VALIDATION_PATTERNS.zipcode.test(zipcode)) {
    return 'Please enter a valid US zipcode (e.g., 12345 or 12345-6789)';
  }
  return null;
};

/**
 * Validates a required text field
 * @param {string} value - Value to validate
 * @param {string} fieldName - Human-readable field name for error message
 * @returns {string|null} Error message or null if valid
 */
export const validateRequired = (value, fieldName) => {
  if (!value || !value.trim()) {
    return `${fieldName} is required`;
  }
  return null;
};

/**
 * Validates a skills string (comma-separated)
 * @param {string} skills - Comma-separated skills string
 * @param {number} minCount - Minimum number of skills required (default: 2)
 * @returns {string|null} Error message or null if valid
 */
export const validateSkills = (skills, minCount = 2) => {
  if (!skills || !skills.trim()) {
    return 'Skills are required for job matching';
  }
  const skillCount = skills.split(',').filter((s) => s.trim()).length;
  if (skillCount < minCount) {
    return `Please enter at least ${minCount} skills separated by commas`;
  }
  return null;
};

/**
 * Validates a URL
 * @param {string} url - URL to validate
 * @param {boolean} required - Whether the field is required
 * @returns {string|null} Error message or null if valid
 */
export const validateUrl = (url, required = false) => {
  if (!url || !url.trim()) {
    return required ? 'URL is required' : null;
  }
  if (!VALIDATION_PATTERNS.url.test(url)) {
    return 'Please enter a valid URL (starting with http:// or https://)';
  }
  return null;
};

/**
 * Validates a resume form object
 * @param {Object} resume - Resume data to validate
 * @returns {Object} Object with field names as keys and error messages as values
 */
export const validateResumeForm = (resume) => {
  const errors = {};

  const firstNameError = validateRequired(resume.firstName, 'First name');
  if (firstNameError) errors.firstName = firstNameError;

  const lastNameError = validateRequired(resume.lastName, 'Last name');
  if (lastNameError) errors.lastName = lastNameError;

  const emailError = validateEmail(resume.email);
  if (emailError) errors.email = emailError;

  const zipcodeError = validateZipcode(resume.zipcode);
  if (zipcodeError) errors.zipcode = zipcodeError;

  const skillsError = validateSkills(resume.skills);
  if (skillsError) errors.skills = skillsError;

  return errors;
};

/**
 * Validates a job form object
 * @param {Object} job - Job data to validate
 * @returns {Object} Object with field names as keys and error messages as values
 */
export const validateJobForm = (job) => {
  const errors = {};

  const titleError = validateRequired(job.title, 'Job title');
  if (titleError) errors.title = titleError;

  const companyError = validateRequired(job.company, 'Company name');
  if (companyError) errors.company = companyError;

  const urlError = validateUrl(job.url, false);
  if (urlError) errors.url = urlError;

  return errors;
};

/**
 * Validates a PDF file before processing
 * @param {File} file - File object to validate
 * @returns {Object} { valid: boolean, error: string|null }
 */
export const validatePdfFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  // Check file type
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return { valid: false, error: 'Please select a PDF file' };
  }

  // Check file size
  if (file.size > FILE_LIMITS.maxPdfSize) {
    const maxSizeMB = FILE_LIMITS.maxPdfSize / (1024 * 1024);
    return {
      valid: false,
      error: `File is too large. Maximum size is ${maxSizeMB}MB`,
    };
  }

  // Check for empty file
  if (file.size === 0) {
    return { valid: false, error: 'The selected file appears to be empty' };
  }

  return { valid: true, error: null };
};

/**
 * Validates imported JSON data structure
 * @param {Object} data - Imported data to validate
 * @returns {Object} { valid: boolean, error: string|null, warnings: string[] }
 */
export const validateImportedData = (data) => {
  const warnings = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid data format', warnings };
  }

  // Check for expected arrays
  if (data.resumes && !Array.isArray(data.resumes)) {
    return { valid: false, error: 'Invalid resumes data format', warnings };
  }
  if (data.jobs && !Array.isArray(data.jobs)) {
    return { valid: false, error: 'Invalid jobs data format', warnings };
  }
  if (data.applications && !Array.isArray(data.applications)) {
    return { valid: false, error: 'Invalid applications data format', warnings };
  }

  // Add warnings for missing data
  if (!data.resumes || data.resumes.length === 0) {
    warnings.push('No resumes found in imported data');
  }
  if (!data.jobs || data.jobs.length === 0) {
    warnings.push('No jobs found in imported data');
  }

  return { valid: true, error: null, warnings };
};
