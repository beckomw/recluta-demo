import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Divider,
  IconButton,
  Alert,
  Grid,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  CircularProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BoltIcon from '@mui/icons-material/Bolt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';

// Configure PDF.js worker - use the installed package worker (cdnjs doesn't have v5.x)
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function ResumeView() {
  const [resumes, setResumes] = useState([]);
  const [currentResume, setCurrentResume] = useState({
    firstName: '',
    lastName: '',
    email: '',
    zipcode: '',
    title: 'My Resume',
    summary: '',
    skills: '',
    experience: '',
  });
  const [pdfStatus, setPdfStatus] = useState('');
  const [pdfProcessing, setPdfProcessing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [quickStartSkills, setQuickStartSkills] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, resume: null });
  const firstFieldRef = useRef(null);
  const quickStartRef = useRef(null);

  // Quick Start - just skills, minimal friction
  const handleQuickStart = () => {
    if (!quickStartSkills.trim()) {
      return;
    }

    const skillsList = quickStartSkills.split(',').filter(s => s.trim()).length;
    if (skillsList < 2) {
      return;
    }

    const quickResume = {
      id: Date.now(),
      firstName: '',
      lastName: '',
      email: '',
      zipcode: '',
      title: 'Skills Profile',
      summary: '',
      skills: quickStartSkills,
      experience: '',
      isQuickProfile: true, // Flag to identify quick profiles
    };

    saveResumes([...resumes, quickResume]);
    setQuickStartSkills('');
    setShowQuickStart(false);
  };

  // Auto-focus quick start input
  useEffect(() => {
    if (showQuickStart && quickStartRef.current) {
      setTimeout(() => quickStartRef.current.focus(), 100);
    }
  }, [showQuickStart]);

  useEffect(() => {
    loadResumes();
  }, []);

  // Auto-focus first field when form opens
  useEffect(() => {
    if (showForm && firstFieldRef.current) {
      setTimeout(() => firstFieldRef.current.focus(), 100);
    }
  }, [showForm]);

  const loadResumes = () => {
    const stored = localStorage.getItem('app_resumes');
    if (stored) {
      setResumes(JSON.parse(stored));
    }
  };

  const saveResumes = (updatedResumes) => {
    localStorage.setItem('app_resumes', JSON.stringify(updatedResumes));
    setResumes(updatedResumes);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!currentResume.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!currentResume.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!currentResume.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentResume.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!currentResume.zipcode.trim()) {
      newErrors.zipcode = 'Zipcode is required';
    }
    if (!currentResume.skills.trim()) {
      newErrors.skills = 'Skills are required for job matching';
    } else if (currentResume.skills.split(',').filter(s => s.trim()).length < 2) {
      newErrors.skills = 'Please enter at least 2 skills separated by commas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate a single field on blur
  const validateField = (fieldName) => {
    const newErrors = { ...errors };

    switch (fieldName) {
      case 'firstName':
        if (!currentResume.firstName.trim()) {
          newErrors.firstName = 'First name is required';
        } else {
          delete newErrors.firstName;
        }
        break;
      case 'lastName':
        if (!currentResume.lastName.trim()) {
          newErrors.lastName = 'Last name is required';
        } else {
          delete newErrors.lastName;
        }
        break;
      case 'email':
        if (!currentResume.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentResume.email)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
      case 'zipcode':
        if (!currentResume.zipcode.trim()) {
          newErrors.zipcode = 'Zipcode is required';
        } else {
          delete newErrors.zipcode;
        }
        break;
      case 'skills':
        if (!currentResume.skills.trim()) {
          newErrors.skills = 'Skills are required for job matching';
        } else if (currentResume.skills.split(',').filter(s => s.trim()).length < 2) {
          newErrors.skills = 'Please enter at least 2 skills separated by commas';
        } else {
          delete newErrors.skills;
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
    const skills = getSkillsArray(currentResume.skills);
    const newSkills = skills.filter(s => s !== skillToRemove);
    setCurrentResume({ ...currentResume, skills: newSkills.join(', ') });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (editId) {
      const updatedResumes = resumes.map((r) => (r.id === editId ? { ...currentResume, id: editId } : r));
      saveResumes(updatedResumes);
      setEditId(null);
    } else {
      const newResume = { ...currentResume, id: Date.now() };
      saveResumes([...resumes, newResume]);
    }

    resetForm();
    setErrors({});
    setShowForm(false);
  };

  const resetForm = () => {
    setCurrentResume({
      firstName: '',
      lastName: '',
      email: '',
      zipcode: '',
      title: 'My Resume',
      summary: '',
      skills: '',
      experience: '',
    });
  };

  const handleDeleteClick = (resume) => {
    setDeleteConfirm({ open: true, resume });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm.resume) {
      const updatedResumes = resumes.filter((r) => r.id !== deleteConfirm.resume.id);
      saveResumes(updatedResumes);
    }
    setDeleteConfirm({ open: false, resume: null });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ open: false, resume: null });
  };

  const handleEdit = (resume) => {
    setCurrentResume(resume);
    setEditId(resume.id);
    setShowForm(true);
  };

  const handleDuplicate = (resume) => {
    const duplicatedResume = {
      ...resume,
      id: Date.now(),
      title: `${resume.title} (Copy)`,
    };
    saveResumes([...resumes, duplicatedResume]);
  };

  // Generate and download PDF from resume data
  const handleDownloadPDF = (resume) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = 20;

    // Helper to add wrapped text
    const addWrappedText = (text, x, startY, maxWidth, lineHeight = 6) => {
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line) => {
        if (startY > 270) {
          doc.addPage();
          startY = 20;
        }
        doc.text(line, x, startY);
        startY += lineHeight;
      });
      return startY;
    };

    // Header - Name
    const fullName = [resume.firstName, resume.lastName].filter(Boolean).join(' ') || 'Resume';
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(fullName, pageWidth / 2, y, { align: 'center' });
    y += 12;

    // Contact info line
    const contactParts = [];
    if (resume.email) contactParts.push(resume.email);
    if (resume.zipcode) contactParts.push(resume.zipcode);
    if (contactParts.length > 0) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(contactParts.join('  |  '), pageWidth / 2, y, { align: 'center' });
      y += 10;
    }

    // Divider line
    doc.setDrawColor(150);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Summary section
    if (resume.summary && resume.summary.trim()) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('SUMMARY', margin, y);
      y += 7;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      y = addWrappedText(resume.summary.trim(), margin, y, contentWidth);
      y += 6;
    }

    // Skills section
    if (resume.skills && resume.skills.trim()) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('SKILLS', margin, y);
      y += 7;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      y = addWrappedText(resume.skills.trim(), margin, y, contentWidth);
      y += 6;
    }

    // Experience section
    if (resume.experience && resume.experience.trim()) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('EXPERIENCE', margin, y);
      y += 7;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      y = addWrappedText(resume.experience.trim(), margin, y, contentWidth);
    }

    // Generate filename
    const fileName = fullName !== 'Resume'
      ? `${fullName.replace(/\s+/g, '_')}_Resume.pdf`
      : 'Resume.pdf';

    doc.save(fileName);
  };

  // Extract text from PDF using PDF.js
  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      // Build text with proper spacing
      let lastY = null;
      const pageLines = [];
      let currentLine = '';

      textContent.items.forEach(item => {
        // Check if we're on a new line (Y position changed significantly)
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          if (currentLine.trim()) {
            pageLines.push(currentLine.trim());
          }
          currentLine = item.str;
        } else {
          // Same line, add space if needed
          if (currentLine && !currentLine.endsWith(' ') && !item.str.startsWith(' ')) {
            currentLine += ' ';
          }
          currentLine += item.str;
        }
        lastY = item.transform[5];
      });

      // Add last line
      if (currentLine.trim()) {
        pageLines.push(currentLine.trim());
      }

      fullText += pageLines.join('\n') + '\n\n';
    }

    return fullText;
  };

  // Parse PDF text and extract structured data
  const parseResumeText = (text) => {
    const extracted = {
      firstName: '',
      lastName: '',
      email: '',
      zipcode: '',
      skills: '',
      experience: '',
      summary: '',
    };

    const lines = text.split('\n').filter(line => line.trim().length > 0);

    // Extract name (usually first line or near top)
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      // Name should be short (under 50 chars), 2-3 words, capitalized
      // Improved pattern to handle more name formats
      const namePattern = /^[A-Z][a-zA-Z'-]+\s+[A-Z][a-zA-Z'-]+(\s+[A-Z][a-zA-Z'-]+)?$/;
      if (firstLine.length < 50 && namePattern.test(firstLine)) {
        const nameParts = firstLine.split(/\s+/);
        if (nameParts.length >= 2) {
          extracted.firstName = nameParts[0];
          extracted.lastName = nameParts.slice(1).join(' ');
        }
      }
    }

    // Extract email
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) {
      extracted.email = emailMatch[0];
    }

    // Extract zipcode (5-digit US format)
    const zipcodeMatch = text.match(/\b\d{5}(?:-\d{4})?\b/);
    if (zipcodeMatch) {
      extracted.zipcode = zipcodeMatch[0].substring(0, 5); // Use first 5 digits
    }

    // Extract skills - comprehensive approach
    let extractedSkills = [];

    // Pattern 1: Look for skills section headers
    const skillsSectionMatch = text.match(
      /(?:Languages?\s*&?\s*More|Skills?|Technologies?|Technical Skills?|Core Competencies|Expertise):\s*([^\n]+(?:\n[^\n]+)*?)(?=\n[A-Z][A-Z\s]+:|EXPERIENCE|EDUCATION|WORK|$)/i
    );
    if (skillsSectionMatch) {
      const skillsText = skillsSectionMatch[1];
      const skills = skillsText
        .split(/[,•|\/\n]/)
        .map(s => s.trim())
        .filter(s => s.length > 0 && s.length < 50);
      extractedSkills.push(...skills);
    }

    // Pattern 2: Common tech keywords in text
    const techKeywords = [
      'Python', 'JavaScript', 'TypeScript', 'Java', 'C\\+\\+', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Scala',
      'React', 'Angular', 'Vue', 'Next\\.?js', 'Node\\.?js', 'Express', 'Django', 'Flask', 'FastAPI', 'Spring', 'Laravel',
      'HTML', 'CSS', 'SCSS', 'Sass', 'Tailwind', 'Bootstrap', 'Material UI', 'MUI',
      'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB', 'Firebase', 'Supabase',
      'AWS', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Ansible',
      'Git', 'GitHub', 'GitLab', 'Bitbucket', 'CI/CD', 'DevOps',
      'Linux', 'Ubuntu', 'Debian', 'Unix', 'Windows Server',
      'Blender', 'Photoshop', 'Illustrator', 'Figma', 'Sketch', 'Adobe XD',
      'Salesforce', 'Tableau', 'Power BI', 'Excel', 'Jira', 'Confluence',
      'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn',
      'GraphQL', 'REST', 'API', 'Microservices', 'Agile', 'Scrum'
    ];

    const keywordPattern = new RegExp(`\\b(${techKeywords.join('|')})\\b`, 'gi');
    const foundKeywords = text.match(keywordPattern) || [];
    const uniqueKeywords = [...new Set(foundKeywords.map(k => k.trim()))];
    extractedSkills.push(...uniqueKeywords);

    // Deduplicate all skills (case-insensitive)
    const seenLower = new Set();
    extractedSkills = extractedSkills.filter(s => {
      const lower = s.toLowerCase();
      if (seenLower.has(lower) || s.length <= 1) return false;
      seenLower.add(lower);
      return true;
    });

    extracted.skills = extractedSkills.join(', ');

    // Store full text as experience for reference
    extracted.experience = text.trim();

    return extracted;
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setPdfStatus('Please upload a PDF file');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setPdfStatus('File is too large. Please upload a PDF under 10MB.');
      return;
    }

    setPdfProcessing(true);
    setPdfStatus('Processing PDF...');

    try {
      const text = await extractTextFromPDF(file);
      const extracted = parseResumeText(text);

      // Pre-fill the form with extracted data
      setCurrentResume({
        ...currentResume,
        firstName: extracted.firstName || currentResume.firstName,
        lastName: extracted.lastName || currentResume.lastName,
        email: extracted.email || currentResume.email,
        zipcode: extracted.zipcode || currentResume.zipcode,
        skills: extracted.skills || currentResume.skills,
        experience: extracted.experience || currentResume.experience,
        title: 'Resume from PDF',
      });

      setPdfStatus(`PDF processed successfully! Found ${extracted.skills.split(',').filter(s => s.trim()).length} skills. Review and edit below.`);
      setShowForm(true);
      setShowAdvanced(true); // Show advanced section so user can see experience
      setErrors({});
    } catch (error) {
      console.error('PDF processing error:', error);
      setPdfStatus('Error processing PDF. Please try again or enter details manually.');
    } finally {
      setPdfProcessing(false);
      // Reset file input so same file can be re-uploaded
      e.target.value = '';
    }
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Your Skills
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            This is what we match against job requirements
          </Typography>
        </Box>
      </motion.div>

      {/* QUICK START - The "Excalidraw" Experience */}
      {resumes.length === 0 && !showForm && !showQuickStart && (
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <Card
            sx={{
              mb: 4,
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 15, 35, 0.95) 100%)',
              border: '2px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <BoltIcon sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                </motion.div>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  Find out if you're competitive — in 30 seconds
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, maxWidth: 500, mx: 'auto' }}>
                  Just type your skills. We'll tell you which jobs you can actually win.
                </Typography>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<BoltIcon />}
                    onClick={() => setShowQuickStart(true)}
                    sx={{
                      px: 4,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #0891B2 100%)',
                      },
                    }}
                  >
                    Enter My Skills
                  </Button>
                </motion.div>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quick Start Form */}
      <AnimatePresence>
        {showQuickStart && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              sx={{
                mb: 4,
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 15, 35, 0.95) 100%)',
                border: '2px solid rgba(16, 185, 129, 0.4)',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <BoltIcon sx={{ color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Quick Start
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Enter your skills to get instant job matching
                    </Typography>
                  </Box>
                </Box>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  inputRef={quickStartRef}
                  label="Your Skills"
                  placeholder="React, JavaScript, TypeScript, Node.js, Python, SQL, AWS..."
                  value={quickStartSkills}
                  onChange={(e) => setQuickStartSkills(e.target.value)}
                  helperText="Separate skills with commas. Add at least 2 skills."
                  sx={{ mb: 3 }}
                />

                {quickStartSkills.split(',').filter(s => s.trim()).length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Box sx={{ mb: 3, p: 2, borderRadius: 2, background: 'rgba(16, 185, 129, 0.1)' }}>
                      <Typography variant="body2" sx={{ color: 'success.light', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon sx={{ fontSize: 18 }} />
                        {quickStartSkills.split(',').filter(s => s.trim()).length} skills detected - Ready to go!
                      </Typography>
                    </Box>
                  </motion.div>
                )}

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ flex: 1 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<BoltIcon />}
                      onClick={handleQuickStart}
                      disabled={quickStartSkills.split(',').filter(s => s.trim()).length < 2}
                      sx={{
                        py: 1.5,
                        background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #059669 0%, #0891B2 100%)',
                        },
                        '&:disabled': {
                          background: 'rgba(255,255,255,0.1)',
                        },
                      }}
                    >
                      Create & Start Matching
                    </Button>
                  </motion.div>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => {
                      setShowQuickStart(false);
                      setQuickStartSkills('');
                    }}
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'text.secondary',
                    }}
                  >
                    Cancel
                  </Button>
                </Box>

                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2, textAlign: 'center' }}>
                  You can add more details later. This gets you started instantly.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Upload - Working Feature */}
      {!showForm && !showQuickStart && (
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <Card
            sx={{
              mb: 3,
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(15, 15, 35, 0.95) 100%)',
              border: '2px dashed rgba(139, 92, 246, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                border: '2px dashed rgba(139, 92, 246, 0.6)',
                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.15)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <input
                accept=".pdf"
                style={{ display: 'none' }}
                id="resume-pdf-upload"
                type="file"
                onChange={handlePdfUpload}
                disabled={pdfProcessing}
              />
              <label htmlFor="resume-pdf-upload" style={{ cursor: pdfProcessing ? 'wait' : 'pointer' }}>
                <Box
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    cursor: pdfProcessing ? 'wait' : 'pointer',
                  }}
                >
                  {pdfProcessing ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <CircularProgress size={48} sx={{ color: 'primary.main' }} />
                      <Typography variant="body1" sx={{ color: 'primary.light' }}>
                        Processing your resume...
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Box
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2,
                            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
                          }}
                        >
                          <CloudUploadIcon sx={{ fontSize: 32, color: 'white' }} />
                        </Box>
                      </motion.div>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        Upload Your Resume
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        Drop a PDF here or click to browse
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        We'll automatically extract your skills, contact info, and experience
                      </Typography>
                    </>
                  )}
                </Box>
              </label>
            </CardContent>
          </Card>
          {pdfStatus && (
            <Alert
              severity={pdfStatus.includes('Error') ? 'error' : pdfStatus.includes('success') ? 'success' : 'info'}
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={() => setPdfStatus('')}
            >
              {pdfStatus}
            </Alert>
          )}
        </motion.div>
      )}

      {/* Create Resume Buttons */}
      {!showForm && !showQuickStart && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          {resumes.length === 0 && (
            <Typography variant="body2" sx={{ color: 'text.secondary', width: '100%', textAlign: 'center', mb: 2 }}>
              Or create a detailed resume
            </Typography>
          )}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant={resumes.length === 0 ? "outlined" : "contained"}
              size="large"
              startIcon={<AddIcon />}
              onClick={() => setShowForm(true)}
              sx={{ px: 4, py: 1.5 }}
            >
              {resumes.length === 0 ? 'Create Detailed Resume' : 'Add New Resume'}
            </Button>
          </motion.div>
        </Box>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card sx={{ mb: 4, overflow: 'hidden' }}>
              <Box
                sx={{
                  height: 4,
                  background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)',
                }}
              />
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                  {editId ? 'Edit Resume' : 'Create New Resume'}
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <PersonIcon sx={{ color: 'primary.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Contact Information
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="First Name"
                          required
                          inputRef={firstFieldRef}
                          value={currentResume.firstName}
                          onChange={(e) => {
                            setCurrentResume({ ...currentResume, firstName: e.target.value });
                            if (errors.firstName) setErrors({ ...errors, firstName: '' });
                          }}
                          onBlur={() => validateField('firstName')}
                          error={!!errors.firstName}
                          helperText={errors.firstName}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          required
                          value={currentResume.lastName}
                          onChange={(e) => {
                            setCurrentResume({ ...currentResume, lastName: e.target.value });
                            if (errors.lastName) setErrors({ ...errors, lastName: '' });
                          }}
                          onBlur={() => validateField('lastName')}
                          error={!!errors.lastName}
                          helperText={errors.lastName}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          required
                          value={currentResume.email}
                          onChange={(e) => {
                            setCurrentResume({ ...currentResume, email: e.target.value });
                            if (errors.email) setErrors({ ...errors, email: '' });
                          }}
                          onBlur={() => validateField('email')}
                          error={!!errors.email}
                          helperText={errors.email}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Zipcode"
                          required
                          value={currentResume.zipcode}
                          onChange={(e) => {
                            setCurrentResume({ ...currentResume, zipcode: e.target.value });
                            if (errors.zipcode) setErrors({ ...errors, zipcode: '' });
                          }}
                          onBlur={() => validateField('zipcode')}
                          error={!!errors.zipcode}
                          helperText={errors.zipcode}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <DescriptionIcon sx={{ color: 'secondary.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Resume Details
                      </Typography>
                    </Box>
                    <TextField
                      fullWidth
                      label="Resume Title"
                      placeholder="e.g., Software Engineer Resume"
                      value={currentResume.title}
                      onChange={(e) => setCurrentResume({ ...currentResume, title: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Skills"
                      required
                      placeholder="JavaScript, React, Node.js, Python, SQL, AWS..."
                      value={currentResume.skills}
                      onChange={(e) => {
                        setCurrentResume({ ...currentResume, skills: e.target.value });
                        if (errors.skills) setErrors({ ...errors, skills: '' });
                      }}
                      onBlur={() => validateField('skills')}
                      error={!!errors.skills}
                      helperText={errors.skills || "Separate skills with commas - this is the key field for job matching"}
                    />
                    {/* Skills Chips Display */}
                    {getSkillsArray(currentResume.skills).length > 0 && (
                      <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                        {getSkillsArray(currentResume.skills).map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            size="small"
                            onDelete={() => removeSkill(skill)}
                            sx={{
                              background: 'rgba(139, 92, 246, 0.15)',
                              borderColor: 'rgba(139, 92, 246, 0.3)',
                              color: 'primary.light',
                              '& .MuiChip-deleteIcon': {
                                color: 'rgba(139, 92, 246, 0.6)',
                                '&:hover': {
                                  color: 'rgba(139, 92, 246, 1)',
                                },
                              },
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>

                  {/* Expandable Advanced Section */}
                  <Box sx={{ mb: 3 }}>
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
                      <Box sx={{ mt: 2 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label="Professional Summary"
                          placeholder="Brief overview of your professional background and goals (optional)"
                          value={currentResume.summary}
                          onChange={(e) => setCurrentResume({ ...currentResume, summary: e.target.value })}
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          label="Work Experience"
                          placeholder="List your work experience, job titles, companies, and key responsibilities (optional)"
                          value={currentResume.experience}
                          onChange={(e) => setCurrentResume({ ...currentResume, experience: e.target.value })}
                        />
                      </Box>
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
                        {editId ? 'Update Resume' : 'Save Resume'}
                      </Button>
                    </motion.div>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => {
                        setShowForm(false);
                        resetForm();
                        setEditId(null);
                      }}
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'text.secondary',
                        '&:hover': {
                          borderColor: 'rgba(255, 255, 255, 0.4)',
                        },
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={cardVariants} initial="hidden" animate="visible">
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Saved Resumes
          </Typography>
          {resumes.length > 0 && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {resumes.length} resume{resumes.length !== 1 ? 's' : ''}
            </Typography>
          )}
        </Box>

        {resumes.length === 0 ? (
          <Card>
            <CardContent sx={{ p: 6, textAlign: 'center' }}>
              <DescriptionIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                No resumes yet
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Create your first resume to start comparing against job postings
              </Typography>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowForm(true)}
                  sx={{ px: 4, py: 1.5 }}
                >
                  Create Your First Resume
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {resumes.map((resume, index) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={resume.id}>
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
                      '&:hover': {
                        boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)',
                        borderColor: 'rgba(139, 92, 246, 0.3)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <DescriptionIcon sx={{ color: 'white' }} />
                        </Box>
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => handleDownloadPDF(resume)}
                            sx={{
                              color: 'success.main',
                              '&:hover': { background: 'rgba(16, 185, 129, 0.1)' },
                            }}
                            title="Download PDF"
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDuplicate(resume)}
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
                            onClick={() => handleEdit(resume)}
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
                            onClick={() => handleDeleteClick(resume)}
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {resume.title}
                        </Typography>
                        {resume.isQuickProfile && (
                          <Chip
                            label="Skills Only"
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.65rem',
                              background: 'rgba(16, 185, 129, 0.15)',
                              color: 'success.light',
                              borderColor: 'rgba(16, 185, 129, 0.3)',
                            }}
                          />
                        )}
                      </Box>
                      {resume.firstName || resume.lastName ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                          <PersonIcon sx={{ fontSize: 16 }} />
                          <Typography variant="body2">
                            {resume.firstName} {resume.lastName}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                          {getSkillsArray(resume.skills).length} skills added
                        </Typography>
                      )}
                      {resume.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mt: 0.5 }}>
                          <EmailIcon sx={{ fontSize: 16 }} />
                          <Typography variant="body2" noWrap>
                            {resume.email}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </motion.div>

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
        <DialogTitle sx={{ fontWeight: 600 }}>Delete Resume?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            Are you sure you want to delete "{deleteConfirm.resume?.title}"? This action cannot be undone.
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

export default ResumeView;
