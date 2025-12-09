import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';

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
        backgroundColor: '#1a1a1a',
        color: 'white',
        py: 3,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2">
            © 2024 Recluta - Application Readiness Platform
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={handleResetData}
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.3)',
              '&:hover': {
                borderColor: 'white',
              },
            }}
          >
            Reset All Data
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
