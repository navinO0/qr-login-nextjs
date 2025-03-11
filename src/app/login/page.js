"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use this for redirect
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginForm } from "@/components/login-form";

// Define form validation schema
const formSchema = z.object({
    username: z.string().min(2).max(50),
    password: z.string().min(8).max(50), // Add password validation
});

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
