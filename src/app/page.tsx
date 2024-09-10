'use client';
import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";


type Profile = {
  username: string; 
  email: string;
};
type DecodedToken = {
  userId: string;
}
//fetch profile data
const fetchProfileDetails = async (userId: string): Promise<Profile> => {
  try {
    console.log("line 16")
    const response = await fetch(`/api/profile/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      const errorMessage = `Failed to fetch profile details. Status: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }
    return await response.json();
  } catch (err) {
    console.error('Error fetching profile details:', err);
    throw new Error('Error fetching profile details');
  }
};

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token)
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const userId = decoded.userId; 
        fetchProfileDetails(userId)
          .then((data) => setProfile(data))
          .catch((err) => setError(err.message));
      } catch (err) {
        console.log(err)
        setError('Invalid token');
      }
    } else {
      setError('No token found');
    }
  }, []);

  return (
    <div>
      <h1>Home</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {profile ? (
        <div>
          <h2>Profile Details:</h2>
          <p>Name: {profile.username}</p>
          <p>Email: {profile.email}</p>
        </div>
      ) : (
        !error && <p>Loading profile details...</p>
      )}
    </div>
  );
}
