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

function JobsView() {
  const [jobs, setJobs] = useState([]);
  const [currentJob, setCurrentJob] = useState({
    title: '',
    company: '',
    location: '',
    url: '',
    description: '',
    requirements: '',
  });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState({});
  const firstFieldRef = useRef(null);

  useEffect(() => {
    loadJobs();
  }, []);

  // Auto-focus first field when form opens
  useEffect(() => {
    if (showForm && firstFieldRef.current) {
      setTimeout(() => firstFieldRef.current.focus(), 100);
    }
  }, [showForm]);

  const loadJobs = () => {
    const stored = localStorage.getItem('app_jobs');
    if (stored) {
      setJobs(JSON.parse(stored));
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
    });
  };

  const handleDelete = (id) => {
    const updatedJobs = jobs.filter((j) => j.id !== id);
    saveJobs(updatedJobs);
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
                    }}
                    sx={{ color: 'text.secondary' }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Job Title"
                        required
                        inputRef={firstFieldRef}
                        placeholder="e.g., Senior Software Engineer"
                        value={currentJob.title}
                        onChange={(e) => {
                          setCurrentJob({ ...currentJob, title: e.target.value });
                          if (errors.title) setErrors({ ...errors, title: '' });
                        }}
                        error={!!errors.title}
                        helperText={errors.title}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Company"
                        required
                        placeholder="e.g., Tech Corp Inc."
                        value={currentJob.company}
                        onChange={(e) => {
                          setCurrentJob({ ...currentJob, company: e.target.value });
                          if (errors.company) setErrors({ ...errors, company: '' });
                        }}
                        error={!!errors.company}
                        helperText={errors.company}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Required Skills"
                        required
                        placeholder="React, TypeScript, Node.js, AWS, 3+ years experience..."
                        value={currentJob.requirements}
                        onChange={(e) => {
                          setCurrentJob({ ...currentJob, requirements: e.target.value });
                          if (errors.requirements) setErrors({ ...errors, requirements: '' });
                        }}
                        error={!!errors.requirements}
                        helperText={errors.requirements || "Separate skills with commas - this is used for matching against your resume"}
                      />
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
                            placeholder="Paste the full job description here (optional)"
                            value={currentJob.description}
                            onChange={(e) => setCurrentJob({ ...currentJob, description: e.target.value })}
                          />
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

      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Saved Jobs
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {jobs.length} job{jobs.length !== 1 ? 's' : ''}
        </Typography>
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
        <Grid container spacing={3}>
          {jobs.map((job, index) => (
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
                    '&:hover': {
                      boxShadow: '0 8px 32px rgba(6, 182, 212, 0.2)',
                      borderColor: 'rgba(6, 182, 212, 0.3)',
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
                          background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <WorkIcon sx={{ color: 'white' }} />
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
                          onClick={() => handleDelete(job.id)}
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

                    {job.url && (
                      <Box sx={{ mt: 2 }}>
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
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default JobsView;
