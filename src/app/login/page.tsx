'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Box, Typography } from '@mui/material';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error ,setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); 
        router.push('/'); 
      } else {
        const errorData = await response.json();
        console.error('Login failed',errorData.message);
        setError(errorData.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
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
        backgroundColor: '#f0f0f0',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Login Page
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400 }}>
        <TextField
          label="Email"
          name="email"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </form>
    </Box>
  );
}
