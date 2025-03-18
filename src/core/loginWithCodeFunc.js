


"use client";

import { useRouter } from 'next/navigation'; // Or 'next/router' for previous versions
import Cookies from 'js-cookie';


const loginWithCodeFunc = async (loginCode) => {
    if (!loginCode) {
        console.error('No login code provided');
        return false;
    }

    // const router = useRouter(); // Make sure to initialize router

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOST || "http://127.0.0.1:3000"}/user/login/code/${loginCode}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
        });
        if (response.ok) {
            const resp = await response.json();
            const token = resp.data.token;

            Cookies.set('jwt_token', token, { expires: 1 }); // Store token for 1 day
            if (resp.status === 'false') {
                return { status: false, message: resp.message };
            }
            return { status: true, message: 'login success' };
        } else {
            const errorData = await response.json();
            console.log('Error:', errorData);
            return { status: false, message: errorData.message };
        }
    } catch (error) {
        console.error('Login failed:', error);
        return { status: false, message: "login failed" };

    } finally {
        console.log('Login finished');
    }
};

export default loginWithCodeFunc;
