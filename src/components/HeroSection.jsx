import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import LockIcon from '@mui/icons-material/Lock';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const floatingVariants = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const benefits = [
  {
    icon: AccessTimeIcon,
    title: 'Competency Assessment',
    subtitle: 'Rigorous analysis of your qualifications against role requirements',
    color: '#8B5CF6',
  },
  {
    icon: CheckCircleIcon,
    title: 'Gap Analysis & Growth Path',
    subtitle: 'Identify skill gaps and receive targeted learning recommendations',
    color: '#06B6D4',
  },
  {
    icon: TrendingUpIcon,
    title: 'Evidence-Based Strategy',
    subtitle: 'Apply strategically where your profile demonstrates strongest alignment',
    color: '#10B981',
  },
];

function HeroSection({ onGetStarted }) {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 8, md: 12 },
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <motion.div variants={itemVariants}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 1,
                    borderRadius: 3,
                    background: 'rgba(139, 92, 246, 0.15)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    mb: 3,
                  }}
                >
                  <AutoGraphIcon sx={{ fontSize: 18, color: 'primary.light' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.light' }}>
                    Free • No signup required
                  </Typography>
                </Box>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                    fontWeight: 800,
                    lineHeight: 1.1,
                    mb: 3,
                  }}
                >
                  Assess. Learn.{' '}
                  <Box
                    component="span"
                    sx={{
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 50%, #EC4899 100%)',
                      backgroundSize: '200% 200%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      animation: 'gradient-shift 5s ease infinite',
                    }}
                  >
                    Advance.
                  </Box>
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.6,
                    mb: 4,
                    maxWidth: 520,
                    fontWeight: 400,
                  }}
                >
                  Analyze your fit, identify skill gaps, and build a focused development plan for your career goals.
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<RocketLaunchIcon />}
                      onClick={onGetStarted}
                      sx={{
                        py: 2,
                        px: 5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
                        boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
                        '&:hover': {
                          boxShadow: '0 12px 40px rgba(139, 92, 246, 0.6)',
                        },
                      }}
                    >
                      Start My Assessment — Free
                    </Button>
                  </motion.div>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Structured analysis to guide your professional development
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      mt: 1,
                    }}
                  >
                    <LockIcon sx={{ fontSize: 14, color: '#10B981' }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Private — your data stays in your browser
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <motion.div variants={floatingVariants} animate="animate">
                <Box
                  sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    p: 4,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: 'linear-gradient(90deg, #8B5CF6, #06B6D4, #EC4899)',
                    }}
                  />

                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h1" sx={{ fontWeight: 800, fontSize: '4rem' }}>
                      <Box
                        component="span"
                        sx={{
                          background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        250+
                      </Box>
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      average applicants per role
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                      Preparation and fit analysis improve your odds
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 2,
                            borderRadius: 2,
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.06)',
                              transform: 'translateX(5px)',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              width: 44,
                              height: 44,
                              borderRadius: 2,
                              background: `${benefit.color}20`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <benefit.icon sx={{ color: benefit.color, fontSize: 22 }} />
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {benefit.title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {benefit.subtitle}
                            </Typography>
                          </Box>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}

export default HeroSection;
