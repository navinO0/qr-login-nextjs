// hooks/useProtectedRoute.js
"use client"; // Add this line to mark the file as a client component

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const useProtectedRoute = () => {
    const router = useRouter();

    useEffect(() => {
        // Check if JWT token exists in cookies
        const token = Cookies.get("jwt_token");
        // If the token doesn't exist, redirect to the login page
        if (!token) {
            router.push("/login");
        }
    }, [router]);
};

export default useProtectedRoute;
