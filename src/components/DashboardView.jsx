import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import StarIcon from '@mui/icons-material/Star';

function DashboardView() {
  const [stats, setStats] = useState({
    comparisons: 0,
    jobs: 0,
    avgMatch: 0,
    bestMatch: 0,
    level: 1,
    xp: 0,
    streak: 0,
  });
  const [topSkills, setTopSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    const jobs = JSON.parse(localStorage.getItem('app_jobs') || '[]');
    const resumes = JSON.parse(localStorage.getItem('app_resumes') || '[]');

    setStats({
      comparisons: Math.floor(Math.random() * 20),
      jobs: jobs.length,
      avgMatch: jobs.length > 0 ? Math.floor(Math.random() * 100) : 0,
      bestMatch: jobs.length > 0 ? Math.floor(Math.random() * 100) : 0,
      level: 1,
      xp: 150,
      streak: 3,
    });

    if (jobs.length > 0) {
      const allSkills = jobs.flatMap((job) =>
        job.requirements.split(',').map((s) => s.trim()).filter((s) => s.length > 0)
      );

      const skillCounts = allSkills.reduce((acc, skill) => {
        acc[skill] = (acc[skill] || 0) + 1;
        return acc;
      }, {});

      const sorted = Object.entries(skillCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      setTopSkills(sorted);
      setMissingSkills(sorted.slice(0, 3));
    }
  };

  const achievements = [
    { name: 'First Steps', description: 'Create your first resume', icon: '🎯', unlocked: true },
    { name: 'Job Hunter', description: 'Add 5 job postings', icon: '🔍', unlocked: false },
    { name: 'Perfect Match', description: 'Get a 100% match score', icon: '💯', unlocked: false },
    { name: 'Consistent', description: 'Use the app 7 days in a row', icon: '🔥', unlocked: false },
  ];

  return (
    <Box>
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom fontWeight={700}>
            Your Job Search Journey
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
            Track your progress from preparation to success
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <FlashOnIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight={700}>
                  {stats.level}
                </Typography>
                <Typography variant="body2">Level</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <LocalFireDepartmentIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight={700}>
                  {stats.streak}
                </Typography>
                <Typography variant="body2">Day Streak</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <StarIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight={700}>
                  {stats.xp} / 500 XP
                </Typography>
                <Typography variant="body2">Experience</Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <LinearProgress
              variant="determinate"
              value={(stats.xp / 500) * 100}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'white',
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="primary" fontWeight={700}>
              {stats.comparisons}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Job Comparisons
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="primary" fontWeight={700}>
              {stats.jobs}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Jobs Analyzed
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#f0f4ff' }}>
            <Typography variant="h4" color="primary" fontWeight={700}>
              {stats.avgMatch}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Average Match
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#f0f4ff' }}>
            <Typography variant="h4" color="primary" fontWeight={700}>
              {stats.bestMatch}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Best Match
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Most In-Demand Skills
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Top skills across all jobs
              </Typography>
              {topSkills.length === 0 ? (
                <Typography color="text.secondary">Add job postings to see insights</Typography>
              ) : (
                <List>
                  {topSkills.map(([skill, count], index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={skill}
                        secondary={`Appears in ${count} job${count > 1 ? 's' : ''}`}
                      />
                      <Chip label={`#${index + 1}`} color="primary" size="small" />
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
                Skills to Learn
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Most common gaps
              </Typography>
              {missingSkills.length === 0 ? (
                <Typography color="text.secondary">Add job postings to see insights</Typography>
              ) : (
                <List>
                  {missingSkills.map(([skill, count], index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={skill}
                        secondary={`High demand skill`}
                      />
                      <Chip label="Learn" color="warning" size="small" />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Achievements
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Unlock badges by reaching milestones
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {achievements.map((achievement, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    opacity: achievement.unlocked ? 1 : 0.4,
                    border: achievement.unlocked ? 2 : 1,
                    borderColor: achievement.unlocked ? 'primary.main' : 'divider',
                  }}
                >
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    {achievement.icon}
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {achievement.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {achievement.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default DashboardView;
