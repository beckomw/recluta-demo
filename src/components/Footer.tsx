import React from 'react';
import { Box, Container, Typography, Button, IconButton, Link } from '@mui/material';
import { motion } from 'framer-motion';
import GitHubIcon from '@mui/icons-material/GitHub';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SecurityIcon from '@mui/icons-material/Security';
import StorageIcon from '@mui/icons-material/Storage';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import CodeIcon from '@mui/icons-material/Code';
import { clearAllData } from '../services/dataService';

function Footer({ onNavigateToPrivacy }) {
  const handleEraseAllData = () => {
    if (window.confirm('This will permanently delete ALL your data including resumes, jobs, and applications. This cannot be undone. Continue?')) {
      clearAllData();
      localStorage.removeItem('app_first_launch_shown');
      window.location.reload();
    }
  };

  const privacyPoints = [
    { icon: StorageIcon, text: 'Data stored locally in your browser' },
    { icon: CloudOffIcon, text: 'No data leaves your device' },
    { icon: VisibilityOffIcon, text: 'No analytics or tracking' },
    { icon: EmailIcon, text: 'Email collected only for newsletter updates' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(180deg, rgba(15, 15, 35, 0) 0%, rgba(15, 15, 35, 1) 100%)',
        pt: 8,
        pb: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        {/* Privacy Statement Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              background: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.15)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <SecurityIcon sx={{ color: '#10B981', fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#10B981' }}>
                Privacy-First by Design
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 1.5,
              }}
            >
              {privacyPoints.map((point, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <point.icon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.5)' }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {point.text}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              {onNavigateToPrivacy && (
                <Link
                  component="button"
                  onClick={onNavigateToPrivacy}
                  sx={{
                    color: '#10B981',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Why Recluta is safe →
                </Link>
              )}
              <Link
                href="https://github.com/beckomw/recluta-demo"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  '&:hover': { color: 'white' },
                }}
              >
                <GitHubIcon sx={{ fontSize: 16 }} />
                View source code
              </Link>
            </Box>
          </Box>
        </motion.div>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 4,
            py: 4,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AutoAwesomeIcon sx={{ color: 'white', fontSize: 18 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Recluta
              </Typography>
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: { xs: 'center', md: 'left' } }}>
              Know if you're qualified before you apply.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<DeleteForeverIcon />}
                onClick={handleEraseAllData}
                sx={{
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                  color: 'error.light',
                  '&:hover': {
                    borderColor: 'rgba(239, 68, 68, 0.5)',
                    background: 'rgba(239, 68, 68, 0.1)',
                  },
                }}
              >
                Erase All Data
              </Button>
            </Box>
          </motion.div>
        </Box>

        <Box
          sx={{
            textAlign: 'center',
            pt: 3,
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
            © {new Date().getFullYear()} Recluta. Built with passion for job seekers everywhere.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
