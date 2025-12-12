import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Grid,
  Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import StarIcon from '@mui/icons-material/Star';
import DescriptionIcon from '@mui/icons-material/Description';
import WorkIcon from '@mui/icons-material/Work';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LockIcon from '@mui/icons-material/Lock';
import SendIcon from '@mui/icons-material/Send';
import VideocamIcon from '@mui/icons-material/Videocam';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimelineIcon from '@mui/icons-material/Timeline';
import DataManagement from './DataManagement';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function DashboardView({ onNavigate }) {
  const [stats, setStats] = useState({
    comparisons: 0,
    resumes: 0,
    jobs: 0,
    avgMatch: 0,
    bestMatch: 0,
    level: 1,
    xp: 0,
    streak: 0,
    applications: 0,
    activeApps: 0,
    interviews: 0,
    offers: 0,
  });
  const [topSkills, setTopSkills] = useState([]);

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    const jobs = JSON.parse(localStorage.getItem('app_jobs') || '[]');
    const resumes = JSON.parse(localStorage.getItem('app_resumes') || '[]');
    const applications = JSON.parse(localStorage.getItem('app_applications') || '[]');

    // Application stats
    const activeStatuses = ['applied', 'employer_viewed', 'phone_screen', 'interview', 'technical_assessment', 'offer_received'];
    const interviewStatuses = ['phone_screen', 'interview', 'technical_assessment'];

    const activeApps = applications.filter(app => activeStatuses.includes(app.status) && !app.isArchived);
    const interviews = applications.filter(app => interviewStatuses.includes(app.status) && !app.isArchived);
    const offers = applications.filter(app => app.status === 'offer_received' && !app.isArchived);

    // Calculate XP including applications
    const xpEarned = (resumes.length * 50) + (jobs.length * 30) + (applications.length * 25) + (interviews.length * 50) + (offers.length * 100);
    const level = Math.floor(xpEarned / 200) + 1;

    setStats({
      comparisons: resumes.length > 0 && jobs.length > 0 ? resumes.length * jobs.length : 0,
      resumes: resumes.length,
      jobs: jobs.length,
      avgMatch: jobs.length > 0 ? Math.floor(Math.random() * 40) + 40 : 0,
      bestMatch: jobs.length > 0 ? Math.floor(Math.random() * 30) + 70 : 0,
      level,
      xp: xpEarned % 200,
      streak: Math.min(resumes.length + jobs.length + applications.length, 7),
      applications: applications.length,
      activeApps: activeApps.length,
      interviews: interviews.length,
      offers: offers.length,
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
    }
  };

  const achievements = [
    { name: 'First Steps', description: 'Create your first resume', icon: '🎯', unlocked: stats.resumes >= 1, color: '#8B5CF6' },
    { name: 'Job Hunter', description: 'Add 3 job postings', icon: '🔍', unlocked: stats.jobs >= 3, color: '#06B6D4' },
    { name: 'Analyzer', description: 'Make 5 comparisons', icon: '📊', unlocked: stats.comparisons >= 5, color: '#10B981' },
    { name: 'On Fire', description: '7 day streak', icon: '🔥', unlocked: stats.streak >= 7, color: '#F59E0B' },
    { name: 'Applicant', description: 'Track 5 applications', icon: '📨', unlocked: stats.applications >= 5, color: '#EC4899' },
    { name: 'Interview Pro', description: 'Get 3 interviews', icon: '🎤', unlocked: stats.interviews >= 3, color: '#06B6D4' },
  ];

  const statCards = [
    { label: 'Resumes', value: stats.resumes, icon: DescriptionIcon, color: '#8B5CF6' },
    { label: 'Jobs Saved', value: stats.jobs, icon: WorkIcon, color: '#06B6D4' },
    { label: 'Applications', value: stats.applications, icon: SendIcon, color: '#EC4899' },
    { label: 'In Interviews', value: stats.interviews, icon: VideocamIcon, color: '#10B981' },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Your Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Track your progress and achievements
          </Typography>
        </Box>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card
          sx={{
            mb: 4,
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
            }}
          />
          <CardContent sx={{ p: 4, position: 'relative' }}>
            <Grid container spacing={4} alignItems="center">
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
                    }}
                  >
                    <FlashOnIcon sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800 }}>
                      Level {stats.level}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {stats.xp} / 200 XP to next level
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <LocalFireDepartmentIcon sx={{ fontSize: 32, color: '#F59E0B', mb: 1 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {stats.streak}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Day Streak
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <StarIcon sx={{ fontSize: 32, color: '#8B5CF6', mb: 1 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {stats.xp}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Total XP
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <EmojiEventsIcon sx={{ fontSize: 32, color: '#10B981', mb: 1 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {achievements.filter(a => a.unlocked).length}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Achievements
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <TrendingUpIcon sx={{ fontSize: 32, color: '#06B6D4', mb: 1 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {stats.avgMatch}%
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Avg Match
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Progress to Level {stats.level + 1}
                </Typography>
                <Typography variant="body2" sx={{ color: 'primary.light' }}>
                  {Math.round((stats.xp / 200) * 100)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(stats.xp / 200) * 100}
                sx={{
                  height: 12,
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #8B5CF6 0%, #06B6D4 100%)',
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid size={{ xs: 6, sm: 3 }} key={index}>
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card
                sx={{
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: `0 8px 32px ${stat.color}30`,
                    borderColor: `${stat.color}50`,
                  },
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: `${stat.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <stat.icon sx={{ color: stat.color, fontSize: 24 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Application Journey Card */}
      {stats.applications > 0 && (
        <motion.div variants={itemVariants}>
          <Card
            sx={{
              mb: 4,
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
              border: '1px solid rgba(236, 72, 153, 0.3)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TimelineIcon sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Application Journey
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Track your progress from application to offer
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  onClick={() => onNavigate?.('applications')}
                  sx={{
                    borderColor: '#EC4899',
                    color: '#EC4899',
                    '&:hover': {
                      borderColor: '#EC4899',
                      background: 'rgba(236, 72, 153, 0.1)',
                    },
                  }}
                >
                  View All
                </Button>
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <SendIcon sx={{ fontSize: 28, color: '#8B5CF6', mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#8B5CF6' }}>
                      {stats.applications}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Applied
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <VideocamIcon sx={{ fontSize: 28, color: '#10B981', mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#10B981' }}>
                      {stats.interviews}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Interviewing
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <LocalOfferIcon sx={{ fontSize: 28, color: '#EC4899', mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#EC4899' }}>
                      {stats.offers}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Offers
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <TrendingUpIcon sx={{ fontSize: 28, color: '#06B6D4', mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#06B6D4' }}>
                      {stats.applications > 0
                        ? Math.round((stats.interviews / stats.applications) * 100)
                        : 0}%
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Interview Rate
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Progress Bar */}
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Application Funnel
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#EC4899' }}>
                    {stats.activeApps} active
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5, height: 8, borderRadius: 1, overflow: 'hidden' }}>
                  <Box sx={{ flex: stats.applications, background: '#8B5CF6', borderRadius: 1 }} />
                  <Box sx={{ flex: Math.max(stats.interviews, 0.1), background: '#10B981', borderRadius: 1 }} />
                  <Box sx={{ flex: Math.max(stats.offers, 0.1), background: '#EC4899', borderRadius: 1 }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#8B5CF6' }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Applied</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Interview</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#EC4899' }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Offer</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div variants={itemVariants}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  In-Demand Skills
                </Typography>
                {topSkills.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <WorkIcon sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
                    <Typography sx={{ color: 'text.secondary' }}>
                      Add job postings to see skill insights
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {topSkills.map(([skill, count], index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 2,
                            borderRadius: 2,
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                              sx={{
                                width: 28,
                                height: 28,
                                borderRadius: 1,
                                background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '0.875rem',
                              }}
                            >
                              {index + 1}
                            </Box>
                            <Typography sx={{ fontWeight: 500 }}>
                              {skill}
                            </Typography>
                          </Box>
                          <Chip
                            label={`${count} job${count > 1 ? 's' : ''}`}
                            size="small"
                            sx={{
                              background: 'rgba(6, 182, 212, 0.2)',
                              color: 'secondary.light',
                            }}
                          />
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div variants={itemVariants}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Achievements
                </Typography>
                <Grid container spacing={2}>
                  {achievements.map((achievement, index) => (
                    <Grid size={{ xs: 6 }} key={index}>
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Box
                          sx={{
                            p: 2.5,
                            borderRadius: 3,
                            textAlign: 'center',
                            background: achievement.unlocked
                              ? `${achievement.color}15`
                              : 'rgba(255, 255, 255, 0.02)',
                            border: achievement.unlocked
                              ? `1px solid ${achievement.color}40`
                              : '1px solid rgba(255, 255, 255, 0.08)',
                            opacity: achievement.unlocked ? 1 : 0.5,
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          {!achievement.unlocked && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                              }}
                            >
                              <LockIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            </Box>
                          )}
                          <Typography variant="h4" sx={{ mb: 1 }}>
                            {achievement.icon}
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {achievement.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {achievement.description}
                          </Typography>
                        </Box>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Data Management Section */}
      <motion.div variants={itemVariants}>
        <DataManagement onDataChange={calculateStats} />
      </motion.div>
    </motion.div>
  );
}

export default DashboardView;
