'use client'; 
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, Paper, Alert, CircularProgress } from '@mui/material';
import { jwtDecode } from "jwt-decode";

type Profile = {
  username: string;
  email: string;
};

const fetchProfileDetails = async (userId: string): Promise<Profile> => {
  const response = await fetch(`/api/profile/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch profile details');
  }
  return await response.json();
};

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string>('');
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const userId = decoded.userId;

        fetchProfileDetails(userId)
          .then((data) => {
            setProfile(data);
            setUpdatedProfile(data);
            setLoading(false);
          })
          .catch((err) => {
            setError(err.message);
            setLoading(false);
          });
      } catch (err) {
        setError('Invalid token');
        setLoading(false);
      }
    } else {
      setError('No token found');
      setLoading(false);
    }
  }, []);

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (updatedProfile) {
      setUpdatedProfile({ ...updatedProfile, [event.target.name]: event.target.value });
    }
  };

  const handleSave = async () => {
    try {
    const response=  await fetch('/api/profile/update', { method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
         body: JSON.stringify(updatedProfile) });
         if (!response.ok) {
          throw new Error('Failed to update profile');
        }
        const responseJson = await response.json();
      setProfile(responseJson.data);
      setEditMode(false);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Home
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <CircularProgress />
      ) : profile ? (
        <Paper sx={{ padding: 3, width: '100%', maxWidth: 500 }}>
          <Typography variant="h6" gutterBottom>
            Profile Details
          </Typography>
          {editMode ? (
            <>
              <TextField
                label="Name"
                name="username"
                value={updatedProfile?.username}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                name="email"
                value={updatedProfile?.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
                Save
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleEditToggle} sx={{ mt: 2, marginLeft: '20px' }}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Typography>Name: {profile.username}</Typography>
              <Typography>Email: {profile.email}</Typography>
              <Button variant="contained" color="primary" onClick={handleEditToggle} sx={{ mt: 2 }}>
                Edit Profile
              </Button>
            </>
          )}
        </Paper>
      ) : (
        <Typography>Loading Profile Data...</Typography>
      )}
    </Box>
  );
}
