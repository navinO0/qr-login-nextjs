"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; // For navigation
import loginWithCodeFunc from '@/core/loginWithCodeFunc';
import Loader from '@/core/loader';
import ErroToaster from '@/core/errorToaster';
import { Button } from '@/components/ui/button';

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

    const redirectToLogin = () => {
        router.push("/login");
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
             {!error &&  <Loader/> }
            <ErroToaster message={error} />
            {error && <div className="flex flex-col items-center justify-center min-h-screen text-center">
                <img
                                src={"https://res.cloudinary.com/dzapdxkgc/image/upload/v1742656764/vecteezy_conceptual-os-error-warning-for-web-pages-banners_5611288_g1lyqq.jpg"}
                                alt="Error Image"
                                className="w-100"
                />
                <span className='text-red-600 font-semibold text-lg bg-red-100 border-l-4 border-red-500 p-3 rounded-md shadow-md '>{error}</span>
                <Button onClick={redirectToLogin}  className="mt-4 w-50">Login</Button>
                </div>}
        </div>
    );
};

export default LoginWithCode;
