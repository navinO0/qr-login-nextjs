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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null); // To handle errors

    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: ""
        },
    });

    // 2. Define a submit handler.
    const onSubmit = async (values) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://127.0.0.1:3004/user/public/login/user', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: values.username,
                    password: values.password,
                }),
            });

            if (response.ok) {
                // Handle successful login (get JWT token from response)
                const data = await response.json();

                // Store the JWT token in cookies
                Cookies.set('jwt_token', data.token, { expires: 7 }); // Store token for 7 days

                console.log('Login success:', data);

                // Redirect to the homepage after successful login
                router.push('/');
            } else {
                const errorData = await response.json();
                console.log('))))))))))))\n',errorData)
                setError(errorData.message || 'An error occurred while logging in.');
            }
        } catch (error) {
            setError('Failed to connect to the server.');
            console.error('Login failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Username" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Password" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Please enter your password.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {error && <div className="text-red-500">{error}</div>} {/* Show error message */}

                    <Button type="submit" className="sign-in" disabled={isLoading}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>

                    <Link href="/register">
                        <Button type="button" className="sign-up">Sign Up</Button>
                    </Link>
                </form>
            </Form>
        </div>
    );
};

export default Login;
