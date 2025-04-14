"use client";
import { v4 as uuidv4 } from 'uuid';
import { useRouter, useParams } from "next/navigation";
import { ReactSketchCanvas } from "react-sketch-canvas";
import React, { useRef, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { set, throttle } from "lodash";
import { MdOutlineUndo, MdOutlineSync, MdOutlineRedo, MdOutlineClear, MdOutlineDownload, MdOutlineQrCode2 } from "react-icons/md";
import { FaEraser, FaPen } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import parseToken from "@/core/parseJson";
import Cookies from "js-cookie";
import { io } from "socket.io-client";
import Qr_component from "@/core/qr_pop";
import { PopoverDemo } from "@/core/popover";
import useProtectedRoute from "@/core/protectedRoute";
import ChatUI from "../../../core/chatUi";
import ActiveUsers from "@/core/activeUsers";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { useUserContext } from "@/app/providers";
import getRandomColor from "@/core/getRandomColor";



let socket;


const CbWhiteBoard = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const cursorColors = useRef({});
    const [cursors, setCursors] = useState({});
    const [strokeColor, setStrokeColor] = useState(getRandomColor());
    const [strokeWidth, setStrokeWidth] = useState(4);
    const [eraser, setEraser] = useState(false);
    const [localPaths, setLocalPaths] = useState([]);
    const [lockedBy, setLockedBy] = useState(null);
    const params = useParams();
    const router = useRouter();
    const [username, setUsername] = useState(() => Math.floor(Math.random() * 100000));
    const roomId = params?.roomId;
    const [recieveMessage, setRecieveMessage] = useState([{ id: '', message: '', userId: "", time: "" }]);
    const [message, setMessage] = useState("Hey yooo");
    const [unreadCount, setUnreadCount] = useState(0);
    const [lastMessage, setLastMessage] = useState({});
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        if (!roomId) {
            router.push("/white-board/join");
        }
        const token = Cookies.get("jwt_token");
        if (!token) {
            Cookies.set("redirect", `/white-board/${roomId}`)
        }
    }, [roomId, router]);

    const loadRoomData = async () => {
        if (!roomId) {
            console.error("Room ID is not available");
            return;
        }

        try {
            const token = Cookies.get("jwt_token");

            if (!token) {
                console.error("No auth token found!");
                return;
            }

            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_HOST || "http://localhost:3009"}/wb/load/${roomId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );

                if (res.data.data && Array.isArray(res.data.data.messages) && res.data.data.messages.length > 0) {
                    setRecieveMessage((prevData) => [...prevData, ...res.data.data.messages]);
                }

                if (res.data.data && Array.isArray(res.data.data.drowData) && res.data?.data?.drowData?.length > 0) {
                    // setSketchHistory(res.data.data.drowData);  
                    setLocalPaths((prevPaths) => {
                        const updatedPaths = [...prevPaths || [], ...res.data.data.drowData || []];
                        requestAnimationFrame(() => {
                            canvasRef.current?.loadPaths(updatedPaths);
                        });
                        return updatedPaths;
                    });
                }

                // return res.data.data;
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    router.push("/session-expired");
                    removeToken();
                } else {
                    console.error("Error fetching whiteboard data:", error);
                }
            }



        } catch (error) {
            console.error("Failed to load room data:", error);
        }
    };


    useEffect(() => {
        if (!roomId) return;
        let userData = {}
        const token = Cookies.get("jwt_token");
        if (token) {
            userData = parseToken(token);
            setUsername(userData.username);
        }
        socket = io(process.env.NEXT_PUBLIC_HOST_SOCKET || process.env.NEXT_PUBLIC_HOST || "http://localhost:3008", {
            transports: ["websocket"],
            query: {
                username: userData.username || username,
            },
        });

        socket.emit("join-room", (roomId));
        loadRoomData();

        socket.on("draw", (compressedData) => {
            requestAnimationFrame(() => {
                if (canvasRef.current) {
                    setLocalPaths((prevPaths) => {
                        const updatedPaths = [...prevPaths, ...compressedData];
                        canvasRef.current.loadPaths(updatedPaths);
                        return updatedPaths;
                    });
                }
            });
        });

        socket.on("clear", () => {
            requestAnimationFrame(() => {
                canvasRef.current?.clearCanvas();
                setLocalPaths([]);
            });
        });

        socket.on("undo", () => {
            requestAnimationFrame(() => {
                canvasRef.current?.undo();
            });
        });

        socket.on("redo", () => {
            requestAnimationFrame(() => {
                canvasRef.current?.redo();
            });
        });

        socket.on("message", (data) => {
            setRecieveMessage((prevMessages) => [...prevMessages, data]);

            if (!isChatOpen) {
                setUnreadCount((prev) => prev + 1);
            }

            setLastMessage(data);
        });

        socket.on("cursor-move", ({ userId, cursor }) => {
            setCursors((prev) => ({ ...prev, [userId]: cursor }));
            if (!cursorColors.current[userId]) {
                cursorColors.current[userId] = `hsl(${Math.random() * 360}, 100%, 50%)`;
            }
        });

        return () => {
            socket.off("draw");
            socket.off("clear");
            socket.off("undo");
            socket.off("redo");
            socket.off("message");
            socket.off("cursor-move");
            socket.disconnect();
        };
    }, [roomId]);



    const handleDraw = useCallback(
        throttle(async () => {
            if (!canvasRef.current || lockedBy && lockedBy !== username) return;
            const paths = await canvasRef.current.exportPaths();
            const newStrokes = paths[paths.length - 1];
            socket.emit("draw", { roomId, userId: username || username || `user`, paths: [newStrokes] });
        }, 50),
        [username]
    );

    const handleSync = useCallback(
        throttle(async () => {
            if (!canvasRef.current) return;
            const paths = await canvasRef.current.exportPaths();
            socket.emit("draw", { roomId, paths });
        }, 500),
        [localPaths]
    );

    const handleMouseMove = useCallback(
        throttle((e) => {
            if (!containerRef.current) return;
            const { left, top } = containerRef.current.getBoundingClientRect();
            const cursor = { x: e.clientX - left, y: e.clientY - top };
            socket.emit("cursor-move", { roomId, userId: username || username || `user`, cursor });
        }, 5),
        [username]
    );


    function formatTime(number) {
        return number < 10 ? '0' + number : number;
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (message.trim() !== "") {
            const now = new Date();
            socket.emit("message", { id: uuidv4(), room_id: roomId, sender_username: username, content: message, sent_at: now });
            setMessage("")
        }
    };

    const handleTouchMove = useCallback(
        throttle((e) => {
            if (!containerRef.current) return;
            const { left, top } = containerRef.current.getBoundingClientRect();
            const touch = e.touches[0];
            const cursor = {
                x: touch.clientX - left,
                y: touch.clientY - top,
            };
            socket.emit("cursor-move", { roomId, userId: username || username || `user`, cursor });
        }, 5),
        [username]
    );

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;

        // Add mousemove and touchmove event listeners
        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("touchmove", handleTouchMove, { passive: true });

        // Cleanup event listeners
        return () => {
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("touchmove", handleTouchMove);
        };
    }, [handleMouseMove, handleTouchMove]);

    const handleChatOpen = () => {
        setUnreadCount(0);
        setIsChatOpen(true);
    };

    const exportImage = async (canvasInstance) => {
        if (!canvasInstance) return;

        try {
            const imageData = await canvasInstance.exportImage("png");
            const link = document.createElement("a");
            link.href = imageData;
            link.download = `whiteboard-${roomId}.png`;
            link.click();
        } catch (err) {
            console.error("Failed to export image:", err);
        }
    };

    useProtectedRoute()

    return (
        <div className="border-black h-full bg-gradient-to-br from-slate-900 to-slate-800">
            <div className=" flex justify-center items-center h-[100vh]">
                <div className="flex flex-col items-center p-2 w-[95%] h-[90%] border border-slate-700 bg-slate-900 rounded-tr-[10px] rounded-tl-[10px]">
                    <h2 className="text-2xl font-semibold mb-4 text-white">Collaborative Whiteboard</h2>
                    <span style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.73)',
                        opacity: 0.8,
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        fontSize: '14px',
                        fontFamily: 'monospace',
                        marginBottom: '10px'
                    }}>Room ID: {roomId}</span>
                    <div className="flex flex-wrap justify-end gap-3 mb-0 w-full border-b-0 sm:justify-center">

                        <Popover open={unreadCount > 0} className="!bg-transparent !shadow-none !border-none !p-0 !m-0 w-auto h-auto">
                            <PopoverContent side="top" align="end" className="!p-0 !m-0 w-auto h-auto">
                                <div className={cn("flex p-1 my-1 w-full", "justify-start")}>
                                    <div className="relative flex flex-col align-start max-w-[80%] align-start items-start self-start justify-start">
                                        <p className={cn("flex w-full text-[10px] font-semibold text-gray-500", "justify-center")}>{lastMessage.userId}</p>
                                        <div className={cn("rounded-lg p-0 min-w-[100px] text-sm break-words relative")}>
                                            <CardContent className="p-2 flex flex-col gap-1">
                                                <p className="text-xs leading-tight break-words">{lastMessage.message}</p>
                                                <div className="text-[10px] text-right text-gray-400">{lastMessage.time}</div>
                                            </CardContent>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                            <PopoverDemo buttonText={
                                <div className="relative">
                                    <span className="text-black">Chat</span>
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-4 -right-7 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0">
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                            }>
                                <ChatUI props={{ recieveMessage, username, setMessage, handleSubmit, message, handleChatOpen }} />
                            </PopoverDemo>
                            <PopoverTrigger></PopoverTrigger>
                        </Popover>

                        <PopoverDemo buttonText="Users in the Room">
                            <ActiveUsers listUsers={Object.keys(cursors)} />
                        </PopoverDemo>

                        <Slider
                            defaultValue={[20]}
                            max={80}
                            step={1}
                            value={[strokeWidth]}
                            onValueChange={(value) => setStrokeWidth(value[0])}
                            className="w-[20%] min-w-[120px] text-white" // Adding text-white here for better visibility
                        />
                        <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} className="cursor-pointer" disabled={eraser} />

                        {/* Adding icon color changes */}
                        <Button onClick={() => setEraser(!eraser)} variant="Ghost" className="text-white">
                            {eraser ? <FaPen className="text-white" /> : <FaEraser className="text-white" />}
                        </Button>
                        <Button onClick={handleSync} variant="Ghost" className="text-white">
                            <MdOutlineSync className="text-white" />
                        </Button>
                        <Button onClick={() => { canvasRef.current?.undo(); socket.emit("undo", roomId); }} variant="Ghost" className="text-white">
                            <MdOutlineUndo className="text-white" />
                        </Button>
                        <Button onClick={() => { canvasRef.current?.redo(); socket.emit("redo", roomId); }} variant="Ghost" className="text-white">
                            <MdOutlineRedo className="text-white" />
                        </Button>
                        <Button onClick={() => { canvasRef.current?.clearCanvas(); socket.emit("clear", roomId); setLocalPaths([]) }} variant="Ghost" className="text-white">
                            <MdOutlineClear className="text-white" />
                        </Button>
                        <Button onClick={() => canvasRef.current && exportImage(canvasRef.current)} variant="Ghost" className="text-white">
                            <MdOutlineDownload className="text-white" />
                        </Button>
                        <Qr_component roomId={roomId} />
                    </div>

                    <div ref={containerRef} className="relative w-full h-full border-slate-700" onMouseMove={handleMouseMove}>
                        {Object.keys(cursors).map((username) => {
                            const cursor = cursors[username];
                            return (
                                <div key={username} className="absolute pointer-events-none hidden md:block" style={{ left: `${cursor.x}px`, top: `${cursor.y}px` }}>
                                    <div className="w-4 h-4 border-2 rounded-full" style={{ borderColor: cursorColors.current[username] || "blue", backgroundColor: "rgba(255, 255, 255, 0.8)" }} />
                                    <p className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md">{username}</p>
                                </div>
                            );
                        })}
                        <ReactSketchCanvas ref={canvasRef} strokeWidth={eraser ? 20 : strokeWidth} strokeColor={eraser ? "#f8f9fa" : strokeColor} width="100%" height="100%" canvasColor="#f8f9fa" eraserWidth={20} onStroke={handleDraw}
                        />
                    </div>
                </div>
            </div>
            <div>
            </div>
        </div>

    );
};

export default CbWhiteBoard;


