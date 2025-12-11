/**
 * Fair Chance Employment Indicators
 *
 * This module contains data used to auto-detect employers and positions
 * that are likely to be "Fair Chance" friendly (willing to hire candidates
 * with criminal records).
 *
 * Sources:
 * - Ban the Box legislation research
 * - Fair Chance Business Pledge signatories
 * - Industry hiring patterns
 */

/**
 * High confidence industries - statistically known for fair chance hiring
 * These industries have high turnover, labor shortages, or have explicitly
 * committed to fair chance practices.
 */
export const HIGH_CONFIDENCE_INDUSTRIES = [
  // Construction trades
  'construction', 'general contractor', 'roofing', 'plumbing', 'electrical', 'hvac',
  'carpentry', 'masonry', 'demolition', 'excavation', 'framing',
  // Hospitality
  'hospitality', 'hotel', 'motel', 'resort', 'casino',
  // Food service
  'restaurant', 'food service', 'kitchen', 'dishwasher', 'line cook', 'prep cook',
  // Warehousing & logistics
  'warehouse', 'warehousing', 'fulfillment', 'distribution center',
  // Outdoor services
  'landscaping', 'lawn care', 'groundskeeper', 'grounds maintenance',
  // Cleaning services
  'janitorial', 'custodian', 'cleaning', 'housekeeping',
  // Moving & transport
  'moving', 'mover', 'relocation',
  'trucking', 'cdl driver', 'truck driver', 'delivery driver',
  // Staffing
  'temp agency', 'staffing agency', 'day labor',
];

/**
 * Medium confidence industries - often fair chance friendly but not guaranteed
 */
export const MEDIUM_CONFIDENCE_INDUSTRIES = [
  // IT Support
  'it support', 'tech support', 'help desk', 'computer repair',
  // Call centers
  'call center', 'customer service', 'telemarketing',
  // Manufacturing
  'manufacturing', 'assembly', 'production', 'factory',
  // Retail
  'retail', 'grocery', 'supermarket', 'convenience store',
  // Automotive
  'automotive', 'mechanic', 'auto body', 'tire shop', 'oil change',
  // Waste services
  'recycling', 'waste management', 'sanitation',
  // Security (some positions)
  'security guard', 'security officer',
  // Trades
  'welding', 'welder', 'fabrication',
  'painting', 'painter', 'drywall',
  'flooring', 'tile', 'carpet installer',
  // Specialty services
  'pest control', 'exterminator',
  'solar installation', 'solar installer',
  'cable installation', 'cable technician',
];

/**
 * Job types that are fair chance friendly regardless of industry
 */
export const FAIR_CHANCE_JOB_TYPES = [
  'entry level', 'entry-level', 'no experience', 'will train',
  'immediate hire', 'urgent hire', 'hiring now', 'start immediately',
  'forklift operator', 'forklift driver', 'material handler',
  'package handler', 'picker', 'packer', 'sorter',
  'laborer', 'general labor', 'helper',
];

/**
 * Known Fair Chance employers
 * Companies that have publicly committed to fair chance hiring practices
 */
export const KNOWN_FAIR_CHANCE_EMPLOYERS = [
  // Explicitly fair chance businesses
  "dave's killer bread", 'greyston bakery', 'slack',
  // Major corporations with fair chance pledges
  'jpm', 'jpmorgan', 'jp morgan', 'target', 'walmart', 'home depot', 'koch industries',
  'unilever', 'starbucks', 'whole foods', 'uber', 'lyft',
  // Food & beverage
  'pepsico', 'coca-cola', 'coke', 'pepsi', 'frito-lay',
  // Food processing
  'tyson', 'jbs', 'smithfield', 'perdue',
  // Logistics giants
  'amazon', 'fedex', 'ups', 'dhl',
  // Food service companies
  'sysco', 'us foods', 'aramark', 'sodexo',
  // Industrial services
  'cintas', 'unifirst', 'grainger',
  // Waste management
  'waste management', 'republic services',
];

/**
 * Keywords that explicitly indicate fair chance employer
 * These provide highest confidence detection
 */
export const FAIR_CHANCE_KEYWORDS = [
  'fair chance', 'second chance', 'ban the box', 'background friendly',
  'felony friendly', 'reentry', 're-entry', 'justice impacted',
  'formerly incarcerated', 'returning citizens', 'fresh start',
  'equal opportunity', 'we consider all qualified',
];

/**
 * All fair chance indicators combined for easy access
 */
export const FAIR_CHANCE_INDICATORS = {
  highConfidenceIndustries: HIGH_CONFIDENCE_INDUSTRIES,
  mediumConfidenceIndustries: MEDIUM_CONFIDENCE_INDUSTRIES,
  fairChanceJobTypes: FAIR_CHANCE_JOB_TYPES,
  knownEmployers: KNOWN_FAIR_CHANCE_EMPLOYERS,
  keywords: FAIR_CHANCE_KEYWORDS,
};

export default FAIR_CHANCE_INDICATORS;
