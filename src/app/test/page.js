"use client"
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function FreeSolo() {
  const [userKeyword, setUserKeyword] = React.useState('');
  const [userSuggestions, setUserSuggestions] = React.useState([]);
  const [typingTimeout, setTypingTimeout] = React.useState(null);

  // Function to fetch user suggestions
  const fetchUserData = React.useCallback(async () => {
    try {
      const token = Cookies.get("jwt_token");
      const options = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST || "http://localhost:3009"}/wb/get/users/${userKeyword}`,
        options
      );

      console.log("API Response:", response.data);
      setUserSuggestions(response.data.data.users || []);
    } catch (err) {
      console.error("Fetch user data failed", err);
    }
  }, [userKeyword]);

  // Delay API call by 500ms after user stops typing
  React.useEffect(() => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      if (userKeyword.trim() !== '') {
        fetchUserData();
      }
    }, 500); // 500ms delay

    setTypingTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [userKeyword, fetchUserData]);

  // Handle input change
  const handleInputChange = (event, newValue) => {
    setUserKeyword(newValue);
  };

  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Autocomplete
        id="free-solo-demo"
        freeSolo
        options={userSuggestions.map((user) => user.username || "")}
        renderInput={(params) => <TextField {...params} label="Search users" />}
        onInputChange={handleInputChange} // Detects user input
        value={userKeyword}
      />
    </Stack>
  );
}
