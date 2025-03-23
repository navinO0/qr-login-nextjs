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
import os from "os";
import QrLoader from "./qrLoader";
import ErroToaster from "./errorToaster";
import { useRouter } from "next/navigation";

const QRTimerInMints = process.env.NEXT_PUBLIC_QR_TIMER || 1;

function getHost(req = null) {
    if (typeof window !== "undefined") {
        // Client-side: Get the protocol and hostname
        return `${window.location.protocol}//${window.location.host}`;
    } else {
        // Server-side: Get VM IP
        const networkInterfaces = os.networkInterfaces();
        let vmIP = "127.0.0.1"; // Default localhost

        // Loop through network interfaces to find the first valid non-internal IP
        for (const interfaceKey in networkInterfaces) {
            for (const net of networkInterfaces[interfaceKey]) {
                if (!net.internal && net.family === "IPv4") {
                    vmIP = net.address;
                    break;
                }
            }
        }

        // If Next.js API request is provided, use request host
        const host = req?.headers?.host || `${vmIP}:3000`;
        return `http://${host}`;
    }
}

export function QrWithAlert() {
    const [isLoading, setIsLoading] = useState(false);
    const [qrLoginCode, setQrLoginCode] = useState('');
    const [error, setError] = useState(null);
    const [hostName, setHost] = useState(getHost());
    const router = useRouter();
    // Timer state
    const [timeLeft, setTimeLeft] = useState(QRTimerInMints * 60); // 5 minutes in seconds
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
        setTimeLeft(QRTimerInMints * 60); // 5 minutes in seconds
        setIsTimerExpired(false); // Reset timer expired flag

        if (!token || token === 'undefined') {
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

            if (response.status === 401) {
                Cookies.remove('jwt_token');
                router.push("/session-expired");
                // clearToken()
            }
            if (response.ok) {
                const resp = await response.json();
                const loginCode = resp.data.code;
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
        setTimeLeft(QRTimerInMints * 60); // Reset timer to 5 minutes
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
                <span onClick={handleOpenModal} className="cursor-pointer flex items-center justify-center space-x-2">
                    <span className="hidden md:inline">Scan to add device</span>
                    <img
                        alt="Scan QR Code"
                        src="https://res.cloudinary.com/dzapdxkgc/image/upload/v1742564270/qrcode-scan-svgrepo-com_lcxjjd.svg"
                        className="h-7 w-7"
                    />
                </span>
            </AlertDialogTrigger>
                <AlertDialogContent>
                    {/* Timer Display */}
                    <AlertDialogHeader>
                        <AlertDialogTitle>Scan to add device</AlertDialogTitle>
                        <AlertDialogDescription>
                            <span className="content w-full h-full flex flex-col items-center justify-center">
                                {isLoading ? (
                                    <QrLoader />
                                ) : error ? (
                                    <ErroToaster message={error} />
                                ) : (
                                            qrLoginCode && <Qr_gen qr_link={{ link: `${process.env.NEXT_PUBLIC_HOST_QR || hostName}/login/${qrLoginCode}`, code: qrLoginCode, time: timeLeft }} />
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
