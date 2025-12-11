/**
 * Data Index
 *
 * Central export point for all data constants and configurations.
 *
 * @example
 * import { ALL_COMMON_SKILLS, JOB_STATUSES, STORAGE_KEYS } from '../data';
 */

// Skills database
export {
  PROGRAMMING_LANGUAGES,
  FRONTEND_SKILLS,
  BACKEND_SKILLS,
  DATABASE_SKILLS,
  CLOUD_DEVOPS_SKILLS,
  TOOLS_AND_CONCEPTS,
  AI_ML_SKILLS,
  MOBILE_SKILLS,
  DATA_SKILLS,
  SOFT_SKILLS,
  ALL_COMMON_SKILLS,
  SKILL_NORMALIZATIONS,
  normalizeSkillName,
} from './skills';

// Fair chance employer indicators
export {
  HIGH_CONFIDENCE_INDUSTRIES,
  MEDIUM_CONFIDENCE_INDUSTRIES,
  FAIR_CHANCE_JOB_TYPES,
  KNOWN_FAIR_CHANCE_EMPLOYERS,
  FAIR_CHANCE_KEYWORDS,
  FAIR_CHANCE_INDICATORS,
} from './fairChanceIndicators';

// Application constants
export {
  JOB_STATUSES,
  NOTE_TEMPLATES,
  APPLICATION_STATUSES,
  MATCH_VERDICTS,
  STORAGE_KEYS,
  CURRENT_DATA_VERSION,
  FILE_LIMITS,
  VALIDATION_PATTERNS,
} from './constants';
