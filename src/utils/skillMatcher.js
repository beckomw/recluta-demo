/**
 * Skill Matching Algorithm
 *
 * Core matching logic for comparing resume skills against job requirements.
 * Provides match percentage, verdict, and actionable recommendations.
 */

import { MATCH_VERDICTS } from '../data/constants';
import { parseSkillsString } from './skillExtractor';

/**
 * Match analysis result
 * @typedef {Object} MatchAnalysis
 * @property {number} matchPercentage - Percentage of job requirements matched (0-100)
 * @property {string} verdict - Human-readable verdict (e.g., "YES, APPLY!")
 * @property {string} verdictType - Machine-readable verdict type (yes/maybe/stretch/no)
 * @property {string} message - Short status message
 * @property {string} recommendation - Detailed recommendation
 * @property {string[]} matchingSkills - Skills that match between resume and job
 * @property {string[]} missingSkills - Job requirements not found in resume
 * @property {Object[]} prioritizedMissingSkills - Missing skills sorted by demand
 * @property {string[]} actionItems - Specific action items for the candidate
 */

/**
 * Compares resume skills against job requirements
 *
 * Uses fuzzy substring matching to handle variations in skill naming.
 * For example, "javascript" matches "JavaScript" and "React.js" matches "react".
 *
 * @param {string} resumeSkills - Comma-separated resume skills
 * @param {string} jobRequirements - Comma-separated job requirements
 * @param {Object[]} [allJobs=[]] - All jobs for skill demand calculation
 * @returns {MatchAnalysis} Detailed match analysis
 *
 * @example
 * compareSkills("React, Node.js, Python", "react, python, aws", [])
 * // Returns match analysis with 66% match
 */
export const compareSkills = (resumeSkills, jobRequirements, allJobs = []) => {
  // Parse skills into normalized arrays
  const resumeSkillsArray = parseSkillsString(resumeSkills).map((s) =>
    s.toLowerCase()
  );
  const jobRequirementsArray = parseSkillsString(jobRequirements).map((s) =>
    s.toLowerCase()
  );

  // Handle edge case: no requirements
  if (jobRequirementsArray.length === 0) {
    return createEmptyMatchResult();
  }

  // Find matching skills using fuzzy substring matching
  const matchingSkills = resumeSkillsArray.filter((skill) =>
    jobRequirementsArray.some(
      (req) => req.includes(skill) || skill.includes(req)
    )
  );

  // Find missing skills
  const missingSkills = jobRequirementsArray.filter(
    (req) =>
      !resumeSkillsArray.some(
        (skill) => req.includes(skill) || skill.includes(req)
      )
  );

  // Calculate match percentage
  const matchPercentage = Math.round(
    (matchingSkills.length / jobRequirementsArray.length) * 100
  );

  // Calculate skill demand across all jobs for prioritization
  const skillDemand = calculateSkillDemand(allJobs);

  // Prioritize missing skills by demand
  const prioritizedMissingSkills = missingSkills
    .map((skill) => ({
      skill,
      demand: skillDemand[skill] || 0,
      isHot: (skillDemand[skill] || 0) >= 2, // Appears in 2+ jobs
    }))
    .sort((a, b) => b.demand - a.demand);

  // Generate verdict and recommendations
  const { verdict, verdictType, message, recommendation, actionItems } =
    generateVerdict(matchPercentage, matchingSkills, prioritizedMissingSkills);

  return {
    matchPercentage,
    verdict,
    verdictType,
    message,
    recommendation,
    matchingSkills,
    missingSkills,
    prioritizedMissingSkills,
    actionItems,
  };
};

/**
 * Calculates skill demand across all jobs
 * @param {Object[]} jobs - Array of job objects
 * @returns {Object} Map of skill names to occurrence counts
 */
