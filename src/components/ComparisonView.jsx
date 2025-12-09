import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  CircularProgress,
  Paper,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

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
    if (matchPercentage >= 80) {
      message = 'Excellent match! You should definitely apply.';
    } else if (matchPercentage >= 60) {
      message = 'Good match. Consider learning the missing skills.';
    } else if (matchPercentage >= 40) {
      message = 'Moderate match. You may need significant upskilling.';
    } else {
      message = 'Low match. This role may not be suitable yet.';
    }

    setAnalysis({
      matchPercentage,
      message,
      matchingSkills,
      missingSkills,
    });
  };

  useEffect(() => {
    if (selectedResume && selectedJob) {
      compareResumeToJob();
    }
  }, [selectedResume, selectedJob]);

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Select Resume
              </Typography>
              {resumes.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography color="text.secondary">
                    No resumes available. Create a resume first!
                  </Typography>
                </Box>
              ) : (
                <List>
                  {resumes.map((resume) => (
                    <ListItem key={resume.id} disablePadding>
                      <ListItemButton
                        selected={selectedResume?.id === resume.id}
                        onClick={() => setSelectedResume(resume)}
                        sx={{ borderRadius: 1, mb: 1 }}
                      >
                        <ListItemText
                          primary={resume.title}
                          secondary={`${resume.firstName} ${resume.lastName}`}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Select Job
              </Typography>
              {jobs.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography color="text.secondary">
                    No jobs available. Add a job posting first!
                  </Typography>
                </Box>
              ) : (
                <List>
                  {jobs.map((job) => (
                    <ListItem key={job.id} disablePadding>
                      <ListItemButton
                        selected={selectedJob?.id === job.id}
                        onClick={() => setSelectedJob(job)}
                        sx={{ borderRadius: 1, mb: 1 }}
                      >
                        <ListItemText
                          primary={job.title}
                          secondary={job.company}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {analysis && (
        <Box sx={{ mt: 3 }}>
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 150,
                height: 150,
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)',
                mb: 2,
              }}
            >
              <Typography variant="h2" fontWeight={700}>
                {analysis.matchPercentage}%
              </Typography>
            </Box>
            <Typography variant="h6" gutterBottom>
              Match Score
            </Typography>
            <Typography variant="body1">{analysis.message}</Typography>
          </Paper>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight={600}>
                Skills Gap Analysis
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CheckCircleIcon color="success" />
                    <Typography variant="h6">Your Matching Skills</Typography>
                  </Box>
                  {analysis.matchingSkills.length === 0 ? (
                    <Typography color="text.secondary">No matching skills found</Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {analysis.matchingSkills.map((skill, index) => (
                        <Chip key={index} label={skill} color="success" />
                      ))}
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <WarningIcon color="warning" />
                    <Typography variant="h6">Skills You're Missing</Typography>
                  </Box>
                  {analysis.missingSkills.length === 0 ? (
                    <Typography color="text.secondary">
                      Great! You have all required skills.
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {analysis.missingSkills.map((skill, index) => (
                        <Chip key={index} label={skill} color="warning" />
                      ))}
                    </Box>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight={600}>
                Detailed Comparison
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Resume: {selectedResume.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedResume.firstName} {selectedResume.lastName}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Job: {selectedJob.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedJob.company}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}

export default ComparisonView;
