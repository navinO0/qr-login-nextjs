'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import Cookies from "js-cookie"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Qr_gen from './qr_generator';
import clearToken from "./removeToken";

function getHost() {
    if (typeof window !== "undefined") {
        return `${window.location.protocol}//${window.location.host}`;
    } else {
        return process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";
    }
}

export function QrWithAlert() {
    const [isLoading, setIsLoading] = useState(false);
    const [qrLoginCode, setQrLoginCode] = useState('');
    const [error, setError] = useState(null);

    // Timer state
    const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds
    const [isTimerExpired, setIsTimerExpired] = useState(false); // State to track if the timer has expired

    // Timer reference (to avoid global variable)
    const timerRef = useRef(null);

    // Fetch QR Code and start countdown within useCallback
    const fetchQrCode = useCallback(async () => {
        // Clear any existing timer before starting a new one
        if (timerRef.current) {
            clearInterval(timerRef.current); // Clear the previous interval
        }

        setIsLoading(true);
        const token = Cookies.get('jwt_token');

        // Reset the timer to 5 minutes (300 seconds) every time QR code is fetched
        setTimeLeft(5 * 60); // 5 minutes in seconds
        setIsTimerExpired(false); // Reset timer expired flag

        if (!token || token === 'undefined') {
            setError('No token found');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST || "http://127.0.0.1:3000"}/user/get/code`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ token: token }),
            });

            if(response.status === 401) {
                clearToken()
            }
            if (response.ok) {
                const resp = await response.json();
                const loginCode = resp.data.code;
                console.log(loginCode)
                if (!loginCode || loginCode === 'undefined') {
                    setError('No login code found');
                    setIsLoading(false);
                    return;
                }
                setQrLoginCode(loginCode); // Store the QR code

                // Start the timer countdown
                timerRef.current = setInterval(() => {
                    setTimeLeft((prevTime) => {
                        if (prevTime <= 0) {
                            clearInterval(timerRef.current); // Stop the timer when it reaches zero
                            setIsTimerExpired(true); // Set flag to true when timer expires
                            return 0;
                        }
                        return prevTime - 1; // Decrease the time
                    });
                }, 1000);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'An error occurred while logging in.');
            }
        } catch (error) {
            setError('Failed to connect to the server.');
            console.error('Login failed:', error);
        } finally {
            setIsLoading(false);
        }
    }, []); // Empty dependency array ensures it doesn’t change on every render

    const handleOpenModal = () => {
        fetchQrCode(); // Call the API and start the timer when the modal is opened
    };

    // Format time left as mm:ss
    const formatTimeLeft = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    // Handle refresh button click - reset timer to 5 minutes
    const handleRefresh = () => {
        setTimeLeft(5 * 60); // Reset timer to 5 minutes
        setIsTimerExpired(false); // Reset expired flag
        fetchQrCode(); // Re-fetch QR code and start the timer again
    };

    const handleCloseModal = () => {
        clearInterval(timerRef.current); // Clear the interval when closing the modal
    };

    const host = getHost(); // Get dynamic host

    // Cleanup timer on component unmount
    useEffect(() => {
        // Cleanup timer on unmount
        return () => clearInterval(timerRef.current);
    }, []);

    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <p onClick={handleOpenModal}>Add device </p>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    {/* Timer Display */}
                    <div style={{
                        position: 'fixed',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        fontSize: '14px',
                    }}>
                        Expires in: {formatTimeLeft(timeLeft)}
                    </div>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Scan to add device</AlertDialogTitle>
                        <AlertDialogDescription>
                            <span className="content">
                                {isLoading ? (
                                    <span>Loading...</span>
                                ) : error ? (
                                    <span>{error}</span>
                                ) : (
                                            qrLoginCode && <Qr_gen qr_link={{ link: `${process.env.NEXT_PUBLIC_HOST_QR || "http://192.168.112.190:3000"}/login/${qrLoginCode}`, code: qrLoginCode }} />
                                )}
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        {/* Show refresh button if timer has expired */}
                        {isTimerExpired && (
                            <Button onClick={handleRefresh}>Refresh</Button>
                        )}
                        <AlertDialogAction onClick={handleCloseModal}>Close</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
