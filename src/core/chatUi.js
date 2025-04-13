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
        <Card className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 shadow-lg rounded-2xl">
  <CardHeader>
    <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Room Chat</CardTitle>
    <CardDescription className="text-sm text-zinc-600 dark:text-zinc-400">Users can chat</CardDescription>
  </CardHeader>

  <CardContent>
    <ScrollArea
      ref={scrollRef}
      className="h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-400 dark:scrollbar-thumb-zinc-600 scrollbar-track-transparent"
    >
      {recieveMessage.map((message) => {
        if (!message.id) return;
        let time = new Date(message.sent_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        const isOwnMessage = message.sender_username === username;

        return (
          <div
            key={message.id}
            className={cn(
              "flex p-1 my-1 w-full",
              isOwnMessage ? "justify-end" : "justify-start"
            )}
          >
            <div className="relative flex flex-col max-w-[80%]">
              <p
                className={cn(
                  "text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-1",
                  isOwnMessage ? "text-right" : "text-left"
                )}
              >
                {message.sender_username}
              </p>

              <Card
                className={cn(
                  "rounded-xl text-sm break-words relative border",
                  isOwnMessage
                    ? "bg-zinc-900 text-zinc-100 border-zinc-700 after:absolute after:-right-2 after:top-2 after:w-0 after:h-0 after:border-l-8 after:border-l-zinc-900 after:border-t-8 after:border-t-transparent after:border-b-8 after:border-b-transparent"
                    : "bg-white text-zinc-900 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700 after:absolute after:-left-2 after:top-2 after:w-0 after:h-0 after:border-r-8 after:border-r-white dark:after:border-r-zinc-800 after:border-t-8 after:border-t-transparent after:border-b-8 after:border-b-transparent"
                )}
              >
                <CardContent className="p-3 flex flex-col gap-1">
                  <p className="text-sm leading-tight break-words">{message.content}</p>
                  <div className="text-[10px] text-right text-zinc-400">{time}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      })}
    </ScrollArea>
  </CardContent>

  <Separator className="bg-zinc-300 dark:bg-zinc-700" />

  <CardFooter className="flex justify-between items-center gap-4 p-4">
    <form onSubmit={handleSubmit} className="flex-grow">
      <Input
        id="roomId"
        ref={inputRef}
        placeholder="Type a message..."
        className="w-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 rounded-md p-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </form>
    <Button
      onClick={handleSubmitBtn}
      className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 px-4 py-2 rounded-md"
    >
      Send
    </Button>
  </CardFooter>
</Card>


    );
};

export default ChatUI;