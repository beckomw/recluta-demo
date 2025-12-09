import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Badge,
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
import InsightsIcon from '@mui/icons-material/Insights';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import FavoriteIcon from '@mui/icons-material/Favorite';

function ComparisonView({ onNavigate }) {
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [topSkills, setTopSkills] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedResumes = localStorage.getItem('app_resumes');
    const storedJobs = localStorage.getItem('app_jobs');

    if (storedResumes) setResumes(JSON.parse(storedResumes));
    if (storedJobs) {
      const parsedJobs = JSON.parse(storedJobs);
      setJobs(parsedJobs);

      // Calculate top skills from jobs
      if (parsedJobs.length > 0) {
        const allSkills = parsedJobs.flatMap((job) =>
          job.requirements.split(',').map((s) => s.trim().toLowerCase()).filter((s) => s.length > 0)
        );
        const skillCounts = allSkills.reduce((acc, skill) => {
          acc[skill] = (acc[skill] || 0) + 1;
          return acc;
        }, {});
        const sorted = Object.entries(skillCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);
        setTopSkills(sorted);
      }
    }
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

    // Calculate skill demand from all jobs to prioritize missing skills
    const allJobSkills = jobs.flatMap((job) =>
      job.requirements.split(',').map((s) => s.trim().toLowerCase()).filter((s) => s.length > 0)
    );
    const skillDemand = allJobSkills.reduce((acc, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {});

    // Prioritize missing skills by how in-demand they are
    const prioritizedMissingSkills = missingSkills
      .map((skill) => ({
        skill,
        demand: skillDemand[skill] || 0,
        isHot: (skillDemand[skill] || 0) >= 2, // Appears in 2+ jobs
      }))
      .sort((a, b) => b.demand - a.demand);

    let verdict = '';
    let verdictType = '';
    let message = '';
    let recommendation = '';
    let actionItems = [];

    if (matchPercentage >= 70) {
      verdict = 'YES, APPLY!';
      verdictType = 'yes';
      message = 'Strong Match';
      recommendation = 'Your skills align well with this role. Apply with confidence!';
      actionItems = [
        'Tailor your resume to highlight matching skills',
        'Prepare examples of your experience with these technologies',
        missingSkills.length > 0 ? `Mention willingness to learn: ${missingSkills.slice(0, 2).join(', ')}` : null,
      ].filter(Boolean);
    } else if (matchPercentage >= 50) {
      verdict = 'MAYBE';
      verdictType = 'maybe';
      message = 'Partial Match';
      recommendation = 'You have a solid foundation. Worth applying if you can demonstrate quick learning.';
      const topMissing = prioritizedMissingSkills.slice(0, 3).map(s => s.skill);
      actionItems = [
        'Highlight transferable skills and quick learning ability',
        `Priority skills to learn: ${topMissing.join(', ')}`,
        'Consider taking a quick online course on the missing skills',
      ];
    } else if (matchPercentage >= 30) {
      verdict = 'STRETCH';
      verdictType = 'stretch';
      message = 'Gap Detected';
      recommendation = 'This is a stretch role. Consider upskilling first or applying to gain interview experience.';
      const topMissing = prioritizedMissingSkills.slice(0, 3).map(s => s.skill);
      actionItems = [
        `Focus on learning: ${topMissing.join(', ')}`,
        'Build a small project using the required tech stack',
        'Apply to similar but more junior roles while upskilling',
      ];
    } else {
      verdict = 'NOT YET';
      verdictType = 'no';
      message = 'Significant Gap';
      recommendation = 'This role requires substantial upskilling. Use this as a learning roadmap.';
      const topMissing = prioritizedMissingSkills.slice(0, 5).map(s => s.skill);
      actionItems = [
        `Learning path: ${topMissing.join(' → ')}`,
        'Set a 3-6 month goal to build these skills',
        'Save this job and revisit after upskilling',
      ];
    }

    setAnalysis({
      matchPercentage,
      verdict,
      verdictType,
      message,
      recommendation,
      matchingSkills,
      missingSkills,
      prioritizedMissingSkills,
      actionItems,
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
                  <Typography sx={{ color: 'text.secondary', mb: 2 }}>
                    No resumes available
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onNavigate?.('resume')}
                    sx={{
                      borderColor: 'rgba(139, 92, 246, 0.5)',
                      color: 'primary.light',
                      '&:hover': {
                        borderColor: 'primary.main',
                        background: 'rgba(139, 92, 246, 0.1)',
                      },
                    }}
                  >
                    Create Resume
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 280, overflowY: 'auto' }}>
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
                          {resume.firstName || resume.lastName ? `${resume.firstName} ${resume.lastName}` : 'Skills Only Profile'}
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
                  <Typography sx={{ color: 'text.secondary', mb: 2 }}>
                    No jobs available
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onNavigate?.('jobs')}
                    sx={{
                      borderColor: 'rgba(6, 182, 212, 0.5)',
                      color: 'secondary.light',
                      '&:hover': {
                        borderColor: 'secondary.main',
                        background: 'rgba(6, 182, 212, 0.1)',
                      },
                    }}
                  >
                    Add Job
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 280, overflowY: 'auto' }}>
                  {jobs.map((job) => {
                    const skillCount = job.requirements
                      .split(',')
                      .map(s => s.trim())
                      .filter(s => s.length > 0).length;
                    return (
                      <motion.div key={job.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <Box
                          onClick={() => setSelectedJob(job)}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            cursor: 'pointer',
                            background: selectedJob?.id === job.id
                              ? job.isFairChance
                                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%)'
                                : 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(16, 185, 129, 0.15) 100%)'
                              : job.isFairChance
                                ? 'rgba(16, 185, 129, 0.08)'
                                : 'rgba(255, 255, 255, 0.03)',
                            border: selectedJob?.id === job.id
                              ? job.isFairChance
                                ? '1px solid rgba(16, 185, 129, 0.5)'
                                : '1px solid rgba(6, 182, 212, 0.4)'
                              : job.isFairChance
                                ? '1px solid rgba(16, 185, 129, 0.2)'
                                : '1px solid rgba(255, 255, 255, 0.08)',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              background: selectedJob?.id === job.id
                                ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(16, 185, 129, 0.2) 100%)'
                                : 'rgba(255, 255, 255, 0.06)',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  {job.title}
                                </Typography>
                                {job.isFairChance && (
                                  <VerifiedUserIcon sx={{ fontSize: 16, color: '#10B981' }} />
                                )}
                              </Box>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {job.company}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                              <Chip
                                size="small"
                                label={`${skillCount} skills`}
                                sx={{
                                  background: 'rgba(6, 182, 212, 0.2)',
                                  color: 'secondary.light',
                                  fontSize: '0.7rem',
                                  height: 22,
                                }}
                              />
                              {job.isFairChance && (
                                <Chip
                                  size="small"
                                  icon={<VerifiedUserIcon sx={{ fontSize: '14px !important', color: '#10B981 !important' }} />}
                                  label="Fair Chance"
                                  sx={{
                                    background: 'rgba(16, 185, 129, 0.15)',
                                    color: '#10B981',
                                    fontSize: '0.65rem',
                                    height: 20,
                                    '& .MuiChip-icon': {
                                      marginLeft: '4px',
                                    },
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </motion.div>
                    );
                  })}
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
            {/* THE VERDICT - Big, Bold, Clear */}
            <Card
              sx={{
                mb: 4,
                background: analysis.verdictType === 'yes'
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 15, 35, 0.95) 100%)'
                  : analysis.verdictType === 'maybe'
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(15, 15, 35, 0.95) 100%)'
                  : analysis.verdictType === 'stretch'
                  ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(15, 15, 35, 0.95) 100%)'
                  : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(15, 15, 35, 0.95) 100%)',
                border: `2px solid ${getScoreColor(analysis.matchPercentage)}60`,
              }}
            >
              <CardContent sx={{ p: 5 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4 }}>
                  {/* Verdict Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', duration: 0.8 }}
                  >
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${getScoreColor(analysis.matchPercentage)}40 0%, ${getScoreColor(analysis.matchPercentage)}20 100%)`,
                        border: `4px solid ${getScoreColor(analysis.matchPercentage)}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 0 40px ${getScoreColor(analysis.matchPercentage)}40`,
                      }}
                    >
                      {analysis.verdictType === 'yes' && <ThumbUpIcon sx={{ fontSize: 56, color: '#10B981' }} />}
                      {analysis.verdictType === 'maybe' && <HelpOutlineIcon sx={{ fontSize: 56, color: '#8B5CF6' }} />}
                      {analysis.verdictType === 'stretch' && <TrendingUpIcon sx={{ fontSize: 56, color: '#F59E0B' }} />}
                      {analysis.verdictType === 'no' && <SchoolIcon sx={{ fontSize: 56, color: '#EF4444' }} />}
                    </Box>
                  </motion.div>

                  {/* Verdict Text */}
                  <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Typography
                        variant="h2"
                        sx={{
                          fontWeight: 900,
                          fontSize: { xs: '2rem', md: '3rem' },
                          color: getScoreColor(analysis.matchPercentage),
                          mb: 1,
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {analysis.verdict}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                        {analysis.message} — {analysis.matchPercentage}% Match
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 500 }}>
                        {analysis.recommendation}
                      </Typography>

                      {/* Fair Chance Employer Highlight */}
                      {selectedJob?.isFairChance && (
                        <Box
                          sx={{
                            mt: 2,
                            p: 2,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: '50%',
                              background: 'rgba(16, 185, 129, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <FavoriteIcon sx={{ color: '#10B981', fontSize: 20 }} />
                          </Box>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <VerifiedUserIcon sx={{ color: '#10B981', fontSize: 18 }} />
                              <Typography variant="subtitle2" sx={{ color: '#10B981', fontWeight: 700 }}>
                                Fair Chance Employer
                              </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {selectedJob.fairChanceNotes || 'This employer considers candidates with criminal records and values second chances.'}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </motion.div>
                  </Box>

                  {/* Match Score Circle */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: `conic-gradient(${getScoreColor(analysis.matchPercentage)} ${analysis.matchPercentage * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          background: 'rgba(15, 15, 35, 0.95)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 800,
                            color: getScoreColor(analysis.matchPercentage),
                          }}
                        >
                          {analysis.matchPercentage}%
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </Box>

                {/* Action Items */}
                {analysis.actionItems && analysis.actionItems.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <RocketLaunchIcon sx={{ color: 'primary.main' }} />
                        Your Next Steps
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {analysis.actionItems.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 2,
                                p: 2,
                                borderRadius: 2,
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                              }}
                            >
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                }}
                              >
                                {index + 1}
                              </Box>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {item}
                              </Typography>
                            </Box>
                          </motion.div>
                        ))}
                      </Box>
                    </Box>
                  </motion.div>
                )}
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
                            {analysis.missingSkills.length} skills needed • sorted by demand
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
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {analysis.prioritizedMissingSkills.map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 + index * 0.05 }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  p: 1.5,
                                  borderRadius: 2,
                                  background: item.isHot
                                    ? 'rgba(239, 68, 68, 0.1)'
                                    : 'rgba(245, 158, 11, 0.1)',
                                  border: item.isHot
                                    ? '1px solid rgba(239, 68, 68, 0.3)'
                                    : '1px solid rgba(245, 158, 11, 0.2)',
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                  {item.isHot && (
                                    <LocalFireDepartmentIcon sx={{ fontSize: 18, color: '#EF4444' }} />
                                  )}
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: item.isHot ? 600 : 400,
                                      color: item.isHot ? '#EF4444' : 'warning.light',
                                      textTransform: 'capitalize',
                                    }}
                                  >
                                    {item.skill}
                                  </Typography>
                                </Box>
                                {item.demand > 0 && (
                                  <Chip
                                    size="small"
                                    label={item.isHot ? `${item.demand} jobs want this` : `${item.demand} job`}
                                    sx={{
                                      background: item.isHot
                                        ? 'rgba(239, 68, 68, 0.2)'
                                        : 'rgba(255,255,255,0.1)',
                                      color: item.isHot ? '#EF4444' : 'text.secondary',
                                      fontSize: '0.65rem',
                                      height: 20,
                                    }}
                                  />
                                )}
                              </Box>
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

      {/* Insights Section */}
      {topSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card sx={{ mt: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <InsightsIcon sx={{ color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    In-Demand Skills
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Most requested skills across your saved jobs
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {topSkills.map(([skill, count], index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Chip
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span style={{ textTransform: 'capitalize' }}>{skill}</span>
                          <Box
                            sx={{
                              background: 'rgba(255, 255, 255, 0.2)',
                              borderRadius: 1,
                              px: 0.75,
                              py: 0.25,
                              fontSize: '0.7rem',
                              fontWeight: 600,
                            }}
                          >
                            {count}
                          </Box>
                        </Box>
                      }
                      sx={{
                        background: index === 0
                          ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.3) 100%)'
                          : 'rgba(139, 92, 246, 0.15)',
                        border: index === 0
                          ? '1px solid rgba(139, 92, 246, 0.5)'
                          : '1px solid rgba(139, 92, 246, 0.3)',
                        color: 'white',
                        py: 2,
                        px: 1,
                      }}
                    />
                  </motion.div>
                ))}
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Box>
  );
}

export default ComparisonView;
