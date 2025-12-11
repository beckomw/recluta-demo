/**
 * Fair Chance Employer Detection
 *
 * Utilities for automatically detecting whether a job posting
 * is from a fair chance employer (willing to hire candidates
 * with criminal records).
 */

import {
  HIGH_CONFIDENCE_INDUSTRIES,
  MEDIUM_CONFIDENCE_INDUSTRIES,
  FAIR_CHANCE_JOB_TYPES,
  KNOWN_FAIR_CHANCE_EMPLOYERS,
  FAIR_CHANCE_KEYWORDS,
} from '../data/fairChanceIndicators';

/**
 * Detection result object
 * @typedef {Object} FairChanceDetectionResult
 * @property {boolean} likely - Whether the job is likely fair chance
 * @property {'high'|'medium'|null} confidence - Confidence level of detection
 * @property {string|null} reason - Human-readable explanation for the detection
 */

/**
 * Detects if a job posting is likely from a fair chance employer
 *
 * Checks multiple indicators in order of confidence:
 * 1. Explicit fair chance keywords (highest confidence)
 * 2. Known fair chance employers
 * 3. High-confidence industries
 * 4. Fair chance friendly job types
 * 5. Medium-confidence industries
 *
 * @param {Object} job - Job object to analyze
 * @param {string} job.title - Job title
 * @param {string} job.company - Company name
 * @param {string} [job.description] - Job description
 * @returns {FairChanceDetectionResult} Detection result with confidence and reason
 *
 * @example
 * detectFairChance({ title: 'Warehouse Worker', company: 'Amazon', description: '' })
 * // Returns: { likely: true, confidence: 'high', reason: 'Amazon is a known Fair Chance employer' }
 */
export const detectFairChance = (job) => {
  const searchText = `${job.title} ${job.company} ${job.description || ''}`.toLowerCase();

  // Check for explicit Fair Chance keywords - highest confidence
  const matchedKeyword = FAIR_CHANCE_KEYWORDS.find((kw) =>
    searchText.includes(kw)
  );
  if (matchedKeyword) {
    return {
      likely: true,
      confidence: 'high',
      reason: `Detected: "${matchedKeyword}" in job posting`,
    };
  }

  // Check for known Fair Chance employers - high confidence
  const matchedEmployer = KNOWN_FAIR_CHANCE_EMPLOYERS.find((emp) =>
    searchText.includes(emp.toLowerCase())
  );
  if (matchedEmployer) {
    return {
      likely: true,
      confidence: 'high',
      reason: `${capitalize(matchedEmployer)} is a known Fair Chance employer`,
    };
  }

  // Check for high confidence industries
  const matchedHighIndustry = HIGH_CONFIDENCE_INDUSTRIES.find((ind) =>
    searchText.includes(ind.toLowerCase())
  );
  if (matchedHighIndustry) {
    return {
      likely: true,
      confidence: 'high',
      reason: `${capitalize(matchedHighIndustry)} - industry known for fair chance hiring`,
    };
  }

  // Check for fair chance friendly job types
  const matchedJobType = FAIR_CHANCE_JOB_TYPES.find((jt) =>
    searchText.includes(jt.toLowerCase())
  );
  if (matchedJobType) {
    return {
      likely: true,
      confidence: 'high',
      reason: `${capitalize(matchedJobType)} positions are typically fair chance friendly`,
    };
  }

  // Check for medium confidence industries
  const matchedMediumIndustry = MEDIUM_CONFIDENCE_INDUSTRIES.find((ind) =>
    searchText.includes(ind.toLowerCase())
  );
  if (matchedMediumIndustry) {
    return {
      likely: true,
      confidence: 'medium',
      reason: `${capitalize(matchedMediumIndustry)} - often fair chance friendly`,
    };
  }

  return { likely: false, confidence: null, reason: null };
};

/**
 * Capitalizes the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default detectFairChance;
