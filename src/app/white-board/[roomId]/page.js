"use client";

import { useRouter, useParams } from "next/navigation";
import { ReactSketchCanvas } from "react-sketch-canvas";
import React, { useRef, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { set, throttle } from "lodash";
import { MdDownload, MdOutlineUndo, MdOutlineSync, MdOutlineRedo, MdOutlineClear } from "react-icons/md";
import { FaEraser, FaPen } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import parseToken from "@/core/parseJson";
import Cookies from "js-cookie";
import { io } from "socket.io-client";
import Qr_component from "@/core/qr_pop";
import { PopoverDemo } from "@/core/popover";
import useProtectedRoute from "@/core/protectedRoute";

const socket = io( process.env.NEXT_PUBLIC_HOST || "http://localhost:3008", {
    transports: ["websocket"],
});

const CbWhiteBoard = () => {
    useProtectedRoute()
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const cursorColors = useRef({});
    const [cursors, setCursors] = useState({});
    const [strokeColor, setStrokeColor] = useState("#000000");
    const [strokeWidth, setStrokeWidth] = useState(4);
    const [eraser, setEraser] = useState(false);
    const [localPaths, setLocalPaths] = useState([]);
    const [lockedBy, setLockedBy] = useState(null); // Lock state
    const params = useParams();
    const router = useRouter();
    const [username, setUsername] = useState(() => Math.floor(Math.random() * 100000));
    const roomId = params?.roomId;
    const [users, setUsers] = useState([]);
    useEffect(() => {
        if (!roomId) {
            router.push("/white-board");
        }
    }, [roomId, router]);

    useEffect(() => {
        if (!roomId) return;

        socket.emit("join-room", roomId);

        axios.get(`${process.env.NEXT_PUBLIC_HOST || "http://localhost:3009"}/load/${roomId}`)
            .then((res) => {
                if (res.data.length > 0) {
                    const decompressedData = JSON.parse(res.data);
                    canvasRef.current?.loadPaths(decompressedData);
                }
            });
           
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


        socket.on("clear", () => requestAnimationFrame(() => {
            canvasRef.current?.clearCanvas();
            window.location.reload();
        }));

        socket.on("undo", () => requestAnimationFrame(() => canvasRef.current?.undo()));
        socket.on("redo", () => requestAnimationFrame(() => canvasRef.current?.redo()));

        socket.on("lock", (user) => setLockedBy(user));
        socket.on("unlock", () => setLockedBy(null));

        socket.on("cursor-move", ({ userId, cursor }) => {
            setCursors((prev) => ({ ...prev, [userId]: cursor }));
            if (!cursorColors.current[userId]) {
                cursorColors.current[userId] = `hsl(${Math.random() * 360}, 100%, 50%)`;
            }
        });

        return () => {
            socket.off("draw").off("clear").off("undo").off("redo").off("cursor-move");
            socket.disconnect();
        };
    }, [roomId]);



    const handleDraw = useCallback(
        throttle(async () => {
          if (!canvasRef.current || lockedBy && lockedBy !== username) return;
          const paths = await canvasRef.current.exportPaths();
          const newStrokes = paths[paths.length - 1];
          socket.emit("draw", { roomId,username, paths: [newStrokes] });
        }, 50),
        [lockedBy]
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
            const token = Cookies.get("jwt_token");
            let userData;

            if (token) {
                userData = parseToken(token);
                setUsername(userData.username);
            }
            socket.emit("cursor-move", { roomId, userId: username  || username || `user`, cursor });
        }, 5),
        [username]
    );

    const handleMouseDown = () => {
        console.log("lockedBy", lockedBy);
        if (!lockedBy) {
          setLockedBy(username);
          socket.emit("lock", { roomId, username });
        }
      };
    
      const handleMouseUp = () => {
        if (lockedBy === username) {
          setLockedBy(null);
          socket.emit("unlock", { roomId });
        }
      };

    return (
        <div className="border-black h-full">
            <div className="flex justify-center items-center h-[90vh]">
                
                <div className="flex flex-col items-center p-2 w-[95%] h-[90%] border border-gray-300 rounded-tr-[10px] rounded-tl-[10px]">
                    <h2 className="text-xl font-semibold mb-4">Collaborative Whiteboard</h2>
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
                    <PopoverDemo listUsers={Object.keys(cursors)} />
                        <Slider
                            defaultValue={[20]}
                            max={80}
                            step={1}
                            value={[strokeWidth]}
                            onValueChange={(value) => setStrokeWidth(value[0])}
                            className="w-[20%] min-w-[120px]"
                        />
                        <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} className="cursor-pointer" disabled={eraser} />
                        <Button onClick={() => setEraser(!eraser)} variant="Ghost">{eraser ? <FaPen /> : <FaEraser />}</Button>
                        <Button onClick={handleSync} variant="Ghost"><MdOutlineSync /></Button>
                        <Button onClick={() => { canvasRef.current?.undo(); socket.emit("undo", roomId); }} variant="Ghost"><MdOutlineUndo /></Button>
                        <Button onClick={() => { canvasRef.current?.redo(); socket.emit("redo", roomId); }} variant="Ghost"><MdOutlineRedo /></Button>
                        <Button onClick={() => { canvasRef.current?.clearCanvas(); socket.emit("clear", roomId); window.location.reload(); }} variant="Ghost"><MdOutlineClear /></Button>
                   <Qr_component roomId={ roomId} />
                    </div>

                    <div ref={containerRef} className="relative w-full h-full border" onMouseMove={handleMouseMove}>
                        {Object.keys(cursors).map((username) => {
                            const cursor = cursors[username];
                            return (
                                <div key={username} className="absolute pointer-events-none" style={{ left: `${cursor.x}px`, top: `${cursor.y}px` }}>
                                    <div className="w-4 h-4 border-2 rounded-full" style={{ borderColor: cursorColors.current[username] || "blue", backgroundColor: "rgba(255, 255, 255, 0.8)" }} />
                                    <p className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md">{username}</p>
                                </div>
                            );
                        })}
                        <ReactSketchCanvas ref={canvasRef} strokeWidth={eraser ? 20 : strokeWidth} strokeColor={eraser ? "#f8f9fa" : strokeColor} width="100%" height="100%" canvasColor="#f8f9fa" eraserWidth={20} onStroke={handleDraw}  onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CbWhiteBoard;