const calculateSkillDemand = (jobs) => {
  if (!jobs || jobs.length === 0) return {};

  const allSkills = jobs.flatMap((job) =>
    parseSkillsString(job.requirements || '').map((s) => s.toLowerCase())
  );

  return allSkills.reduce((acc, skill) => {
    acc[skill] = (acc[skill] || 0) + 1;
    return acc;
  }, {});
};

/**
 * Generates verdict, message, and recommendations based on match percentage
 * @param {number} matchPercentage - Match percentage (0-100)
 * @param {string[]} matchingSkills - Matched skills
 * @param {Object[]} prioritizedMissingSkills - Missing skills with demand info
 * @returns {Object} Verdict details and action items
 */
const generateVerdict = (
  matchPercentage,
  matchingSkills,
  prioritizedMissingSkills
) => {
  const topMissing = prioritizedMissingSkills.slice(0, 3).map((s) => s.skill);

  if (matchPercentage >= MATCH_VERDICTS.excellent.minPercent) {
    return {
      verdict: MATCH_VERDICTS.excellent.verdict,
      verdictType: MATCH_VERDICTS.excellent.type,
      message: MATCH_VERDICTS.excellent.message,
      recommendation:
        'Your skills align well with this role. Apply with confidence!',
      actionItems: [
        'Tailor your resume to highlight matching skills',
        'Prepare examples of your experience with these technologies',
        prioritizedMissingSkills.length > 0
          ? `Mention willingness to learn: ${topMissing.slice(0, 2).join(', ')}`
          : null,
      ].filter(Boolean),
    };
  }

  if (matchPercentage >= MATCH_VERDICTS.good.minPercent) {
    return {
      verdict: MATCH_VERDICTS.good.verdict,
      verdictType: MATCH_VERDICTS.good.type,
      message: MATCH_VERDICTS.good.message,
      recommendation:
        'You have a solid foundation. Worth applying if you can demonstrate quick learning.',
      actionItems: [
        'Highlight transferable skills and quick learning ability',
        `Priority skills to learn: ${topMissing.join(', ')}`,
        'Consider taking a quick online course on the missing skills',
      ],
    };
  }

  if (matchPercentage >= MATCH_VERDICTS.stretch.minPercent) {
    return {
      verdict: MATCH_VERDICTS.stretch.verdict,
      verdictType: MATCH_VERDICTS.stretch.type,
      message: MATCH_VERDICTS.stretch.message,
      recommendation:
        'This is a stretch role. Consider upskilling before applying.',
      actionItems: [
        `Focus on learning: ${topMissing.join(', ')}`,
        'Look for entry-level positions in this area',
        'Build projects to demonstrate your ability to learn these skills',
      ],
    };
  }

  return {
    verdict: MATCH_VERDICTS.low.verdict,
    verdictType: MATCH_VERDICTS.low.type,
    message: MATCH_VERDICTS.low.message,
    recommendation:
      'Significant skill gap detected. Focus on building foundational skills.',
    actionItems: [
      `Core skills to develop: ${topMissing.join(', ')}`,
      'Consider a bootcamp or structured learning program',
      'Save this job as a future goal and track your progress',
    ],
  };
};

/**
 * Creates an empty match result for edge cases
 * @returns {MatchAnalysis} Empty match analysis
 */
const createEmptyMatchResult = () => ({
  matchPercentage: 0,
  verdict: 'N/A',
  verdictType: 'no',
  message: 'No requirements to compare',
  recommendation: 'This job has no listed requirements.',
  matchingSkills: [],
  missingSkills: [],
  prioritizedMissingSkills: [],
  actionItems: [],
});

/**
 * Calculates top trending skills across all jobs
 * @param {Object[]} jobs - Array of job objects
 * @param {number} limit - Maximum number of skills to return
 * @returns {Array<[string, number]>} Array of [skill, count] tuples
 */
export const calculateTopSkills = (jobs, limit = 5) => {
  if (!jobs || jobs.length === 0) return [];

  const skillDemand = calculateSkillDemand(jobs);
  return Object.entries(skillDemand)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
};

export default compareSkills;
