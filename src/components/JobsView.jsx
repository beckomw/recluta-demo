import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  Chip,
  Grid,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControlLabel,
  Switch,
  Tooltip,
  FormGroup,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import FilterListIcon from '@mui/icons-material/FilterList';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

function JobsView({ onNavigate }) {
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [currentJob, setCurrentJob] = useState({
    title: '',
    company: '',
    location: '',
    url: '',
    description: '',
    requirements: '',
    isFairChance: false,
    fairChanceNotes: '',
  });
  const [showFairChanceOnly, setShowFairChanceOnly] = useState(false);
  const [sortFairChanceFirst, setSortFairChanceFirst] = useState(false);
  const [fairChanceAutoReason, setFairChanceAutoReason] = useState('');
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState({});
  const [quickMatchJob, setQuickMatchJob] = useState(null);
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, job: null });
  const [rawJobText, setRawJobText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const firstFieldRef = useRef(null);

  // Common tech skills to look for in job descriptions
  const commonSkills = [
    // Programming Languages
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'golang', 'rust', 'php', 'swift', 'kotlin', 'scala', 'r',
    // Frontend
    'react', 'reactjs', 'react.js', 'angular', 'angularjs', 'vue', 'vuejs', 'vue.js', 'svelte', 'next.js', 'nextjs', 'nuxt', 'gatsby',
    'html', 'css', 'sass', 'scss', 'less', 'tailwind', 'tailwindcss', 'bootstrap', 'material-ui', 'mui', 'styled-components',
    // Backend
    'node', 'nodejs', 'node.js', 'express', 'expressjs', 'fastify', 'nest', 'nestjs', 'django', 'flask', 'fastapi', 'spring', 'spring boot',
    'rails', 'ruby on rails', 'laravel', '.net', 'asp.net',
    // Databases
    'sql', 'mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'elasticsearch', 'dynamodb', 'firebase', 'supabase', 'sqlite', 'oracle',
    'cassandra', 'graphql', 'prisma',
    // Cloud & DevOps
    'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'k8s', 'terraform', 'jenkins', 'ci/cd',
    'github actions', 'gitlab', 'circleci', 'linux', 'unix', 'bash', 'shell',
    // Tools & Concepts
    'git', 'agile', 'scrum', 'jira', 'rest', 'restful', 'api', 'apis', 'microservices', 'serverless', 'oauth', 'jwt',
    'testing', 'unit testing', 'jest', 'cypress', 'selenium', 'playwright', 'tdd', 'bdd',
    // AI/ML
    'machine learning', 'ml', 'deep learning', 'ai', 'artificial intelligence', 'tensorflow', 'pytorch', 'nlp', 'llm', 'openai',
    // Mobile
    'ios', 'android', 'react native', 'flutter', 'xamarin', 'mobile development',
    // Data
    'data analysis', 'data science', 'pandas', 'numpy', 'tableau', 'power bi', 'etl', 'data engineering', 'spark', 'hadoop',
    // Soft skills
    'leadership', 'communication', 'problem solving', 'teamwork', 'collaboration',
  ];

  // Fair Chance employer industry keywords and known companies
  // These industries are statistically more likely to hire candidates with records
  const fairChanceIndicators = {
    // High confidence industries - known for fair chance hiring
    highConfidenceIndustries: [
      'construction', 'general contractor', 'roofing', 'plumbing', 'electrical', 'hvac',
      'carpentry', 'masonry', 'demolition', 'excavation', 'framing',
      'hospitality', 'hotel', 'motel', 'resort', 'casino',
      'restaurant', 'food service', 'kitchen', 'dishwasher', 'line cook', 'prep cook',
      'warehouse', 'warehousing', 'fulfillment', 'distribution center',
      'landscaping', 'lawn care', 'groundskeeper', 'grounds maintenance',
      'janitorial', 'custodian', 'cleaning', 'housekeeping',
      'moving', 'mover', 'relocation',
      'trucking', 'cdl driver', 'truck driver', 'delivery driver',
      'temp agency', 'staffing agency', 'day labor',
    ],
    // Medium confidence industries - often fair chance friendly
    mediumConfidenceIndustries: [
      'it support', 'tech support', 'help desk', 'computer repair',
      'call center', 'customer service', 'telemarketing',
      'manufacturing', 'assembly', 'production', 'factory',
      'retail', 'grocery', 'supermarket', 'convenience store',
      'automotive', 'mechanic', 'auto body', 'tire shop', 'oil change',
      'recycling', 'waste management', 'sanitation',
      'security guard', 'security officer',
      'welding', 'welder', 'fabrication',
      'painting', 'painter', 'drywall',
      'flooring', 'tile', 'carpet installer',
      'pest control', 'exterminator',
      'solar installation', 'solar installer',
      'cable installation', 'cable technician',
    ],
    // Job types that are fair chance friendly regardless of industry
    fairChanceJobTypes: [
      'entry level', 'entry-level', 'no experience', 'will train',
      'immediate hire', 'urgent hire', 'hiring now', 'start immediately',
      'forklift operator', 'forklift driver', 'material handler',
      'package handler', 'picker', 'packer', 'sorter',
      'laborer', 'general labor', 'helper',
    ],
    knownEmployers: [
      "dave's killer bread", 'greyston bakery', 'slack', 'jpm', 'jpmorgan',
      'jp morgan', 'target', 'walmart', 'home depot', 'koch industries',
      'unilever', 'starbucks', 'whole foods', 'uber', 'lyft',
      'pepsico', 'coca-cola', 'coke', 'pepsi', 'frito-lay',
      'tyson', 'jbs', 'smithfield', 'perdue',
      'amazon', 'fedex', 'ups', 'dhl',
      'sysco', 'us foods', 'aramark', 'sodexo',
      'cintas', 'unifirst', 'grainger',
      'waste management', 'republic services',
    ],
    keywords: [
      'fair chance', 'second chance', 'ban the box', 'background friendly',
      'felony friendly', 'reentry', 're-entry', 'justice impacted',
      'formerly incarcerated', 'returning citizens', 'fresh start',
      'equal opportunity', 'we consider all qualified',
    ],
  };

  // Check if job/company might be a Fair Chance employer
  // Returns { likely: boolean, confidence: 'high'|'medium'|null, reason: string }
  const detectFairChance = (job) => {
    const searchText = `${job.title} ${job.company} ${job.description || ''}`.toLowerCase();

    // Check for explicit Fair Chance keywords - highest confidence
    const matchedKeyword = fairChanceIndicators.keywords.find(kw => searchText.includes(kw));
    if (matchedKeyword) {
      return {
        likely: true,
        confidence: 'high',
        reason: `Detected: "${matchedKeyword}" in job posting`
      };
    }

    // Check for known Fair Chance employers - high confidence
    const matchedEmployer = fairChanceIndicators.knownEmployers.find(emp =>
      searchText.includes(emp.toLowerCase())
    );
    if (matchedEmployer) {
      return {
        likely: true,
        confidence: 'high',
        reason: `${matchedEmployer.charAt(0).toUpperCase() + matchedEmployer.slice(1)} is a known Fair Chance employer`
      };
    }

    // Check for high confidence industries
    const matchedHighIndustry = fairChanceIndicators.highConfidenceIndustries.find(ind =>
      searchText.includes(ind.toLowerCase())
    );
    if (matchedHighIndustry) {
      return {
        likely: true,
        confidence: 'high',
        reason: `${matchedHighIndustry.charAt(0).toUpperCase() + matchedHighIndustry.slice(1)} - industry known for fair chance hiring`
      };
    }

    // Check for fair chance friendly job types
    const matchedJobType = fairChanceIndicators.fairChanceJobTypes.find(jt =>
      searchText.includes(jt.toLowerCase())
    );
    if (matchedJobType) {
      return {
        likely: true,
        confidence: 'high',
        reason: `${matchedJobType.charAt(0).toUpperCase() + matchedJobType.slice(1)} positions are typically fair chance friendly`
      };
    }

    // Check for medium confidence industries
    const matchedMediumIndustry = fairChanceIndicators.mediumConfidenceIndustries.find(ind =>
      searchText.includes(ind.toLowerCase())
    );
    if (matchedMediumIndustry) {
      return {
        likely: true,
        confidence: 'medium',
        reason: `${matchedMediumIndustry.charAt(0).toUpperCase() + matchedMediumIndustry.slice(1)} - often fair chance friendly`
      };
    }

    return { likely: false, confidence: null, reason: null };
  };

  // Legacy alias for backward compatibility
  const detectFairChanceHint = detectFairChance;

  // Auto-detect and apply Fair Chance status when job details change
  const handleJobFieldChange = (field, value) => {
    const updatedJob = { ...currentJob, [field]: value };

    // Run detection on the updated job
    const detection = detectFairChance(updatedJob);

    // Auto-enable Fair Chance if detected (user can still toggle off)
    if (detection.likely && !currentJob.isFairChance) {
      updatedJob.isFairChance = true;
      setFairChanceAutoReason(detection.reason);
    } else if (!detection.likely && fairChanceAutoReason) {
      // If no longer detected and it was auto-detected, turn off
      // (only if user hasn't manually added notes, which indicates intent)
      if (!currentJob.fairChanceNotes) {
        updatedJob.isFairChance = false;
        setFairChanceAutoReason('');
      }
    }

    setCurrentJob(updatedJob);
    return updatedJob;
  };

  // Extract skills from job description
  const extractSkillsFromDescription = (description) => {
    if (!description || description.length < 20) return [];

    const lowerDesc = description.toLowerCase();
    const foundSkills = new Set();

    // Look for exact matches and common patterns
    commonSkills.forEach((skill) => {
      // Create word boundary pattern
      const pattern = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (pattern.test(lowerDesc)) {
        // Normalize skill name
        let normalizedSkill = skill;
        if (skill === 'reactjs' || skill === 'react.js') normalizedSkill = 'React';
        else if (skill === 'nodejs' || skill === 'node.js') normalizedSkill = 'Node.js';
        else if (skill === 'vuejs' || skill === 'vue.js') normalizedSkill = 'Vue.js';
        else if (skill === 'golang') normalizedSkill = 'Go';
        else if (skill === 'k8s') normalizedSkill = 'Kubernetes';
        else if (skill === 'postgres') normalizedSkill = 'PostgreSQL';
        else normalizedSkill = skill.charAt(0).toUpperCase() + skill.slice(1);
        foundSkills.add(normalizedSkill);
      }
    });

    // Also look for "X years" patterns for experience requirements
    const yearsPattern = /(\d+)\+?\s*(?:years?|yrs?)\s+(?:of\s+)?(?:experience|exp)/gi;
    let yearsMatch;
    while ((yearsMatch = yearsPattern.exec(description)) !== null) {
      foundSkills.add(`${yearsMatch[1]}+ years experience`);
    }

    return Array.from(foundSkills);
  };

  // Handle description change, extract skills, and auto-detect Fair Chance
  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;

    // Use the auto-detection handler for description changes
    handleJobFieldChange('description', newDescription);

    // Extract skills if description is long enough
    if (newDescription.length > 50) {
      const skills = extractSkillsFromDescription(newDescription);
      setExtractedSkills(skills);
    } else {
      setExtractedSkills([]);
    }
  };

  // Add extracted skill to requirements
  const addExtractedSkill = (skill) => {
    const currentSkills = currentJob.requirements
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (!currentSkills.some(s => s.toLowerCase() === skill.toLowerCase())) {
      const newRequirements = currentSkills.length > 0
        ? `${currentJob.requirements}, ${skill}`
        : skill;
      setCurrentJob({ ...currentJob, requirements: newRequirements });
    }
  };

  // Parse a full job posting to extract structured data
  const parseJobPosting = (text) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let title = '';
    let company = '';
    let location = '';
    const skills = new Set();

    // Try to extract job title (usually first meaningful line or after "Job Title:", "Position:")
    const titlePatterns = [
      /^(?:job\s*title|position|role)\s*[:\-]\s*(.+)/i,
      /^(?:we(?:'re| are)\s+(?:looking for|hiring)\s+(?:a|an)\s+)?(.+?(?:engineer|developer|manager|analyst|designer|specialist|coordinator|associate|lead|director|scientist|architect|administrator|consultant|representative|assistant|technician|intern))/i,
    ];

    for (const line of lines.slice(0, 10)) {
      for (const pattern of titlePatterns) {
        const match = line.match(pattern);
        if (match) {
          title = match[1].trim();
          break;
        }
      }
      if (title) break;
      // If first line looks like a title (short, no punctuation at end)
      if (!title && lines.indexOf(line) === 0 && line.length < 80 && !line.endsWith('.') && !line.endsWith(':')) {
        title = line;
      }
    }

    // Try to extract company name
    const companyPatterns = [
      /(?:company|employer|organization)\s*[:\-]\s*(.+)/i,
      /(?:about|join)\s+(.+?)(?:\s*[,\-\|]|\s+is\s+|\s+was\s+|$)/i,
      /at\s+([A-Z][A-Za-z0-9\s&]+?)(?:\s*[,\-\|]|$)/,
      /([A-Z][A-Za-z0-9\s&]+?)\s+is\s+(?:looking|hiring|seeking)/i,
    ];

    for (const line of lines.slice(0, 20)) {
      for (const pattern of companyPatterns) {
        const match = line.match(pattern);
        if (match && match[1].length < 50) {
          company = match[1].trim();
          break;
        }
      }
      if (company) break;
    }

    // Try to extract location
    const locationPatterns = [
      /(?:location|based in|office)\s*[:\-]\s*(.+)/i,
      /\b(remote|hybrid|on-?site)\b/i,
      /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?,\s*[A-Z]{2})\b/, // City, ST format
    ];

    for (const line of lines) {
      for (const pattern of locationPatterns) {
        const match = line.match(pattern);
        if (match) {
          location = match[1].trim();
          break;
        }
      }
      if (location) break;
    }

    // Extract skills - look for requirement/qualification sections and bullet points
    const requirementSectionStarts = [
      /(?:requirements?|qualifications?|what you(?:'ll)? (?:need|bring)|skills?|must have|we(?:'d)? (?:love|like) to (?:hear|see)|you(?:'ll)? have)/i
    ];

    let inRequirementSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check if we're entering a requirements section
      if (requirementSectionStarts.some(p => p.test(line))) {
        inRequirementSection = true;
        continue;
      }

      // Check if we're leaving the section (new major section)
      if (inRequirementSection && /^(?:benefits?|perks|what we offer|about (?:us|the)|responsibilities|duties|how to apply)/i.test(line)) {
        inRequirementSection = false;
        continue;
      }

      // Extract skills from bullet points or requirement lines
      if (inRequirementSection || /^[\-•\*]\s/.test(line) || /^\d+[.\)]\s/.test(line)) {
        const cleanedSkill = extractConciseSkill(line);
        if (cleanedSkill && cleanedSkill.length > 2 && cleanedSkill.length < 100) {
          skills.add(cleanedSkill);
        }
      }
    }

    // Also extract tech keywords
    const techSkills = extractSkillsFromDescription(text);
    techSkills.forEach(s => skills.add(s));

    return {
      title,
      company,
      location,
      requirements: Array.from(skills).slice(0, 15).join(', '),
      description: text,
    };
  };

  // Extract concise skill phrase from a sentence, removing fluff
  const extractConciseSkill = (text) => {
    // Remove bullet points and numbering
    let cleaned = text.replace(/^[\-•\*]\s*/, '').replace(/^\d+[.\)]\s*/, '').trim();

    // Remove common prefixes/fluff
    const fluffPatterns = [
      /^(?:proven|demonstrated|strong|solid|excellent|exceptional|deep|extensive|thorough)\s+(?:experience|knowledge|understanding|proficiency|expertise|skills?|ability|track record)\s+(?:in|with|of)\s+/i,
      /^(?:experience|proficiency|expertise|knowledge|familiarity|understanding)\s+(?:in|with|of)\s+/i,
      /^(?:ability|able)\s+to\s+/i,
      /^(?:we(?:'d)? (?:love|like) to (?:hear|see) (?:from you )?if you have)\s*[:\-]?\s*/i,
      /^(?:you(?:'ll)? have|you bring|you possess)\s*[:\-]?\s*/i,
      /^(?:must have|required|nice to have|bonus|preferred)\s*[:\-]?\s*/i,
      /^(?:\d+\+?\s*(?:years?|yrs?)(?:\s+of)?\s+(?:experience|exp)\s+(?:in|with)\s+)/i,
      /^(?:background in|hands-on experience with|working knowledge of)\s+/i,
      /^(?:comfortable with|skilled in|adept at|competent in)\s+/i,
    ];

    for (const pattern of fluffPatterns) {
      cleaned = cleaned.replace(pattern, '');
    }

    // Remove trailing fluff
    cleaned = cleaned.replace(/\s+(?:is a plus|preferred|required|a must|strongly preferred|nice to have|bonus)\.?$/i, '');

    // Trim and capitalize first letter
    cleaned = cleaned.trim();
    if (cleaned.length > 0) {
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }

    // Remove trailing period
    cleaned = cleaned.replace(/\.$/, '');

    return cleaned;
  };

  // Handle parsing the pasted job text
  const handleParseJobPosting = () => {
    if (!rawJobText.trim()) return;

    setIsParsing(true);

    // Parse the job posting
    const parsed = parseJobPosting(rawJobText);

    // Apply fair chance detection
    const detection = detectFairChance(parsed);
    if (detection.likely) {
      parsed.isFairChance = true;
      setFairChanceAutoReason(detection.reason);
    }

    setCurrentJob({
      ...currentJob,
      ...parsed,
      isFairChance: detection.likely,
      fairChanceNotes: '',
    });

    setIsParsing(false);
    setRawJobText('');
  };

  // Add all extracted skills
  const addAllExtractedSkills = () => {
    const currentSkills = currentJob.requirements
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(s => s.length > 0);

    const newSkills = extractedSkills.filter(
      skill => !currentSkills.includes(skill.toLowerCase())
    );

    if (newSkills.length > 0) {
      const newRequirements = currentJob.requirements
        ? `${currentJob.requirements}, ${newSkills.join(', ')}`
        : newSkills.join(', ');
      setCurrentJob({ ...currentJob, requirements: newRequirements });
    }
  };

  // Calculate match score for a job against a resume
  const calculateMatchScore = (job, resume) => {
    if (!resume || !resume.skills) return null;

    const resumeSkills = resume.skills
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 0);

    const jobRequirements = job.requirements
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 0);

    if (jobRequirements.length === 0) return null;

    const matchingSkills = resumeSkills.filter((skill) =>
      jobRequirements.some((req) => req.includes(skill) || skill.includes(req))
    );

    return Math.round((matchingSkills.length / jobRequirements.length) * 100);
  };

  // Get the best match score across all resumes for a job
  const getBestMatchForJob = (job) => {
    if (resumes.length === 0) return null;

    const scores = resumes.map((resume) => ({
      resume,
      score: calculateMatchScore(job, resume),
    })).filter(s => s.score !== null);

    if (scores.length === 0) return null;

    return scores.reduce((best, curr) =>
      curr.score > best.score ? curr : best
    , scores[0]);
  };

  // Get verdict info based on score
  const getVerdictInfo = (score) => {
    if (score >= 70) return { verdict: 'YES', color: '#10B981', icon: ThumbUpIcon };
    if (score >= 50) return { verdict: 'MAYBE', color: '#8B5CF6', icon: HelpOutlineIcon };
    if (score >= 30) return { verdict: 'STRETCH', color: '#F59E0B', icon: TrendingUpIcon };
    return { verdict: 'GAP', color: '#EF4444', icon: ThumbDownIcon };
  };

  useEffect(() => {
    loadData();
  }, []);

  // Auto-focus first field when form opens
  useEffect(() => {
    if (showForm && firstFieldRef.current) {
      setTimeout(() => firstFieldRef.current.focus(), 100);
    }
  }, [showForm]);

  const loadData = () => {
    const storedJobs = localStorage.getItem('app_jobs');
    const storedResumes = localStorage.getItem('app_resumes');
    if (storedJobs) {
      setJobs(JSON.parse(storedJobs));
    }
    if (storedResumes) {
      setResumes(JSON.parse(storedResumes));
    }
  };

  const saveJobs = (updatedJobs) => {
    localStorage.setItem('app_jobs', JSON.stringify(updatedJobs));
    setJobs(updatedJobs);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!currentJob.title.trim()) {
      newErrors.title = 'Job title is required';
    }
    if (!currentJob.company.trim()) {
      newErrors.company = 'Company name is required';
    }
    if (!currentJob.requirements.trim()) {
      newErrors.requirements = 'Required skills are needed for matching';
    } else if (currentJob.requirements.split(',').filter(s => s.trim()).length < 2) {
      newErrors.requirements = 'Please enter at least 2 skills separated by commas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate a single field on blur
  const validateField = (fieldName) => {
    const newErrors = { ...errors };

    switch (fieldName) {
      case 'title':
        if (!currentJob.title.trim()) {
          newErrors.title = 'Job title is required';
        } else {
          delete newErrors.title;
        }
        break;
      case 'company':
        if (!currentJob.company.trim()) {
          newErrors.company = 'Company name is required';
        } else {
          delete newErrors.company;
        }
        break;
      case 'requirements':
        if (!currentJob.requirements.trim()) {
          newErrors.requirements = 'Required skills are needed for matching';
        } else if (currentJob.requirements.split(',').filter(s => s.trim()).length < 2) {
          newErrors.requirements = 'Please enter at least 2 skills separated by commas';
        } else {
          delete newErrors.requirements;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  // Parse skills into array for chip display
  const getSkillsArray = (skillsString) => {
    return skillsString
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
  };

  // Remove a skill from the list
  const removeSkill = (skillToRemove) => {
    const skills = getSkillsArray(currentJob.requirements);
    const newSkills = skills.filter(s => s !== skillToRemove);
    setCurrentJob({ ...currentJob, requirements: newSkills.join(', ') });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (editId) {
      const updatedJobs = jobs.map((j) => (j.id === editId ? { ...currentJob, id: editId } : j));
      saveJobs(updatedJobs);
      setEditId(null);
    } else {
      const newJob = { ...currentJob, id: Date.now() };
      saveJobs([...jobs, newJob]);
    }

    resetForm();
    setErrors({});
    setShowForm(false);
  };

  const resetForm = () => {
    setCurrentJob({
      title: '',
      company: '',
      location: '',
      url: '',
      description: '',
      requirements: '',
      isFairChance: false,
      fairChanceNotes: '',
    });
    setFairChanceAutoReason('');
    setExtractedSkills([]);
    setRawJobText('');
  };

  // Get filtered and sorted jobs
  const getDisplayedJobs = () => {
    let displayedJobs = [...jobs];

    // Filter to show only Fair Chance jobs if enabled
    if (showFairChanceOnly) {
      displayedJobs = displayedJobs.filter(job => job.isFairChance);
    }

    // Sort Fair Chance jobs first if enabled
    if (sortFairChanceFirst) {
      displayedJobs.sort((a, b) => {
        if (a.isFairChance && !b.isFairChance) return -1;
        if (!a.isFairChance && b.isFairChance) return 1;
        return 0;
      });
    }

    return displayedJobs;
  };

  const handleDeleteClick = (job) => {
    setDeleteConfirm({ open: true, job });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm.job) {
      const updatedJobs = jobs.filter((j) => j.id !== deleteConfirm.job.id);
      saveJobs(updatedJobs);
    }
    setDeleteConfirm({ open: false, job: null });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ open: false, job: null });
  };

  const handleEdit = (job) => {
    setCurrentJob(job);
    setEditId(job.id);
    setShowForm(true);
  };

  const handleDuplicate = (job) => {
    const duplicatedJob = {
      ...job,
      id: Date.now(),
      title: `${job.title} (Copy)`,
    };
    saveJobs([...jobs, duplicatedJob]);
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Track Jobs
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Save job postings you want to compare against your profile
            </Typography>
          </Box>
          {!showForm && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowForm(true)}
                sx={{ px: 3 }}
              >
                Add Job
              </Button>
            </motion.div>
          )}
        </Box>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card sx={{ mb: 4, overflow: 'hidden' }}>
              <Box
                sx={{
                  height: 4,
                  background: 'linear-gradient(90deg, #06B6D4, #8B5CF6)',
                }}
              />
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {editId ? 'Edit Job Posting' : 'Add New Job Posting'}
                  </Typography>
                  <IconButton
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                      setEditId(null);
                      setRawJobText('');
                    }}
                    sx={{ color: 'text.secondary' }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>

                {/* Paste & Parse Section - only show when adding new job */}
                {!editId && !currentJob.title && (
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={6}
                      placeholder="Paste the entire job posting here and click 'Parse' to auto-extract the details..."
                      value={rawJobText}
                      onChange={(e) => setRawJobText(e.target.value)}
                      inputRef={firstFieldRef}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          background: 'rgba(139, 92, 246, 0.05)',
                          '&:hover': {
                            background: 'rgba(139, 92, 246, 0.08)',
                          },
                          '&.Mui-focused': {
                            background: 'rgba(139, 92, 246, 0.1)',
                          },
                        },
                      }}
                    />
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleParseJobPosting}
                        disabled={!rawJobText.trim() || isParsing}
                        startIcon={<AutoAwesomeIcon />}
                        sx={{
                          background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)',
                          },
                        }}
                      >
                        {isParsing ? 'Parsing...' : 'Parse Job Posting'}
                      </Button>
                      <Typography variant="body2" sx={{ color: 'text.secondary', alignSelf: 'center' }}>
                        or fill in the fields manually below
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Show parsed success message */}
                {!editId && currentJob.title && (
                  <Box
                    sx={{
                      mb: 3,
                      p: 2,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <AutoAwesomeIcon sx={{ color: '#10B981' }} />
                    <Typography variant="body2" sx={{ color: '#10B981' }}>
                      Job details extracted! Review and edit below, then save.
                    </Typography>
                  </Box>
                )}

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Job Title"
                        required
                        inputRef={firstFieldRef}
                        placeholder="e.g., Warehouse Associate, Construction Helper, Delivery Driver..."
                        value={currentJob.title}
                        onChange={(e) => {
                          handleJobFieldChange('title', e.target.value);
                          if (errors.title) setErrors({ ...errors, title: '' });
                        }}
                        onBlur={() => validateField('title')}
                        error={!!errors.title}
                        helperText={errors.title}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Company"
                        required
                        placeholder="e.g., Amazon, Home Depot, Starbucks..."
                        value={currentJob.company}
                        onChange={(e) => {
                          handleJobFieldChange('company', e.target.value);
                          if (errors.company) setErrors({ ...errors, company: '' });
                        }}
                        onBlur={() => validateField('company')}
                        error={!!errors.company}
                        helperText={errors.company}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Required Skills"
                        required
                        placeholder="React, TypeScript, Node.js, AWS, 3+ years experience..."
                        value={currentJob.requirements}
                        onChange={(e) => {
                          setCurrentJob({ ...currentJob, requirements: e.target.value });
                          if (errors.requirements) setErrors({ ...errors, requirements: '' });
                        }}
                        onBlur={() => validateField('requirements')}
                        error={!!errors.requirements}
                        helperText={errors.requirements || "Separate skills with commas - this is used for matching against your resume"}
                      />
                      {/* Skills Chips Display */}
                      {getSkillsArray(currentJob.requirements).length > 0 && (
                        <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                          {getSkillsArray(currentJob.requirements).map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill}
                              size="small"
                              onDelete={() => removeSkill(skill)}
                              sx={{
                                background: 'rgba(6, 182, 212, 0.15)',
                                borderColor: 'rgba(6, 182, 212, 0.3)',
                                color: 'secondary.light',
                                '& .MuiChip-deleteIcon': {
                                  color: 'rgba(6, 182, 212, 0.6)',
                                  '&:hover': {
                                    color: 'rgba(6, 182, 212, 1)',
                                  },
                                },
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    </Grid>

                  </Grid>

                  {/* Expandable Advanced Section */}
                  <Box sx={{ mt: 2, mb: 2 }}>
                    <Button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      sx={{
                        color: 'text.secondary',
                        textTransform: 'none',
                        '&:hover': { background: 'rgba(255, 255, 255, 0.05)' },
                      }}
                      endIcon={
                        <ExpandMoreIcon
                          sx={{
                            transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease',
                          }}
                        />
                      }
                    >
                      {showAdvanced ? 'Hide' : 'Show'} Additional Details
                    </Button>
                    <Collapse in={showAdvanced}>
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label="Location"
                            placeholder="e.g., Remote, San Francisco, CA"
                            value={currentJob.location}
                            onChange={(e) => setCurrentJob({ ...currentJob, location: e.target.value })}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label="Job Posting URL"
                            type="url"
                            placeholder="https://..."
                            value={currentJob.url}
                            onChange={(e) => setCurrentJob({ ...currentJob, url: e.target.value })}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Full Job Description"
                            placeholder="Paste the full job description here - we'll extract skills automatically!"
                            value={currentJob.description}
                            onChange={handleDescriptionChange}
                            helperText="Paste a job description and we'll detect the required skills"
                          />

                          {/* Extracted Skills Suggestions */}
                          {extractedSkills.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="subtitle2" sx={{ color: 'success.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <AutoAwesomeIcon sx={{ fontSize: 18 }} />
                                  Detected {extractedSkills.length} skills
                                </Typography>
                                <Button
                                  size="small"
                                  onClick={addAllExtractedSkills}
                                  sx={{ fontSize: '0.75rem' }}
                                >
                                  Add All
                                </Button>
                              </Box>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {extractedSkills.map((skill, i) => {
                                  const isAdded = currentJob.requirements
                                    .toLowerCase()
                                    .includes(skill.toLowerCase());
                                  return (
                                    <Chip
                                      key={i}
                                      label={skill}
                                      size="small"
                                      onClick={() => !isAdded && addExtractedSkill(skill)}
                                      sx={{
                                        cursor: isAdded ? 'default' : 'pointer',
                                        background: isAdded
                                          ? 'rgba(16, 185, 129, 0.2)'
                                          : 'rgba(139, 92, 246, 0.15)',
                                        borderColor: isAdded
                                          ? 'rgba(16, 185, 129, 0.4)'
                                          : 'rgba(139, 92, 246, 0.3)',
                                        color: isAdded ? 'success.light' : 'primary.light',
                                        fontSize: '0.7rem',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                          background: isAdded
                                            ? 'rgba(16, 185, 129, 0.2)'
                                            : 'rgba(139, 92, 246, 0.25)',
                                          transform: isAdded ? 'none' : 'scale(1.05)',
                                        },
                                      }}
                                    />
                                  );
                                })}
                              </Box>
                            </Box>
                          )}
                        </Grid>
                      </Grid>
                    </Collapse>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ flex: 1 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        startIcon={<SaveIcon />}
                      >
                        {editId ? 'Update Job' : 'Save Job'}
                      </Button>
                    </motion.div>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Saved Jobs
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {showFairChanceOnly
              ? `${getDisplayedJobs().length} of ${jobs.length} job${jobs.length !== 1 ? 's' : ''}`
              : `${jobs.length} job${jobs.length !== 1 ? 's' : ''}`}
          </Typography>
        </Box>

        {/* Fair Chance Filter/Sort Controls */}
        {jobs.length > 0 && jobs.some(job => job.isFairChance) && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
              p: 2,
              borderRadius: 2,
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VerifiedUserIcon sx={{ color: '#10B981', fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ color: '#10B981', fontWeight: 600 }}>
                Fair Chance Jobs
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={showFairChanceOnly}
                    onChange={(e) => setShowFairChanceOnly(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#10B981' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#10B981' },
                    }}
                  />
                }
                label={<Typography variant="body2" sx={{ color: 'text.secondary' }}>Show only Fair Chance</Typography>}
              />
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={sortFairChanceFirst}
                    onChange={(e) => setSortFairChanceFirst(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#06B6D4' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#06B6D4' },
                    }}
                  />
                }
                label={<Typography variant="body2" sx={{ color: 'text.secondary' }}>Show Fair Chance first</Typography>}
              />
            </Box>
          </Box>
        )}
      </Box>

      {jobs.length === 0 ? (
        <Card>
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <WorkIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
              No jobs saved yet
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Add job postings you're interested in to compare against your resume
            </Typography>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowForm(true)}
                sx={{ px: 4, py: 1.5 }}
              >
                Add Your First Job
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Grid container spacing={3}>
          {getDisplayedJobs().map((job, index) => {
            const bestMatch = getBestMatchForJob(job);
            const verdictInfo = bestMatch ? getVerdictInfo(bestMatch.score) : null;
            const VerdictIcon = verdictInfo?.icon;

            return (
              <Grid size={{ xs: 12, md: 6 }} key={job.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'visible',
                      '&:hover': {
                        boxShadow: '0 8px 32px rgba(6, 182, 212, 0.2)',
                        borderColor: 'rgba(6, 182, 212, 0.3)',
                      },
                    }}
                  >
                    {/* Match Score Badge */}
                    {bestMatch && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -12,
                          right: 16,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${verdictInfo.color}30 0%, ${verdictInfo.color}15 100%)`,
                          border: `2px solid ${verdictInfo.color}`,
                          boxShadow: `0 4px 12px ${verdictInfo.color}40`,
                        }}
                      >
                        <VerdictIcon sx={{ fontSize: 16, color: verdictInfo.color }} />
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 700,
                            color: verdictInfo.color,
                            fontSize: '0.7rem',
                          }}
                        >
                          {bestMatch.score}% — {verdictInfo.verdict}
                        </Typography>
                      </Box>
                    )}

                    {/* No Resume Badge */}
                    {!bestMatch && resumes.length === 0 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -12,
                          right: 16,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 2,
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px dashed rgba(255, 255, 255, 0.3)',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.7rem',
                          }}
                        >
                          Add resume to see match
                        </Typography>
                      </Box>
                    )}

                    {/* Fair Chance Employer Badge */}
                    {job.isFairChance && (
                      <Tooltip
                        title={job.fairChanceNotes || "This employer has Fair Chance hiring practices"}
                        arrow
                        placement="top"
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -12,
                            left: 16,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0.15) 100%)',
                            border: '2px solid #10B981',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                            cursor: 'help',
                          }}
                        >
                          <VerifiedUserIcon sx={{ fontSize: 14, color: '#10B981' }} />
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 700,
                              color: '#10B981',
                              fontSize: '0.7rem',
                            }}
                          >
                            Fair Chance
                          </Typography>
                        </Box>
                      </Tooltip>
                    )}

                    <CardContent sx={{ p: 3, pt: bestMatch || resumes.length === 0 || job.isFairChance ? 4 : 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            background: bestMatch
                              ? `linear-gradient(135deg, ${verdictInfo.color}40 0%, ${verdictInfo.color}20 100%)`
                              : 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <WorkIcon sx={{ color: bestMatch ? verdictInfo.color : 'white' }} />
                        </Box>
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => handleDuplicate(job)}
                            sx={{
                              color: 'secondary.main',
                              '&:hover': { background: 'rgba(6, 182, 212, 0.1)' },
                            }}
                            title="Duplicate"
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(job)}
                            sx={{
                              color: 'primary.main',
                              '&:hover': { background: 'rgba(139, 92, 246, 0.1)' },
                            }}
                            title="Edit"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(job)}
                            sx={{
                              color: 'error.main',
                              '&:hover': { background: 'rgba(239, 68, 68, 0.1)' },
                            }}
                            title="Delete"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {job.title}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <BusinessIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {job.company}
                        </Typography>
                      </Box>

                      {job.location && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {job.location}
                          </Typography>
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {job.requirements
                          .split(',')
                          .slice(0, 4)
                          .map((skill, i) => (
                            <Chip
                              key={i}
                              label={skill.trim()}
                              size="small"
                              sx={{
                                background: 'rgba(6, 182, 212, 0.15)',
                                borderColor: 'rgba(6, 182, 212, 0.3)',
                                color: 'secondary.light',
                                fontSize: '0.75rem',
                              }}
                            />
                          ))}
                        {job.requirements.split(',').length > 4 && (
                          <Chip
                            label={`+${job.requirements.split(',').length - 4}`}
                            size="small"
                            sx={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              color: 'text.secondary',
                              fontSize: '0.75rem',
                            }}
                          />
                        )}
                      </Box>

                      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {job.url && (
                          <Button
                            size="small"
                            startIcon={<LinkIcon />}
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              color: 'primary.light',
                              '&:hover': { background: 'rgba(139, 92, 246, 0.1)' },
                            }}
                          >
                            View Original
                          </Button>
                        )}
                        {bestMatch && (
                          <Button
                            size="small"
                            startIcon={<AutoAwesomeIcon />}
                            onClick={() => setQuickMatchJob({ job, match: bestMatch })}
                            sx={{
                              color: verdictInfo.color,
                              borderColor: `${verdictInfo.color}50`,
                              '&:hover': { background: `${verdictInfo.color}15` },
                            }}
                          >
                            Details
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>

        {/* Quick Match Details Modal */}
        <AnimatePresence>
          {quickMatchJob && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Box
                onClick={() => setQuickMatchJob(null)}
                sx={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.7)',
                  zIndex: 1000,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2,
                }}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Card sx={{ maxWidth: 500, width: '100%' }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                          Quick Match
                        </Typography>
                        <IconButton onClick={() => setQuickMatchJob(null)} size="small">
                          <CloseIcon />
                        </IconButton>
                      </Box>

                      <Box sx={{ textAlign: 'center', mb: 3 }}>
                        {(() => {
                          const info = getVerdictInfo(quickMatchJob.match.score);
                          const Icon = info.icon;
                          return (
                            <>
                              <Box
                                sx={{
                                  width: 80,
                                  height: 80,
                                  borderRadius: '50%',
                                  background: `${info.color}20`,
                                  border: `3px solid ${info.color}`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  mx: 'auto',
                                  mb: 2,
                                }}
                              >
                                <Icon sx={{ fontSize: 40, color: info.color }} />
                              </Box>
                              <Typography variant="h3" sx={{ fontWeight: 800, color: info.color }}>
                                {quickMatchJob.match.score}%
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 600, color: info.color }}>
                                {info.verdict}
                              </Typography>
                            </>
                          );
                        })()}
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                          Job
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {quickMatchJob.job.title} at {quickMatchJob.job.company}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                          Best matching resume
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {quickMatchJob.match.resume.title}
                        </Typography>
                      </Box>

                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => {
                          setQuickMatchJob(null);
                          // Navigate to compare tab
                          onNavigate?.('comparison');
                        }}
                        sx={{ py: 1.5 }}
                      >
                        View Full Analysis
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm.open}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            background: 'rgba(15, 15, 35, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Delete Job?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            Are you sure you want to delete "{deleteConfirm.job?.title}" at {deleteConfirm.job?.company}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleDeleteCancel} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default JobsView;
