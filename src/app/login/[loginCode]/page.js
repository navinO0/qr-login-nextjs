"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; // For navigation
import Cookies from 'js-cookie'; // To handle cookies
import loginWithCodeFunc from '@/core/loginWithCodeFunc';

const LoginWithCode = () => {
    const params = useParams();
    const router = useRouter();
    const [loginCode, setLoginCode] = useState(null);

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

        // try {
        //     const response = await fetch(`http://127.0.0.1:3004/user/login/code/${loginCode}`, {
        //         method: 'POST',
        //         headers: {
        //             'Accept': 'application/json',
        //         }
        //     });

        //     if (response.ok) {
        //         // Handle successful login (get JWT token from response)
        //         const data = await response.json();

        //         // Store the JWT token in cookies
        //         if (data.token) {
        //             Cookies.set('jwt_token', data.token, { expires: 1 }); // Store token for 1 day
        //         }
        //         console.log('Login success:', data);

        //         // Redirect to the homepage after successful login
        //         router.push('/');
        //     } else {
        //         const errorData = await response.json();
        //         console.log('Error:', errorData);
        //     }
        // } catch (error) {
        //     console.error('Login failed:', error);
        // } finally {
        //     console.log("Login finished");
        // }

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
            <h1>There you are... wait...</h1>
        </div>
    );
};

export default LoginWithCode;
