"use client"

import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";
import { ScrollArea } from '@radix-ui/react-scroll-area';

const ChatUI = ({ props }) => {
    const scrollRef = useRef(null);
    const inputRef = useRef(null);
    const { recieveMessage, username, setMessage, handleSubmit, message, handleChatOpen } = props

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            handleChatOpen()
        }
    }, [recieveMessage]);

    const handleSubmitBtn = (e) => {
        e.preventDefault();
        handleSubmit(e)
    }


    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Room Chat</CardTitle>
                <CardDescription>Users Can chat</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Ensure ScrollArea has a defined height and smooth scrolling */}
                <ScrollArea
                    ref={scrollRef}
                    className="h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent scrollbar-rounded-lg"
                >
                    {recieveMessage.map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                                "flex p-1 my-1 w-full",
                                message.userId === username ? "justify-end" : "justify-start"
                            )}
                        >
                            <div className="relative flex flex-col max-w-[80%]">
                                <p className={cn(
                                    "flex p-1 my-1 w-full text-[10px] font-semibold text-gray-500 mb-1",
                                    message.userId === username ? "justify-end" : "justify-start"
                                )}>{message.userId}</p>
                                <Card className={cn(
                                    "rounded-lg p-1 text-sm break-words relative",
                                    message.userId === username
                                        ? "bg-black text-white border border-gray-600 after:absolute after:-right-2 after:top-2 after:w-0 after:h-0 after:border-l-8 after:border-l-black after:border-t-8 after:border-t-transparent after:border-b-8 after:border-b-transparent"
                                        : "bg-white text-black border-gray-300 after:absolute after:-left-2 after:top-2 after:w-0 after:h-0 after:border-r-8 after:border-r-white after:border-t-8 after:border-t-transparent after:border-b-8 after:border-b-transparent"
                                )}>
                                    <CardContent className="p-2 flex flex-col gap-1">
                                        <p className="text-xs leading-tight break-words">{message.message}</p>
                                        <div className="text-[10px] text-right text-gray-400">{message.time}</div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </CardContent>
            <Separator />
            <CardFooter className="flex justify-between gap-4">
                <form onSubmit={handleSubmit} className="flex-grow">
                    <Input
                        id="roomId"
                        ref={inputRef}
                        placeholder="Enter text here..."
                        className="w-full"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </form>
                <Button onClick={handleSubmitBtn}>Send</Button>
            </CardFooter>
        </Card>

    );
};

export default ChatUI;