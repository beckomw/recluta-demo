import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import DescriptionIcon from '@mui/icons-material/Description';
import WorkIcon from '@mui/icons-material/Work';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';

function ComparisonView() {
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedResumes = localStorage.getItem('app_resumes');
    const storedJobs = localStorage.getItem('app_jobs');

    if (storedResumes) setResumes(JSON.parse(storedResumes));
    if (storedJobs) setJobs(JSON.parse(storedJobs));
  };

  const compareResumeToJob = () => {
    if (!selectedResume || !selectedJob) return;

    const resumeSkills = selectedResume.skills
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 0);

    const jobRequirements = selectedJob.requirements
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 0);

    const matchingSkills = resumeSkills.filter((skill) =>
      jobRequirements.some((req) => req.includes(skill) || skill.includes(req))
    );

    const missingSkills = jobRequirements.filter(
      (req) => !resumeSkills.some((skill) => req.includes(skill) || skill.includes(req))
    );

    const matchPercentage = jobRequirements.length > 0
      ? Math.round((matchingSkills.length / jobRequirements.length) * 100)
      : 0;

    let message = '';
    let recommendation = '';
    if (matchPercentage >= 80) {
      message = 'Excellent Match!';
      recommendation = 'You should definitely apply for this position. Your skills align very well with the requirements.';
    } else if (matchPercentage >= 60) {
      message = 'Good Match';
      recommendation = 'Consider applying and highlighting your matching skills. Look into learning the missing skills to strengthen your profile.';
    } else if (matchPercentage >= 40) {
      message = 'Moderate Match';
      recommendation = 'You may need to upskill before applying. Focus on the missing skills to improve your chances.';
    } else {
      message = 'Needs Work';
      recommendation = 'This role may require significant preparation. Consider building the required skills first.';
    }

    setAnalysis({
      matchPercentage,
      message,
      recommendation,
      matchingSkills,
      missingSkills,
    });
  };

  useEffect(() => {
    if (selectedResume && selectedJob) {
      compareResumeToJob();
    }
  }, [selectedResume, selectedJob]);

  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#8B5CF6';
    if (score >= 40) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Skills Match Analysis
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Compare your resume against a job posting to see how you match up
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <DescriptionIcon sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Select Resume
                </Typography>
              </Box>

              {resumes.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <DescriptionIcon sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
                  <Typography sx={{ color: 'text.secondary' }}>
                    No resumes available. Create one first!
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {resumes.map((resume) => (
                    <motion.div key={resume.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Box
                        onClick={() => setSelectedResume(resume)}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          cursor: 'pointer',
                          background: selectedResume?.id === resume.id
                            ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.15) 100%)'
                            : 'rgba(255, 255, 255, 0.03)',
                          border: selectedResume?.id === resume.id
                            ? '1px solid rgba(139, 92, 246, 0.4)'
                            : '1px solid rgba(255, 255, 255, 0.08)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            background: selectedResume?.id === resume.id
                              ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(236, 72, 153, 0.2) 100%)'
                              : 'rgba(255, 255, 255, 0.06)',
                          },
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {resume.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {resume.firstName} {resume.lastName}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
              }}
            >
              <CompareArrowsIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
          </motion.div>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #06B6D4 0%, #10B981 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <WorkIcon sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Select Job
                </Typography>
              </Box>

              {jobs.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <WorkIcon sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
                  <Typography sx={{ color: 'text.secondary' }}>
                    No jobs available. Add one first!
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {jobs.map((job) => (
                    <motion.div key={job.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Box
                        onClick={() => setSelectedJob(job)}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          cursor: 'pointer',
                          background: selectedJob?.id === job.id
                            ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(16, 185, 129, 0.15) 100%)'
                            : 'rgba(255, 255, 255, 0.03)',
                          border: selectedJob?.id === job.id
                            ? '1px solid rgba(6, 182, 212, 0.4)'
                            : '1px solid rgba(255, 255, 255, 0.08)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            background: selectedJob?.id === job.id
                              ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(16, 185, 129, 0.2) 100%)'
                              : 'rgba(255, 255, 255, 0.06)',
                          },
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {job.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {job.company}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              sx={{
                mb: 4,
                background: `linear-gradient(135deg, ${getScoreColor(analysis.matchPercentage)}15 0%, rgba(15, 15, 35, 0.95) 100%)`,
                border: `1px solid ${getScoreColor(analysis.matchPercentage)}40`,
              }}
            >
              <CardContent sx={{ p: 5, textAlign: 'center' }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.8 }}
                >
                  <Box
                    sx={{
                      width: 160,
                      height: 160,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${getScoreColor(analysis.matchPercentage)}30 0%, ${getScoreColor(analysis.matchPercentage)}10 100%)`,
                      border: `4px solid ${getScoreColor(analysis.matchPercentage)}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      boxShadow: `0 0 40px ${getScoreColor(analysis.matchPercentage)}40`,
                    }}
                  >
                    <Typography
                      variant="h1"
                      sx={{
                        fontWeight: 800,
                        fontSize: '3.5rem',
                        color: getScoreColor(analysis.matchPercentage),
                      }}
                    >
                      {analysis.matchPercentage}%
                    </Typography>
                  </Box>
                </motion.div>

                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {analysis.message}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
                  {analysis.recommendation}
                </Typography>
              </CardContent>
            </Card>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            background: 'rgba(16, 185, 129, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <CheckCircleIcon sx={{ color: 'success.main' }} />
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Matching Skills
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {analysis.matchingSkills.length} skills match
                          </Typography>
                        </Box>
                      </Box>
                      {analysis.matchingSkills.length === 0 ? (
                        <Typography sx={{ color: 'text.secondary' }}>
                          No matching skills found
                        </Typography>
                      ) : (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {analysis.matchingSkills.map((skill, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 + index * 0.05 }}
                            >
                              <Chip
                                label={skill}
                                sx={{
                                  background: 'rgba(16, 185, 129, 0.2)',
                                  borderColor: 'rgba(16, 185, 129, 0.4)',
                                  color: 'success.light',
                                }}
                              />
                            </motion.div>
                          ))}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            background: 'rgba(245, 158, 11, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <SchoolIcon sx={{ color: 'warning.main' }} />
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Skills to Learn
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {analysis.missingSkills.length} skills needed
                          </Typography>
                        </Box>
                      </Box>
                      {analysis.missingSkills.length === 0 ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmojiEventsIcon sx={{ color: 'success.main' }} />
                          <Typography sx={{ color: 'success.light' }}>
                            You have all required skills!
                          </Typography>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {analysis.missingSkills.map((skill, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.4 + index * 0.05 }}
                            >
                              <Chip
                                label={skill}
                                sx={{
                                  background: 'rgba(245, 158, 11, 0.2)',
                                  borderColor: 'rgba(245, 158, 11, 0.4)',
                                  color: 'warning.light',
                                }}
                              />
                            </motion.div>
                          ))}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        )}
      </AnimatePresence>

      {!analysis && selectedResume && selectedJob && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <TrendingUpIcon sx={{ fontSize: 48, color: 'primary.main' }} />
          </motion.div>
          <Typography sx={{ mt: 2, color: 'text.secondary' }}>
            Analyzing your match...
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default ComparisonView;
