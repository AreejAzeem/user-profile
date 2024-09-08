import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Signup() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/login'); 
      } else {
        console.error('signup failed');
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Signup</h1>
      <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Sign Up</button>
    </form>
  );
}
