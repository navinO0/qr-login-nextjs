


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
        const response = await fetch(`http://127.0.0.1:3004/user/login/code/${loginCode}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (response.ok) {
            // Handle successful login (get JWT token from response)
            const data = await response.json();

            // Store the JWT token in cookies
            if (data.token) {
                Cookies.set('jwt_token', data.token, { expires: 1 }); // Store token for 1 day
            }
            console.log('Login success:', data);

            // Redirect to the homepage after successful login
            // router.push('/');
            return true;
        } else {
            const errorData = await response.json();
            console.log('Error:', errorData);
            return false;
        }
    } catch (error) {
        console.error('Login failed:', error);
        return false;
    } finally {
        console.log('Login finished');
    }
};

export default loginWithCodeFunc;
