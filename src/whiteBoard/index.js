"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import io from "socket.io-client";
import axios from "axios";
import { throttle } from "lodash";
import { useUserContext } from "@/app/page";
import Cookies from "js-cookie";
// import parseToken from "jwt-decode";
import { MdDownload, MdOutlineUndo, MdOutlineSync, MdOutlineRedo, MdOutlineClear } from "react-icons/md";
import { FaEraser, FaPen, FaRegSave } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import parseToken from "@/core/parseJson";

const socket = io(`${process.env.NEXT_PUBLIC_HOST || "http://localhost:3009"}`);
const roomId = "room123";

const Whiteboard = () => {
    const canvasRef = useRef(null);
    const [strokeColor, setStrokeColor] = useState("#000000");
    const [strokeWidth, setStrokeWidth] = useState(4);
    const [eraser, setEraser] = useState(false);
    const [cursors, setCursors] = useState({});
    const cursorColors = useRef({});
    const containerRef = useRef(null);
    const lastSentCursor = useRef({ x: 0, y: 0 });

    const { userData } = useUserContext();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Extract userId from JWT token
        const token = Cookies.get("jwt_token");
        if (token) {
            try {
                const decoded = parseToken(token);
                setUserId(decoded.username); // ✅ Use username from token
            } catch (error) {
                console.error("Invalid token:", error);
            }
        }
    }, []);

    useEffect(() => {
        if (!userId) return;

        socket.emit("join-room", roomId);

        axios.get(`${process.env.NEXT_PUBLIC_HOST || "http://localhost:3009"}/load/${roomId}`).then((res) => {
            if (res.data.length > 0) {
                canvasRef.current.loadPaths(res.data);
            }
        });

        socket.on("draw", (paths) => {
            requestAnimationFrame(() => canvasRef.current.loadPaths(paths));
        });

        socket.on("clear", () => {
            requestAnimationFrame(() => canvasRef.current.clearCanvas());
        });

        socket.on("undo", () => {
            requestAnimationFrame(() => canvasRef.current.undo());
        });

        socket.on("redo", () => {
            requestAnimationFrame(() => canvasRef.current.redo());
        });

        socket.on("cursor-move", ({ userId: senderId, cursor }) => {
            if (senderId !== userId) { // ✅ Ignore self cursor
                setCursors((prev) => ({ ...prev, [senderId]: cursor }));
                if (!cursorColors.current[senderId]) {
                    cursorColors.current[senderId] = `hsl(${Math.random() * 360}, 100%, 50%)`;
                }
            }
        });

        return () => {
            socket.off("draw").off("clear").off("undo").off("redo").off("cursor-move");
        };
    }, [userId]);

    const handleSave = async () => {
        const paths = await canvasRef.current.exportPaths();
        axios.post(`${process.env.NEXT_PUBLIC_HOST || "http://localhost:3009"}/save`, { roomId, paths });
    };

    const handleDraw = async () => {
        const paths = await canvasRef.current.exportPaths();
        socket.emit("draw", { roomId, paths });
    };

    const handleUndo = () => {
        canvasRef.current.undo();
        socket.emit("undo", roomId);
    };

    const handleRedo = () => {
        canvasRef.current.redo();
        socket.emit("redo", roomId);
    };

    const handleClear = () => {
        canvasRef.current.clearCanvas();
        socket.emit("clear", roomId);
    };

    const handleDownload = async () => {
        const dataUrl = await canvasRef.current.exportImage("png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `whiteboard-${roomId}.png`;
        link.click();
    };

    const toggleEraser = () => {
        setEraser((prev) => !prev);
    };

    const handleMouseMove = useCallback(
        throttle((e) => {
            if (!containerRef.current) return;
            const { left, top } = containerRef.current.getBoundingClientRect();
            const cursor = { x: e.clientX - left, y: e.clientY - top };

            if (
                Math.abs(cursor.x - lastSentCursor.current.x) > 5 ||
                Math.abs(cursor.y - lastSentCursor.current.y) > 5
            ) {
                lastSentCursor.current = cursor;
                socket.emit("cursor-move", { roomId, userId, cursor });
            }
        }, 50),
        [userId]
    );

    return (
        <div className="flex flex-col items-center p-2 border border-gray-300 rounded-tr-[10px] rounded-tl-[10px]">
            <h2 className="text-xl font-semibold mb-4">Collaborative Whiteboard</h2>

            <div className="flex justify-end gap-3 mb-0 w-full border-bottom-none">
                <Slider defaultValue={[20]} max={80} step={1} value={[strokeWidth]} onValueChange={(value) => setStrokeWidth(value[0])} className="w-[20%]" />
                <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} className="w-30px h-20px border rounded-[10px] cursor-pointer" disabled={eraser} />
                <Button onClick={toggleEraser} variant={"Ghost"}>{eraser ? <FaPen /> : <FaEraser />}</Button>
                <Button onClick={handleSave} variant={"Ghost"}><FaRegSave /></Button>
                <Button onClick={handleDraw} variant={"Ghost"}><MdOutlineSync /></Button>
                <Button onClick={handleUndo} variant={"Ghost"}><MdOutlineUndo /></Button>
                <Button onClick={handleRedo} variant={"Ghost"}><MdOutlineRedo /></Button>
                <Button onClick={handleClear} variant={"Ghost"}><MdOutlineClear /></Button>
                <Button onClick={handleDownload} variant={"Ghost"}><MdDownload /></Button>
            </div>

            <div ref={containerRef} className="border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden relative" onMouseMove={handleMouseMove}>
                <ReactSketchCanvas ref={canvasRef} strokeWidth={eraser ? 20 : strokeWidth} strokeColor={eraser ? "#f8f9fa" : strokeColor} width="800px" height="500px" canvasColor="#f8f9fa" eraserWidth={20} onStroke={handleDraw} />

                {Object.entries(cursors).map(([id, cursor]) => (
                    <div key={id} className="absolute flex flex-col items-center" style={{ top: cursor.y, left: cursor.x, transform: "translate(-50%, -50%)" }}>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cursorColors.current[id] || "blue" }} />
                        <span className="text-xs bg-gray-800 text-white px-1 rounded mt-1">{id}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Whiteboard;
