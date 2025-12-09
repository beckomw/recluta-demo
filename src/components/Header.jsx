import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { motion } from 'framer-motion';
import LanguageIcon from '@mui/icons-material/Language';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

function Header() {
  const [language, setLanguage] = useState('EN');
  const [anchorEl, setAnchorEl] = useState(null);

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'ES' : 'EN');
  };

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
      <Toolbar sx={{ height: 80, justifyContent: 'space-between' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
              }}
            >
              <AutoAwesomeIcon sx={{ color: 'white', fontSize: 24 }} />
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
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.light' }}>
                BETA
              </Typography>
            </Box>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<LanguageIcon />}
              onClick={toggleLanguage}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                borderRadius: 2.5,
                px: 2.5,
                '&:hover': {
                  borderColor: 'rgba(139, 92, 246, 0.5)',
                  background: 'rgba(139, 92, 246, 0.1)',
                },
              }}
            >
              {language}
            </Button>
          </Box>
        </motion.div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
