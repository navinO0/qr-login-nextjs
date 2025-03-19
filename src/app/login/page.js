"use client";
import { useRouter } from 'next/navigation'; // Use this for redirect
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies
import { useEffect } from "react";
import { LoginForm } from "@/components/login-form";


const Login = () => {
    const router = useRouter();
    useEffect(() => {
        const token = Cookies.get("jwt_token");
        if (token) {
            router.push("/"); // Redirect to the home page if the token exists
        }
    }, [router]);

        return (<div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
                <div className="w-full max-w-sm md:max-w-3xl">
                    <LoginForm />
                </div>
            </div>);
};

export default Login;
