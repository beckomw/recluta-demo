import React from 'react';
import { Box, Container, Typography, Button, Grid, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import StorageIcon from '@mui/icons-material/Storage';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import CodeIcon from '@mui/icons-material/Code';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SecurityIcon from '@mui/icons-material/Security';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { clearAllData } from '../services/dataService';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const privacyFeatures = [
  {
    icon: CloudOffIcon,
    title: 'No Backend',
    description: 'Recluta runs 100% in your browser. There are no servers receiving your data—because there are no servers at all.',
    color: '#8B5CF6',
  },
  {
    icon: StorageIcon,
    title: 'Local Storage Only',
    description: 'All your resumes, jobs, and preferences are stored in your browser\'s localStorage. Your data never leaves your device.',
    color: '#06B6D4',
  },
  {
    icon: VisibilityOffIcon,
    title: 'No Tracking or Analytics',
    description: 'We don\'t use Google Analytics, Facebook Pixel, or any tracking scripts. Your usage is completely private.',
    color: '#10B981',
  },
  {
    icon: PersonOffIcon,
    title: 'No Accounts or Login',
    description: 'No email required. No passwords. No user profiles on our end. You stay completely anonymous.',
    color: '#F59E0B',
  },
  {
    icon: CodeIcon,
    title: 'Open Source',
    description: 'Our code is public. You can inspect exactly how Recluta works and verify our privacy claims yourself.',
    color: '#EC4899',
  },
  {
    icon: DeleteForeverIcon,
    title: 'Easy Data Deletion',
    description: 'One click to erase everything. Your browser, your data, your control. No hoops to jump through.',
    color: '#EF4444',
  },
];

function PrivacyPage({ onNavigate }) {
  const handleEraseAllData = () => {
    if (window.confirm('This will permanently delete ALL your data including resumes, jobs, and applications. This cannot be undone. Continue?')) {
      clearAllData();
      localStorage.removeItem('app_first_launch_shown');
      window.location.reload();
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Back button */}
          <motion.div variants={itemVariants}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => onNavigate('resume')}
              sx={{ mb: 3, color: 'text.secondary' }}
            >
              Back to App
            </Button>
          </motion.div>

          {/* Header */}
          <motion.div variants={itemVariants}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Chip
                icon={<SecurityIcon sx={{ fontSize: 16 }} />}
                label="Privacy-First by Design"
                sx={{
                  mb: 2,
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#10B981',
                  fontWeight: 600,
                  '& .MuiChip-icon': { color: '#10B981' },
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2rem', md: '3rem' },
                  mb: 2,
                }}
              >
                Why Recluta is{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Safe
                </Box>
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}
              >
                Your career data is sensitive. We built Recluta so you never have to trust us with it.
              </Typography>
            </Box>
          </motion.div>

          {/* Privacy Features Grid */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {privacyFeatures.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <motion.div variants={itemVariants}>
                  <Box
                    sx={{
                      p: 3,
                      height: '100%',
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        transform: 'translateY(-4px)',
                        borderColor: `${feature.color}40`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: `${feature.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <feature.icon sx={{ color: feature.color, fontSize: 24 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Technical Details */}
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                p: 4,
                borderRadius: 3,
                background: 'rgba(139, 92, 246, 0.05)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                mb: 4,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Technical Transparency
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Recluta is a static React application served from GitHub Pages. Here's what that means for you:
              </Typography>
              <Box component="ul" sx={{ color: 'text.secondary', pl: 2, '& li': { mb: 1 } }}>
                <li>
                  <Typography variant="body2">
                    <strong>No database</strong> — We don't have one. localStorage is the only persistence layer.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>No API calls</strong> — Network tab will show no outbound requests to any tracking or data collection endpoints.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>No cookies</strong> — Check your dev tools. Recluta sets zero cookies.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Fully auditable</strong> — Every line of code is public on GitHub.
                  </Typography>
                </li>
              </Box>
            </Box>
          </motion.div>

          {/* Actions */}
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button
                variant="contained"
                startIcon={<GitHubIcon />}
                href="https://github.com/beckomw/recluta-demo"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  px: 4,
                  py: 1.5,
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)',
                  },
                }}
              >
                View Source on GitHub
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteForeverIcon />}
                onClick={handleEraseAllData}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderColor: 'rgba(239, 68, 68, 0.5)',
                  '&:hover': {
                    borderColor: 'rgba(239, 68, 68, 0.8)',
                    background: 'rgba(239, 68, 68, 0.1)',
                  },
                }}
              >
                Erase All My Data
              </Button>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}

export default PrivacyPage;
