import React from 'react';
import { Box, Container, Typography, Button, Paper, Grid } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function HeroSection({ onGetStarted }) {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 8,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Know if you're qualified before you apply
            </Typography>
            <Typography variant="h6" paragraph sx={{ opacity: 0.9, mb: 4 }}>
              Compare your resume against any job posting in seconds. Get an instant match score and see exactly what skills you're missing.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={onGetStarted}
                sx={{
                  backgroundColor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                }}
              >
                Try it now
              </Button>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                No signup required
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={4} sx={{ p: 4, backgroundColor: 'rgba(255,255,255,0.95)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'warning.main' }}>⚠</Typography>
                <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                  The Problem
                </Typography>
              </Box>
              <Typography variant="h2" sx={{ color: 'primary.main', fontWeight: 700, mb: 2 }}>
                98%
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                of applications go to jobs you're not qualified for
              </Typography>

              <Grid container spacing={2}>
                {[
                  { icon: <AccessTimeIcon />, title: 'Save 10+ hours/week', subtitle: 'Stop wasting time' },
                  { icon: <TrendingUpIcon />, title: '3x response rate', subtitle: 'Better results' },
                  { icon: <CheckCircleIcon />, title: 'Higher confidence', subtitle: 'Ace interviews' },
                ].map((benefit, index) => (
                  <Grid item xs={12} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ color: 'primary.main' }}>{benefit.icon}</Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {benefit.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {benefit.subtitle}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default HeroSection;
