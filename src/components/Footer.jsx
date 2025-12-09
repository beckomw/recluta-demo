import React from 'react';
import { Box, Container, Typography, Button, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import RefreshIcon from '@mui/icons-material/Refresh';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

function Footer() {
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      localStorage.removeItem('app_resumes');
      localStorage.removeItem('app_jobs');
      localStorage.removeItem('app_user_profile');
      window.location.reload();
    }
  };

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
                startIcon={<RefreshIcon />}
                onClick={handleResetData}
                sx={{
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                  color: 'error.light',
                  '&:hover': {
                    borderColor: 'rgba(239, 68, 68, 0.5)',
                    background: 'rgba(239, 68, 68, 0.1)',
                  },
                }}
              >
                Reset Data
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
