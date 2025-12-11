/**
 * Skill Extraction Utilities
 *
 * Functions for extracting and normalizing skills from text content
 * such as job descriptions and resumes.
 */

import { ALL_COMMON_SKILLS, normalizeSkillName } from '../data/skills';

/**
 * Extracts technical skills from a text description
 *
 * Uses pattern matching against a curated list of common tech skills.
 * Handles variations (e.g., "React.js", "ReactJS", "react") and normalizes output.
 *
 * @param {string} description - Text to extract skills from (job description, resume, etc.)
 * @param {number} minLength - Minimum text length to process (default: 20)
 * @returns {string[]} Array of normalized skill names found in the text
 *
 * @example
 * extractSkillsFromDescription("Looking for React and Node.js developer")
 * // Returns: ['React', 'Node.js']
 */
export const extractSkillsFromDescription = (description, minLength = 20) => {
  if (!description || description.length < minLength) {
    return [];
  }

  const lowerDesc = description.toLowerCase();
  const foundSkills = new Set();

  // Look for exact matches with word boundaries
  ALL_COMMON_SKILLS.forEach((skill) => {
    // Create word boundary pattern, escaping regex special characters
    const pattern = new RegExp(
      `\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
      'i'
    );

    if (pattern.test(lowerDesc)) {
      foundSkills.add(normalizeSkillName(skill));
    }
  });

  return Array.from(foundSkills);
};

/**
 * Extracts experience requirements from job description
 *
 * Looks for patterns like "5+ years experience" or "3 yrs of exp"
 *
 * @param {string} description - Job description text
 * @returns {string[]} Array of experience requirements found
 *
 * @example
 * extractExperienceRequirements("Must have 5+ years of experience in React")
 * // Returns: ['5+ years experience']
 */
export const extractExperienceRequirements = (description) => {
  if (!description) return [];

  const requirements = [];
  const yearsPattern = /(\d+)\+?\s*(?:years?|yrs?)\s+(?:of\s+)?(?:experience|exp)/gi;

  let match;
  while ((match = yearsPattern.exec(description)) !== null) {
    requirements.push(`${match[1]}+ years experience`);
  }

  return requirements;
};

/**
 * Parses a comma-separated skills string into a normalized array
 *
 * @param {string} skillsString - Comma-separated skills
 * @returns {string[]} Array of trimmed, non-empty skills
 *
 * @example
 * parseSkillsString("  React, Node.js,  , Python  ")
 * // Returns: ['React', 'Node.js', 'Python']
 */
export const parseSkillsString = (skillsString) => {
  if (!skillsString) return [];

  return skillsString
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
};

/**
 * Converts skills array back to comma-separated string
 *
 * @param {string[]} skillsArray - Array of skills
 * @returns {string} Comma-separated skills string
 */
export const skillsArrayToString = (skillsArray) => {
  return skillsArray.join(', ');
};

/**
 * Combines skill extraction from description and requirements into a single list
 *
 * @param {string} description - Job/resume text
 * @returns {string[]} Combined array of skills and experience requirements
 */
export const extractAllSkillsAndRequirements = (description) => {
  const skills = extractSkillsFromDescription(description);
  const experience = extractExperienceRequirements(description);
  return [...skills, ...experience];
};
