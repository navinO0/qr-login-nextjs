"use client";
import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import ErroToaster from "@/core/errorToaster";

export default function RoomCard() {
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");
  const [userKeyword, setUserKeyword] = useState("");
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [error, setError] = useState(null)

  const router = useRouter()
  const fetchUserData = useCallback(async () => {
    try {
      const token = Cookies.get("jwt_token");
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      if (userKeyword.trim().length > 3) {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_HOST || "http://localhost:3009"}/wb/get/users/${userKeyword}`,
          options
        );

        setUserSuggestions(response.data.data.users || []);
      }

    } catch (err) {
      console.error("Fetch user data failed", err);
    }
  }, [userKeyword]);

  // Debounce user search API call (500ms delay)
  useEffect(() => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    if (userKeyword.trim() !== "") {
      const timeout = setTimeout(() => {
        fetchUserData();
      }, 500);

      setTypingTimeout(timeout);

      return () => clearTimeout(timeout);
    }
  }, [userKeyword, fetchUserData]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
setError(null)
    if (!roomId || !password) {
      alert("Room ID and Password are required!");
      return;
    }

    const token = Cookies.get("jwt_token");

    const requestBody = {
      room_id: roomId,
      password: password.length === 0 ? '' : password,
      is_private: password.length === 0 ? false : true,
      participants: selectedUsers.length === 0 ? [] : selectedUsers
    };



    try {
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }
      };

      const createResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_HOST || "http://localhost:3009"}/wb/room/create`,
        requestBody,
        options,
      );

      if (createResponse.status === 200) {
        console.log("Room created successfully:", createResponse.data);
        router.push(`/white-board/${roomId}`);
      }

      
    } catch (err) {
     setError(err?.response?.data?.message)
      console.error("Error creating room:", err);
    }

  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md shadow-2xl border border-slate-700 bg-slate-900 text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-white">🚀 Create a Room</CardTitle>
          <CardDescription className="text-gray-400">
            Set up a new collaboration space and invite team members instantly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="roomId" className="text-gray-300">Room ID</Label>
              <Input
                id="roomId"
                placeholder="Unique room identifier"
                className="bg-slate-800 text-white placeholder-gray-500 border-slate-700"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Optional room password"
                className="bg-slate-800 text-white placeholder-gray-500 border-slate-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="inviteUsers" className="text-gray-300">Invite Users</Label>
              <Stack spacing={1}>
                <Autocomplete
                  multiple
                  id="inviteUsers"
                  freeSolo
                  options={userSuggestions.map((user) => user.username || "")}
                  value={selectedUsers}
                  onInputChange={(event, newValue) => setUserKeyword(newValue)}
                  onChange={(event, newValue) => setSelectedUsers(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search & invite users"
                      variant="outlined"
                      sx={{
                        input: { color: 'white' },
                        label: { color: 'gray.300' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'gray',
                          },
                          '&:hover fieldset': {
                            borderColor: 'white',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'white',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'white',
                        },
                        '& .MuiAutocomplete-tag': {
                          backgroundColor: '#1f2937', 
                          color: 'white',
                        },
                      }}
                    />
                  )}
                />
              </Stack>
              {selectedUsers.length > 0 && (
                <p className="text-green-400 text-sm mt-1">
                  Selected: {selectedUsers.join(", ")}
                </p>
              )}
            </div>

          </form>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-700 transition-colors"
          >
            Create Room
          </Button>
        </CardFooter>
      </Card>
      {error && <ErroToaster message={error} />}
    </div>
  );
}
