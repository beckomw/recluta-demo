import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

function Header() {
  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'rgba(15, 15, 35, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ height: 70, justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
              }}
            >
              <AutoAwesomeIcon sx={{ color: 'white', fontSize: 22 }} />
            </Box>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
              }}
            >
              Recluta
            </Typography>
          </Box>
        </motion.div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
