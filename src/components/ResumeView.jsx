import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function ResumeView() {
  const [resumes, setResumes] = useState([]);
  const [currentResume, setCurrentResume] = useState({
    firstName: '',
    lastName: '',
    email: '',
    zipcode: '',
    title: 'My Resume',
    summary: '',
    skills: '',
    experience: '',
  });
  const [pdfStatus, setPdfStatus] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = () => {
    const stored = localStorage.getItem('app_resumes');
    if (stored) {
      setResumes(JSON.parse(stored));
    }
  };

  const saveResumes = (updatedResumes) => {
    localStorage.setItem('app_resumes', JSON.stringify(updatedResumes));
    setResumes(updatedResumes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      const updatedResumes = resumes.map((r) => (r.id === editId ? { ...currentResume, id: editId } : r));
      saveResumes(updatedResumes);
      setEditId(null);
    } else {
      const newResume = { ...currentResume, id: Date.now() };
      saveResumes([...resumes, newResume]);
    }

    resetForm();
  };

  const resetForm = () => {
    setCurrentResume({
      firstName: '',
      lastName: '',
      email: '',
      zipcode: '',
      title: 'My Resume',
      summary: '',
      skills: '',
      experience: '',
    });
  };

  const handleDelete = (id) => {
    const updatedResumes = resumes.filter((r) => r.id !== id);
    saveResumes(updatedResumes);
  };

  const handleEdit = (resume) => {
    setCurrentResume(resume);
    setEditId(resume.id);
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setPdfStatus('Please upload a PDF file');
      return;
    }

    setPdfStatus('PDF upload feature requires pdf.js integration');
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            Resume Management
          </Typography>

          <Paper
            sx={{
              p: 3,
              mb: 3,
              border: '2px dashed',
              borderColor: 'primary.main',
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <input
              accept=".pdf"
              style={{ display: 'none' }}
              id="resume-pdf-upload"
              type="file"
              onChange={handlePdfUpload}
            />
            <label htmlFor="resume-pdf-upload">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                <Typography variant="h6">Click to upload PDF or drag and drop</Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload a PDF resume to auto-extract text, or fill out the form manually below.
                </Typography>
              </Box>
            </label>
            {pdfStatus && (
              <Alert severity="info" sx={{ mt: 2 }}>
                {pdfStatus}
              </Alert>
            )}
          </Paper>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  required
                  value={currentResume.firstName}
                  onChange={(e) => setCurrentResume({ ...currentResume, firstName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  required
                  value={currentResume.lastName}
                  onChange={(e) => setCurrentResume({ ...currentResume, lastName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  required
                  value={currentResume.email}
                  onChange={(e) => setCurrentResume({ ...currentResume, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Zipcode"
                  required
                  value={currentResume.zipcode}
                  onChange={(e) => setCurrentResume({ ...currentResume, zipcode: e.target.value })}
                />
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Resume Version
            </Typography>
            <TextField
              fullWidth
              label="Resume Title"
              value={currentResume.title}
              onChange={(e) => setCurrentResume({ ...currentResume, title: e.target.value })}
              sx={{ mb: 2 }}
            />

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Professional Summary
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Summary"
              placeholder="Brief overview of your professional background and goals"
              value={currentResume.summary}
              onChange={(e) => setCurrentResume({ ...currentResume, summary: e.target.value })}
              sx={{ mb: 2 }}
            />

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Skills
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Skills"
              required
              placeholder="Enter your skills, separated by commas (e.g., JavaScript, React, Node.js, Python, SQL)"
              value={currentResume.skills}
              onChange={(e) => setCurrentResume({ ...currentResume, skills: e.target.value })}
              helperText="Separate skills with commas. Be specific!"
              sx={{ mb: 2 }}
            />

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Work Experience
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Work Experience"
              placeholder="List your work experience, job titles, companies, and key responsibilities..."
              value={currentResume.experience}
              onChange={(e) => setCurrentResume({ ...currentResume, experience: e.target.value })}
              sx={{ mb: 2 }}
            />

            <Button type="submit" variant="contained" size="large" fullWidth>
              {editId ? 'Update Resume' : 'Save Resume'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            Saved Resumes
          </Typography>
          {resumes.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No resumes saved yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your first resume above!
              </Typography>
            </Box>
          ) : (
            <List>
              {resumes.map((resume) => (
                <ListItem
                  key={resume.id}
                  secondaryAction={
                    <Box>
                      <IconButton edge="end" onClick={() => handleEdit(resume)} sx={{ mr: 1 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" onClick={() => handleDelete(resume.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                  sx={{ border: 1, borderColor: 'divider', borderRadius: 2, mb: 1 }}
                >
                  <ListItemText
                    primary={resume.title}
                    secondary={`${resume.firstName} ${resume.lastName} - ${resume.email}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default ResumeView;
