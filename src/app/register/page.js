"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { React, useState } from "react";
import { encryptObjectValues } from "@/core/crypto-utils";
import { router, useRouter } from "next/navigation";
import Cookies from "js-cookie";

// Define form validation schema with new fields
const formSchema = z.object({
    username: z.string().min(2).max(50),
    password: z.string().min(6),
    email: z.string().email(),
    mobile: z.string().min(10).max(15),
    first_name: z.string().min(1),
    middle_name: z.string().optional(),
    last_name: z.string().min(1),
    // profile_picture: z
    //     .instanceof(File) // Ensure it's a File object
    //     .optional()
    //     .refine((file) => !file || file.size <= 2 * 1024 * 1024, {
    //         message: "Profile picture must be 2MB or smaller",
    //     }),
    // address: z.string().min(5),
    // dob: z.string().min(10),
    // gender: z.enum(["Male", "Female", "Other"]),
    // country: z.string().min(2),
    // city: z.string().min(2),
    // postal_code: z.string().min(5),
    // profile_picture_url: z.string().url().optional(),
    // preferred_language: z.string().min(2),
    // newsletter_subscribed: z.boolean().default(false),
    // terms_accepted: z.boolean().refine(val => val === true, {
    //     message: "You must accept the terms and conditions",
    // }),
});

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null)

    // Define form with validation
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            email: "",
            mobile: "",
            first_name: "",
            // middle_name: "",
            // last_name: "",
            profile_picture: z.optional(),
            // address: "",
            // dob: "",
            // gender: "Male",
            // country: "",
            // city: "",
            // postal_code: "",
            // profile_picture_url: "",
            // preferred_language: "English",
            // newsletter_subscribed: false,
            // terms_accepted: false,
        },
    });

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        
        if (file) {
            if (file.size > ((1024 * 1024)*2)) { // 1MB = 1024 * 1024 bytes
                setError("File size must be less than 2MB");
                return;
            }
    
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setProfilePicture(reader.result);
                console.log(reader.result);
            };
        }
    };
    const router = useRouter();

    // Handle form submission
    async function onSubmit(values) {
        setLoading(true); // Set loading state
        setError(null);
        setSuccessMessage(null);
        // Prepare data for API call
        const requestData = {
            username: values.username,
            password: values.password,
            email: values.email,
            mobile: values.mobile,
            first_name: values.first_name,
            middle_name: values.middle_name || "", // Optional
            last_name: values.last_name,
            profile_photo: profilePicture
        };
    
        const encData = await encryptObjectValues(requestData, ['username', 'email', 'mobile', 'first_name', 'middle_name', "password", 'last_name']);
    
        try {
            // Send POST request to the API
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST || "http://127.0.0.1:3000"}/user/public/create`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(encData),
            });
    
            // Log response status for debugging
            console.log("Response status:", response.status);
    
            // Ensure response is valid JSON
            const resp = await response.json();
    
            // Handle response
            if (response.ok) {
                const token = resp?.data?.token;
    
                if (!token || token === "undefined") {
                    setError(resp.message || "Invalid token received");
                    return { status: false, message: resp.message };
                }
    
                console.log("Token received:", token);
                Cookies.set('jwt_token', token, { expires: 1 }); // Store token for 1 day
                setSuccessMessage('User registered successfully!');
                router.push("/");
            } else {
                setError(resp.message || 'Something went wrong');
            }
        } catch (error) {
            setError(`An error occurred while trying to register: ${error.message || error}`);
        } finally {
            setLoading(false); // Reset loading state
        }
    }
    const redirectToLogin = () => {
        router.push("/login");
    }
    

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">

     
        <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg space-y-6 ">
            <h2 className="text-3xl font-semibold text-center text-grey-600 mb-8">User Registration</h2>

            {successMessage && (
                <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
                    {successMessage}
                </div>
            )}

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                    {error}
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Username and Password Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Username"
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            {...field}
                                        />
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
                                        <Input
                                            type="password"
                                            placeholder="Password"
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Email and Mobile Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Email"
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="mobile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mobile</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Mobile"
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="first_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="First Name"
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="middle_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Middle Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Middle Name"
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="last_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Last Name"
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                                
                            />
                            <FormField
                            control={form.control}
                            name="last_name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Profile Picture</FormLabel>
                                <FormControl>
                                    <Input type="file" accept="image/*" onChange={handleFileChange} />
                                    </FormControl>
                                    <FormLabel className={"text-grey-500 margin-top-0 opacity-50"}>*Image size should not ecxceed 2MB</FormLabel>
                                <FormMessage />
                            </FormItem>
                                )}
                                
                        />
                    </div>

                   

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full py-3 mt-6 text-white bg-black hover:bg-gray-600 rounded-md hover:bg-light-700 focus:outline-none cursor-pointer"
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register'}
                        </Button>
                </form>
                </Form>
                <Button
                            className="w-full py-3 mt-0 text-white bg-black hover:bg-gray-600 rounded-md hover:bg-light-700 focus:outline-none cursor-pointer"
                            onClick = {redirectToLogin}
                    >
                        Registered already? Login
                    </Button>
            </div>
        </div>
    );
};

export default Register;
