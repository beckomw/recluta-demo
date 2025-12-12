/**
 * Core type definitions for Recluta
 * These types define the shape of all data stored in localStorage and used throughout the app
 */

// ============================================================================
// Resume Types
// ============================================================================

export interface Resume {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  zipcode: string;
  title: string;
  summary: string;
  skills: string;
  experience: string;
  isQuickProfile?: boolean; // Added in v1 migration
}

// ============================================================================
// Job Types
// ============================================================================

export interface ActivityLogEntry {
  id: number;
  date: string; // ISO date string
  action: string;
  details: string;
}

export type JobStatus = 'none' | 'interesting' | 'applied' | 'interviewing' | 'offered' | 'rejected' | 'accepted' | 'archived';

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  url: string;
  description: string;
  requirements: string;
  isFairChance: boolean;
  fairChanceKeywords: string[];
  status: JobStatus; // Added in v2 migration
  tags: string[]; // Added in v2 migration
  notes: string; // Added in v2 migration
  activityLog: ActivityLogEntry[]; // Added in v2 migration
}

// ============================================================================
// Application Types
// ============================================================================

export type ApplicationStatus =
  | 'applied'
  | 'screening'
  | 'interviewing'
  | 'offer'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

export interface TimelineEntry {
  id: string;
  date: string; // ISO date string
  status: ApplicationStatus;
  notes: string;
}

export interface Application {
  id: string;
  jobId: number;
  resumeId: number;
  status: ApplicationStatus;
  notes: string;
  appliedDate: string; // ISO date string
  timeline: TimelineEntry[];
  nextAction?: string;
  nextActionDate?: string; // ISO date string
}

// ============================================================================
// Gamification Types
// ============================================================================

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: string; // ISO date string
}

export interface GamificationData {
  xp: number;
  level: number;
  achievements: Achievement[];
  lastActivityDate: string; // ISO date string
  streak: number;
}

// ============================================================================
// User Profile Types
// ============================================================================

export interface UserProfile {
  preferences?: {
    defaultView?: string;
    theme?: 'light' | 'dark' | 'auto';
  };
  settings?: {
    showHints?: boolean;
    enableAnimations?: boolean;
  };
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface AnalyticsData {
  totalResumesCreated: number;
  totalJobsTracked: number;
  totalApplications: number;
  totalComparisons: number;
  lastUsed: string; // ISO date string
  sessionCount: number;
}

// ============================================================================
// Data Service Types
// ============================================================================

export interface ExportData {
  version: number;
  exportedAt: string; // ISO date string
  data: {
    app_resumes?: Resume[];
    app_jobs?: Job[];
    app_applications?: Application[];
    app_user_profile?: UserProfile;
    app_analytics?: AnalyticsData;
    app_gamification?: GamificationData;
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface ImportResult {
  success: boolean;
  warnings: string[];
  imported: string[];
}

export interface MigrationResult {
  migrated: boolean;
  fromVersion?: number;
  toVersion?: number;
}

export interface StorageStats {
  totalBytes: number;
  totalKB: string;
  totalMB: string;
  breakdown: Record<string, number>;
  itemCounts: {
    resumes: number;
    jobs: number;
    applications: number;
  };
}

// ============================================================================
// Skills Matching Types
// ============================================================================

export interface PrioritizedSkill {
  skill: string;
  demand: number;
  isHot: boolean;
}

export type VerdictType = 'yes' | 'maybe' | 'stretch' | 'no';

export interface MatchAnalysis {
  matchPercentage: number;
  verdict: string;
  verdictType: VerdictType;
  message: string;
  recommendation: string;
  matchingSkills: string[];
  missingSkills: string[];
  prioritizedMissingSkills: PrioritizedSkill[];
  actionItems: string[];
}

// ============================================================================
// WebLLM Service Types
// ============================================================================

export type EnhancementType =
  | 'summary'
  | 'experience'
  | 'skills'
  | 'generateSummary';

export interface GenerateOptions {
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  type?: string;
}

export interface GenerationMetric {
  timestamp: number;
  type: string;
  duration: number;
  tokensUsed: number;
  throughput: number;
  cacheHit: boolean;
}

export interface MemorySnapshot {
  timestamp: number;
  heapUsed: number;
  heapTotal: number;
  external: number;
}

export interface MetricsSummary {
  totalGenerations: number;
  totalTokens: number;
  averageThroughput: number;
  cacheHitRate: number;
  totalDuration: number;
  averageDuration: number;
  byType: Record<string, {
    count: number;
    tokens: number;
    avgThroughput: number;
  }>;
}

export interface AIEnhanceContext {
  skills?: string;
  experience?: string;
  targetRole?: string;
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface AIEnhanceModalProps {
  open: boolean;
  onClose: () => void;
  type: EnhancementType;
  originalText: string;
  onAccept: (enhancedText: string) => void;
  context?: AIEnhanceContext;
}

export interface ComparisonViewProps {
  resumes?: Resume[];
  jobs?: Job[];
  onNavigate?: (view: string) => void;
}

// ============================================================================
// Utility Types
// ============================================================================

export type LocalStorageKey =
  | 'app_resumes'
  | 'app_jobs'
  | 'app_applications'
  | 'app_user_profile'
  | 'app_analytics'
  | 'app_gamification'
  | 'app_data_version'
  | 'app_first_launch_shown';

// Type guards
export function isResume(value: unknown): value is Resume {
  if (!value || typeof value !== 'object') return false;
  const r = value as Partial<Resume>;
  return (
    typeof r.id === 'number' &&
    typeof r.firstName === 'string' &&
    typeof r.lastName === 'string' &&
    typeof r.email === 'string' &&
    typeof r.skills === 'string'
  );
}

export function isJob(value: unknown): value is Job {
  if (!value || typeof value !== 'object') return false;
  const j = value as Partial<Job>;
  return (
    typeof j.id === 'number' &&
    typeof j.title === 'string' &&
    typeof j.company === 'string' &&
    typeof j.requirements === 'string'
  );
}

export function isApplication(value: unknown): value is Application {
  if (!value || typeof value !== 'object') return false;
  const a = value as Partial<Application>;
  return (
    typeof a.id === 'string' &&
    typeof a.jobId === 'number' &&
    typeof a.resumeId === 'number' &&
    typeof a.status === 'string'
  );
}

export function isResumeArray(value: unknown): value is Resume[] {
  return Array.isArray(value) && value.every(isResume);
}

export function isJobArray(value: unknown): value is Job[] {
  return Array.isArray(value) && value.every(isJob);
}

export function isApplicationArray(value: unknown): value is Application[] {
  return Array.isArray(value) && value.every(isApplication);
}
