
"use client";
import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const JoinRoom = () => {
      const [roomId, setRoomId] = useState("");
      const [password, setPassword] = useState("");
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()
      const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true)
        // if (!roomId || !password) {
        //   alert("Room ID and Password are required!");
        //   return;
        // }
    
        // console.log("Joining Room:", { roomId, password, selectedUsers });
        // Here, you can send data to your backend API for joining the room
        router.push(`/white-board/${roomId}`)
      };
    return (
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
                    {passwordRequired && <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter Room Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleSubmit} cursor="pointer">{isLoading ? "Joining..." : "Join Room"}</Button>
        </CardFooter>
      </Card>
    )
};

export default JoinRoom