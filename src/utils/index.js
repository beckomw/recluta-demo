/**
 * Utilities Index
 *
 * Central export point for all utility functions.
 * Import from here for cleaner imports throughout the app.
 *
 * @example
 * import { extractSkillsFromDescription, validateEmail, compareSkills } from '../utils';
 */

// Skill extraction utilities
export {
  extractSkillsFromDescription,
  extractExperienceRequirements,
  parseSkillsString,
  skillsArrayToString,
  extractAllSkillsAndRequirements,
} from './skillExtractor';

// Skill matching utilities
export {
  compareSkills,
  calculateTopSkills,
} from './skillMatcher';

// Fair chance employer detection
export {
  detectFairChance,
} from './fairChanceDetector';

// Form validation utilities
export {
  validateEmail,
  validateZipcode,
  validateRequired,
  validateSkills,
  validateUrl,
  validateResumeForm,
  validateJobForm,
  validatePdfFile,
  validateImportedData,
} from './validators';

// PDF parsing utilities
export {
  extractTextFromPDF,
  parseResumeText,
} from './pdfParser';
