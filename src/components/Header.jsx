import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

function Header() {
  const [language, setLanguage] = useState('EN');

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'ES' : 'EN');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', color: 'text.primary', boxShadow: 1 }}>
      <Toolbar>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700, color: 'primary.main' }}>
          Recluta
        </Typography>
        <Button
          variant="outlined"
          startIcon={<LanguageIcon />}
          onClick={toggleLanguage}
          sx={{ borderRadius: 2 }}
        >
          {language}
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
