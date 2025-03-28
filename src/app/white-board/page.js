"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const JoinRoom = () => {
    const [roomId, setRoomId] = useState("");
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!roomId.trim()) {
            alert("Please enter a Room ID");
            return;
        }
        // Navigate to the whiteboard page with the given roomId
        router.push(`/white-board/${roomId}`);
    };

    return (
        <div className="flex-1 flex justify-center items-center relative w-[100%] h-[90vh]">
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Join a Room</CardTitle>
                <CardDescription>Enter a Room ID to start collaborating.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="roomId">Room ID</Label>
                        <Input
                            id="roomId"
                            placeholder="Enter Room ID"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                        />
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button onClick={handleSubmit}>Join</Button>
            </CardFooter>
            </Card>
            </div>
    );
};

export default JoinRoom;


