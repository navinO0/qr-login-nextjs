"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; // For navigation
import loginWithCodeFunc from '@/core/loginWithCodeFunc';

const LoginWithCode = () => {
    const params = useParams();
    const router = useRouter();
    const [loginCode, setLoginCode] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null); // To handle errors

    // useEffect to handle the params asynchronously and unwrap them
    useEffect(() => {
        // Ensure that params is available and unwrapped
        if (params && params.loginCode) {
            setLoginCode(params.loginCode); // Extract loginCode
        }
    }, [params]); // Only run this effect when params change

    const onSubmit = async () => {
        if (!loginCode) {
            console.log("Login code not available");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            if (loginCode) {
                const logi = await loginWithCodeFunc(loginCode);
                if (!logi.status || logi.status === 'false') {
                    setError(logi.message)
                    return
                }
                router.push("/")
            }
        } catch (error) {
            setError('Failed to connect to the server.');
            console.error('Login failed:', error);
        } finally {
            setIsLoading(false);
        }

        const logi = await loginWithCodeFunc(loginCode);
        if (!logi) {
            router.push("/login")
        }
        router.push("/")
    };

    useEffect(() => {
        // Trigger onSubmit when loginCode is available
        if (loginCode) {
            onSubmit();
        }
    }, [loginCode]); // Ensure onSubmit runs only when loginCode is available

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1> {!error &&  "There you are... wait..." }</h1>
            {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>
    );
};

export default LoginWithCode;
