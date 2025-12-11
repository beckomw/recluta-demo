/**
 * Application-wide Constants
 *
 * Centralized configuration for statuses, templates, and other
 * constant values used throughout the application.
 */

import WorkIcon from '@mui/icons-material/Work';
import StarIcon from '@mui/icons-material/Star';
import SendIcon from '@mui/icons-material/Send';
import EventNoteIcon from '@mui/icons-material/EventNote';

/**
 * Job status definitions with labels, colors, and icons
 */
export const JOB_STATUSES = {
  none: { label: 'Not Started', color: '#6B7280', icon: WorkIcon },
  interested: { label: 'Interested', color: '#F59E0B', icon: StarIcon },
  applied: { label: 'Applied', color: '#8B5CF6', icon: SendIcon },
  interviewing: { label: 'Interviewing', color: '#10B981', icon: EventNoteIcon },
};

/**
 * Quick note templates for job tracking
 * {date} placeholder is replaced with current date
 */
export const NOTE_TEMPLATES = [
  { label: 'Applied via LinkedIn', template: 'Applied via LinkedIn on {date}. Status: Waiting for response.' },
  { label: 'Applied via Company Site', template: 'Applied via company website on {date}. Status: Waiting for response.' },
  { label: 'Recruiter Contact', template: 'Recruiter: [Name] | Email: [email] | Phone: [phone]' },
  { label: 'Follow-up Needed', template: 'Follow up on {date}. Contact: [name/email]' },
  { label: 'Interview Scheduled', template: 'Interview scheduled for {date} at [time]. Type: [phone/video/onsite]' },
  { label: 'Referral', template: 'Referred by [name]. Applied on {date}.' },
];

/**
 * Application tracking status progression
 */
export const APPLICATION_STATUSES = {
  applied: { label: 'Applied', color: '#8B5CF6' },
  employer_viewed: { label: 'Employer Viewed', color: '#3B82F6' },
  phone_screen: { label: 'Phone Screen', color: '#06B6D4' },
  interview: { label: 'Interview', color: '#10B981' },
  technical_assessment: { label: 'Technical Assessment', color: '#F59E0B' },
  offer_received: { label: 'Offer Received', color: '#22C55E' },
  accepted: { label: 'Accepted', color: '#22C55E' },
  rejected: { label: 'Rejected', color: '#EF4444' },
  withdrawn: { label: 'Withdrawn', color: '#6B7280' },
  no_response: { label: 'No Response', color: '#9CA3AF' },
};

/**
 * Match verdict thresholds and messages
 */
export const MATCH_VERDICTS = {
  excellent: {
    minPercent: 70,
    verdict: 'YES, APPLY!',
    type: 'yes',
    message: 'Strong Match',
    color: '#10B981',
  },
  good: {
    minPercent: 50,
    verdict: 'MAYBE',
    type: 'maybe',
    message: 'Partial Match',
    color: '#8B5CF6',
  },
  stretch: {
    minPercent: 30,
    verdict: 'STRETCH',
    type: 'stretch',
    message: 'Gap Detected',
    color: '#F59E0B',
  },
  low: {
    minPercent: 0,
    verdict: 'NOT YET',
    type: 'no',
    message: 'Significant Gap',
    color: '#EF4444',
  },
};

/**
 * localStorage keys used by the application
 */
export const STORAGE_KEYS = {
  resumes: 'app_resumes',
  jobs: 'app_jobs',
  applications: 'app_applications',
  userProfile: 'app_user_profile',
  analytics: 'app_analytics',
  gamification: 'app_gamification',
  dataVersion: 'app_data_version',
  firstLaunchShown: 'app_first_launch_shown',
};

/**
 * Current data schema version for migrations
 */
export const CURRENT_DATA_VERSION = 2;

/**
 * Maximum file sizes (in bytes)
 */
export const FILE_LIMITS = {
  maxPdfSize: 10 * 1024 * 1024, // 10MB
  maxPdfPages: 20,
};

/**
 * Validation patterns
 */
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  zipcode: /^\d{5}(-\d{4})?$/, // US ZIP or ZIP+4
  url: /^https?:\/\/.+/i,
};
