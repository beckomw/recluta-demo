import React, { useState, useEffect } from 'react';
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
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadResumes();
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      const updatedResumes = resumes.map((r) => (r.id === editId ? { ...currentResume, id: editId } : r));
      saveResumes(updatedResumes);
      setEditId(null);
    } else {
      const newResume = { ...currentResume, id: Date.now() };
      saveResumes([...resumes, newResume]);
    }

    resetForm();
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

  const handleDelete = (id) => {
    const updatedResumes = resumes.filter((r) => r.id !== id);
    saveResumes(updatedResumes);
  };

  const handleEdit = (resume) => {
    setCurrentResume(resume);
    setEditId(resume.id);
    setShowForm(true);
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setPdfStatus('Please upload a PDF file');
      return;
    }

    setPdfStatus('PDF parsing coming soon! For now, please enter your details manually.');
    setShowForm(true);
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
            Resume Manager
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Create and manage multiple versions of your resume
          </Typography>
        </Box>
      </motion.div>

      <motion.div variants={cardVariants} initial="hidden" animate="visible">
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <input
              accept=".pdf"
              style={{ display: 'none' }}
              id="resume-pdf-upload"
              type="file"
              onChange={handlePdfUpload}
            />
            <label htmlFor="resume-pdf-upload">
              <Box
                sx={{
                  p: 5,
                  borderRadius: 3,
                  border: '2px dashed rgba(139, 92, 246, 0.4)',
                  background: 'rgba(139, 92, 246, 0.05)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    background: 'rgba(139, 92, 246, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CloudUploadIcon sx={{ fontSize: 56, color: 'primary.main', mb: 2 }} />
                </motion.div>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Drop your resume here or click to upload
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Supports PDF files. We'll extract your details automatically.
                </Typography>
              </Box>
            </label>
            {pdfStatus && (
              <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                {pdfStatus}
              </Alert>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Divider sx={{ flex: 1, alignSelf: 'center' }} />
        <Typography variant="body2" sx={{ px: 3, color: 'text.secondary' }}>
          OR
        </Typography>
        <Divider sx={{ flex: 1, alignSelf: 'center' }} />
      </Box>

      {!showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => setShowForm(true)}
                sx={{ px: 4, py: 1.5 }}
              >
                Create Resume Manually
              </Button>
            </motion.div>
          </Box>
        </motion.div>
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
                          value={currentResume.firstName}
                          onChange={(e) => setCurrentResume({ ...currentResume, firstName: e.target.value })}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          required
                          value={currentResume.lastName}
                          onChange={(e) => setCurrentResume({ ...currentResume, lastName: e.target.value })}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          required
                          value={currentResume.email}
                          onChange={(e) => setCurrentResume({ ...currentResume, email: e.target.value })}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Zipcode"
                          required
                          value={currentResume.zipcode}
                          onChange={(e) => setCurrentResume({ ...currentResume, zipcode: e.target.value })}
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
                      rows={3}
                      label="Professional Summary"
                      placeholder="Brief overview of your professional background and goals"
                      value={currentResume.summary}
                      onChange={(e) => setCurrentResume({ ...currentResume, summary: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Skills"
                      required
                      placeholder="JavaScript, React, Node.js, Python, SQL, AWS..."
                      value={currentResume.skills}
                      onChange={(e) => setCurrentResume({ ...currentResume, skills: e.target.value })}
                      helperText="Separate skills with commas for better matching"
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      label="Work Experience"
                      placeholder="List your work experience, job titles, companies, and key responsibilities..."
                      value={currentResume.experience}
                      onChange={(e) => setCurrentResume({ ...currentResume, experience: e.target.value })}
                    />
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
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {resumes.length} resume{resumes.length !== 1 ? 's' : ''}
          </Typography>
        </Box>

        {resumes.length === 0 ? (
          <Card>
            <CardContent sx={{ p: 6, textAlign: 'center' }}>
              <DescriptionIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                No resumes yet
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Upload a PDF or create one manually to get started
              </Typography>
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
                            onClick={() => handleEdit(resume)}
                            sx={{
                              color: 'primary.main',
                              '&:hover': { background: 'rgba(139, 92, 246, 0.1)' },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(resume.id)}
                            sx={{
                              color: 'error.main',
                              '&:hover': { background: 'rgba(239, 68, 68, 0.1)' },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {resume.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                        <PersonIcon sx={{ fontSize: 16 }} />
                        <Typography variant="body2">
                          {resume.firstName} {resume.lastName}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mt: 0.5 }}>
                        <EmailIcon sx={{ fontSize: 16 }} />
                        <Typography variant="body2" noWrap>
                          {resume.email}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </motion.div>
    </Box>
  );
}

export default ResumeView;
