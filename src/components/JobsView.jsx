import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';

function JobsView() {
  const [jobs, setJobs] = useState([]);
  const [currentJob, setCurrentJob] = useState({
    title: '',
    company: '',
    location: '',
    url: '',
    description: '',
    requirements: '',
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = () => {
    const stored = localStorage.getItem('app_jobs');
    if (stored) {
      setJobs(JSON.parse(stored));
    }
  };

  const saveJobs = (updatedJobs) => {
    localStorage.setItem('app_jobs', JSON.stringify(updatedJobs));
    setJobs(updatedJobs);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      const updatedJobs = jobs.map((j) => (j.id === editId ? { ...currentJob, id: editId } : j));
      saveJobs(updatedJobs);
      setEditId(null);
    } else {
      const newJob = { ...currentJob, id: Date.now() };
      saveJobs([...jobs, newJob]);
    }

    resetForm();
  };

  const resetForm = () => {
    setCurrentJob({
      title: '',
      company: '',
      location: '',
      url: '',
      description: '',
      requirements: '',
    });
  };

  const handleDelete = (id) => {
    const updatedJobs = jobs.filter((j) => j.id !== id);
    saveJobs(updatedJobs);
  };

  const handleEdit = (job) => {
    setCurrentJob(job);
    setEditId(job.id);
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            Add Job Posting
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Job Title"
                  required
                  placeholder="e.g., Senior Software Engineer"
                  value={currentJob.title}
                  onChange={(e) => setCurrentJob({ ...currentJob, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company"
                  required
                  placeholder="e.g., Tech Corp Inc."
                  value={currentJob.company}
                  onChange={(e) => setCurrentJob({ ...currentJob, company: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  placeholder="e.g., Remote, San Francisco, CA"
                  value={currentJob.location}
                  onChange={(e) => setCurrentJob({ ...currentJob, location: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Job Posting URL"
                  type="url"
                  placeholder="https://..."
                  value={currentJob.url}
                  onChange={(e) => setCurrentJob({ ...currentJob, url: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Job Description"
                  placeholder="Paste the full job description here"
                  value={currentJob.description}
                  onChange={(e) => setCurrentJob({ ...currentJob, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Requirements & Qualifications"
                  required
                  placeholder="List the required skills, experience, and qualifications from the job posting"
                  value={currentJob.requirements}
                  onChange={(e) => setCurrentJob({ ...currentJob, requirements: e.target.value })}
                  helperText="Include all technical skills, years of experience, education requirements, etc."
                />
              </Grid>
            </Grid>

            <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 2 }}>
              {editId ? 'Update Job Posting' : 'Save Job Posting'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            Job Postings
          </Typography>
          {jobs.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No job postings saved yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add your first job above!
              </Typography>
            </Box>
          ) : (
            <List>
              {jobs.map((job) => (
                <ListItem
                  key={job.id}
                  sx={{ border: 1, borderColor: 'divider', borderRadius: 2, mb: 2, flexDirection: 'column', alignItems: 'flex-start' }}
                >
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {job.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {job.company}
                      </Typography>
                      {job.location && (
                        <Chip label={job.location} size="small" sx={{ mt: 1 }} />
                      )}
                      {job.url && (
                        <Box sx={{ mt: 1 }}>
                          <Button
                            size="small"
                            startIcon={<LinkIcon />}
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Posting
                          </Button>
                        </Box>
                      )}
                    </Box>
                    <Box>
                      <IconButton onClick={() => handleEdit(job)} sx={{ mr: 1 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(job.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default JobsView;
