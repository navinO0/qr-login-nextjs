
"use client";
import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import clearToken from "@/core/removeToken";
import Cookies from "js-cookie";
import axios from "axios";
import ErroToaster from "@/core/errorToaster";
import useProtectedRoute from "@/core/protectedRoute";

const JoinRoom = () => {
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error,setError] = useState(null)
  const router = useRouter()
  useProtectedRoute()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null)
    setIsLoading(true)
    if (!roomId || roomId.trimEnd().length === 0) {
      setError("Room ID is required!");
      setIsLoading(false)
    }
    try {
      setIsLoading(true);
      const token = Cookies.get("jwt_token");

      if (!token) {
        clearToken();
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_HOST || "http://127.0.0.1:3000"}/wb/room/join`,
        { room_id: roomId, password },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          validateStatus: () => true,
        }
      );

      if (response.status === 404) {
        setPasswordRequired(true);
      }
      if (response.status === 400 && response.data.code === "PASSWORD_REQUIRED") {
        setError("Since this is private room please enter password")
        setPasswordRequired(true);
      }

      if (response.status === 400&& response.data.code === "INVALID_PASSWORD") {
        setError("Invalid password please try again.")
      }

      if (response.status === 200) {
        router.push(`/white-board/${roomId}`)
      }

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }

    if (!roomId || (passwordRequired && !password)) {
      setError("Since Room is private, Room ID and Password are required!");
      return;
    }
  };
  useProtectedRoute()
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md shadow-2xl border border-slate-700 bg-slate-900 text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-white">🔗 Join a Collaboration Room</CardTitle>
          <CardDescription className="text-gray-400">
            Enter the room ID and password (if required) to start collaborating in real time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="roomId" className="text-gray-300">Room ID</Label>
              <Input
                id="roomId"
                className="bg-slate-800 text-white placeholder-gray-500 border-slate-700"
                placeholder="e.g. 1234-5678"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                required
              />
            </div>

            {passwordRequired && (
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password" className="text-gray-300">Room Password</Label>
                <Input
                  id="password"
                  type="password"
                  className="bg-slate-800 text-white placeholder-gray-500 border-slate-700"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Joining..." : "Join Room"}
          </Button>
        </CardFooter>
      </Card>
      {error && <ErroToaster message={error} />}
    </div>
  )
};

export default JoinRoom