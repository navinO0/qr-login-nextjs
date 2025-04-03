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

export default function RoomCard() {
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");
  const [userKeyword, setUserKeyword] = useState("");
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Fetch user suggestions with a delay
  const fetchUserData = useCallback(async () => {
    try {
      const token = Cookies.get("jwt_token");
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST || "http://localhost:3009"}/wb/get/users/${userKeyword}`,
        options
      );

      setUserSuggestions(response.data.data.users || []);
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
    
    if (!roomId || !password) {
      alert("Room ID and Password are required!");
      return;
    }
  
    const token = Cookies.get("jwt_token"); // ✅ Get token
  
    const requestBody = { 
      room_id : roomId, 
      password : password.length === 0 ? '' : password, 
      is_private : password.length === 0 ? false : true, 
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
  
      console.log("Room Created:", createResponse.data);
    } catch (err) {
      console.error("Error creating room:", err);
    }
  
    console.log("Joining Room:", { roomId, password, selectedUsers });
  };
  

  return (
    <div className="flex-1 flex justify-center items-center relative w-[100%] h-[90vh]">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Join a Room</CardTitle>
          <CardDescription>Enter details to start collaborating.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="roomId">Room ID</Label>
              <Input
                id="roomId"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter Room Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="inviteUsers" className="mb-2">Invite Users</Label>
              <Stack spacing={2} sx={{ width: "100%" }}>
                <Autocomplete
                  multiple
                  id="inviteUsers"
                  freeSolo
                  options={userSuggestions.map((user) => user.username || "")}
                  renderInput={(params) => <TextField {...params} label="Search and invite users" />}
                  onInputChange={(event, newValue) => setUserKeyword(newValue)}
                                  onChange={(event, newValue) => 
                                      setSelectedUsers(newValue)
                                  }
                  value={selectedUsers}
                />
                          </Stack>
                          <CardDescription>{ selectedUsers.length > 0 && `Selected Users: ${selectedUsers.join(", ")}`}</CardDescription>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleSubmit}>Create Room</Button>
        </CardFooter>
          </Card>
    </div>
  );
}
