'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import Cookies from "js-cookie"
import React, { useState, useEffect, useCallback } from 'react';
import Popup from 'reactjs-popup';
import Qr_gen from './qr_generator';



 


    export function QrWithAlert() {
        const [isLoading, setIsLoading] = useState(false);
        const [qrLoginCode, setQrLoginCode] = useState('');
        const [error, setError] = useState(null);

        // Using useCallback to memoize the fetchQrCode function
        const fetchQrCode = useCallback(async () => {
            setIsLoading(true);
            const token = Cookies.get('jwt_token');

            if (!token || token === 'undefined') {
                setError('No token found');
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:3009/user/get/code', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ token: token }),
                });

                if (response.ok) {
                    const resp = await response.json();
                    const loginCode = resp.data.code
                    console.log(loginCode)
                    if (!loginCode || loginCode === 'undefined') {
                        setError('No login code found');
                        setIsLoading(false);
                        return;
                    }
                    setQrLoginCode(loginCode); // Store the QR code
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
            fetchQrCode(); // Call the API when the modal is opened
        };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <p onClick={handleOpenModal}>Add device </p>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Scan to add device</AlertDialogTitle>
                    <AlertDialogDescription>
                        <div className="content">
                            {isLoading ? (
                                <p>Loading...</p>
                            ) : error ? (
                                <p>{error}</p>
                            ) : (
                                qrLoginCode && <Qr_gen qr_link={{ link: `http://127.0.0.1:3009/user/login/code/${qrLoginCode}`, code: qrLoginCode }} />
                            )}
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction >Close</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}


