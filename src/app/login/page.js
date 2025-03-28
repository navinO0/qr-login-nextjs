"use client";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; 
import { useEffect } from "react";
import { LoginForm } from "@/components/login-form";


const Login = () => {
    const router = useRouter();
    useEffect(() => {
        const token = Cookies.get("jwt_token");
        if (token) {
            router.push("/"); 
        }
    }, [router]);

        return (<div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
                <div className="w-full max-w-sm md:max-w-3xl">
                    <LoginForm />
                    
                </div>
            </div>);
};

export default Login;
