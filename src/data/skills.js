/**
 * Common Technical Skills Database
 *
 * This module contains curated lists of technical skills used for:
 * - Auto-extraction from job descriptions
 * - Resume skill parsing
 * - Matching algorithm
 *
 * Skills are categorized for easier maintenance and grouped by domain.
 */

/**
 * Programming languages commonly found in job postings
 */
export const PROGRAMMING_LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'golang',
  'rust', 'php', 'swift', 'kotlin', 'scala', 'r'
];

/**
 * Frontend frameworks and libraries
 */
export const FRONTEND_SKILLS = [
  'react', 'reactjs', 'react.js', 'angular', 'angularjs', 'vue', 'vuejs', 'vue.js',
  'svelte', 'next.js', 'nextjs', 'nuxt', 'gatsby',
  'html', 'css', 'sass', 'scss', 'less', 'tailwind', 'tailwindcss', 'bootstrap',
  'material-ui', 'mui', 'styled-components'
];

/**
 * Backend frameworks and technologies
 */
export const BACKEND_SKILLS = [
  'node', 'nodejs', 'node.js', 'express', 'expressjs', 'fastify', 'nest', 'nestjs',
  'django', 'flask', 'fastapi', 'spring', 'spring boot',
  'rails', 'ruby on rails', 'laravel', '.net', 'asp.net'
];

/**
 * Database technologies
 */
export const DATABASE_SKILLS = [
  'sql', 'mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'elasticsearch',
  'dynamodb', 'firebase', 'supabase', 'sqlite', 'oracle',
  'cassandra', 'graphql', 'prisma'
];

/**
 * Cloud and DevOps technologies
 */
export const CLOUD_DEVOPS_SKILLS = [
  'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes',
  'k8s', 'terraform', 'jenkins', 'ci/cd',
  'github actions', 'gitlab', 'circleci', 'linux', 'unix', 'bash', 'shell'
];

/**
 * Tools and general concepts
 */
export const TOOLS_AND_CONCEPTS = [
  'git', 'agile', 'scrum', 'jira', 'rest', 'restful', 'api', 'apis', 'microservices',
  'serverless', 'oauth', 'jwt',
  'testing', 'unit testing', 'jest', 'cypress', 'selenium', 'playwright', 'tdd', 'bdd'
];

/**
 * AI/ML technologies
 */
export const AI_ML_SKILLS = [
  'machine learning', 'ml', 'deep learning', 'ai', 'artificial intelligence',
  'tensorflow', 'pytorch', 'nlp', 'llm', 'openai'
];

/**
 * Mobile development
 */
export const MOBILE_SKILLS = [
  'ios', 'android', 'react native', 'flutter', 'xamarin', 'mobile development'
];

/**
 * Data-related skills
 */
export const DATA_SKILLS = [
  'data analysis', 'data science', 'pandas', 'numpy', 'tableau', 'power bi',
  'etl', 'data engineering', 'spark', 'hadoop'
];

/**
 * Soft skills (often mentioned in job postings)
 */
export const SOFT_SKILLS = [
  'leadership', 'communication', 'problem solving', 'teamwork', 'collaboration'
];

/**
 * Complete list of all common skills for extraction
 * Combines all categories into a single searchable array
 */
export const ALL_COMMON_SKILLS = [
  ...PROGRAMMING_LANGUAGES,
  ...FRONTEND_SKILLS,
  ...BACKEND_SKILLS,
  ...DATABASE_SKILLS,
  ...CLOUD_DEVOPS_SKILLS,
  ...TOOLS_AND_CONCEPTS,
  ...AI_ML_SKILLS,
  ...MOBILE_SKILLS,
  ...DATA_SKILLS,
  ...SOFT_SKILLS,
];

/**
 * Skill normalization map
 * Maps common variations to their canonical form for consistent display
 */
export const SKILL_NORMALIZATIONS = {
  'reactjs': 'React',
  'react.js': 'React',
  'nodejs': 'Node.js',
  'node.js': 'Node.js',
  'vuejs': 'Vue.js',
  'vue.js': 'Vue.js',
  'golang': 'Go',
  'k8s': 'Kubernetes',
  'postgres': 'PostgreSQL',
};

/**
 * Normalizes a skill name to its canonical form
 * @param {string} skill - Raw skill name
 * @returns {string} Normalized skill name
 */
export const normalizeSkillName = (skill) => {
  const lower = skill.toLowerCase();
  if (SKILL_NORMALIZATIONS[lower]) {
    return SKILL_NORMALIZATIONS[lower];
  }
  // Default: capitalize first letter
  return skill.charAt(0).toUpperCase() + skill.slice(1);
};
