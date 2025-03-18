"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
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

// Define form validation schema with new fields
const formSchema = z.object({
    username: z.string().min(2).max(50),
    password: z.string().min(6),
    email: z.string().email(),
    mobile: z.string().min(10).max(15),
    first_name: z.string().min(1),
    middle_name: z.string().optional(),
    last_name: z.string().min(1),
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
    console.log('method has been called')

    // Define form with validation
    const form = useForm({
        // resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            email: "",
            mobile: "",
            first_name: "",
            middle_name: "",
            last_name: "",
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

    // Handle form submission
    async function onSubmit(values) {
        setLoading(true); // Set loading state

        // Prepare data for API call
        const requestData = {
            username: values.username,
            password: values.password,
            email: values.email,
            mobile: values.mobile,
            first_name: values.first_name,
            middle_name: values.middle_name || "", // Optional
            last_name: values.last_name,
        };
        try {
            // Send POST request to the API
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST || "http://127.0.0.1:3009"}/user/public/create`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            // Handle response
            if (response.ok) {
                console.log(response)
                const data = await response.json();
                setSuccessMessage('User registered successfully!');
                form.reset(); // Reset form after successful registration
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Something went wrong');
            }
        } catch (error) {
            setError('An error occurred while trying to register');
        } finally {
            setLoading(false); // Reset loading state
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg space-y-6">
            <h2 className="text-3xl font-semibold text-center text-blue-600 mb-8">User Registration</h2>

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
                        {/* 
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Address"
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
                    </div>

                    {/* Date of Birth and Gender Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* <FormField
                            control={form.control}
                            name="dob"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date of Birth</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
                        {/* 
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gender</FormLabel>
                                    <FormControl>
                                        <select
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            {...field}
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
                    </div>

                    {/* Country, City and Postal Code Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Country"
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}

                        {/* <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="City"
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* <FormField
                            control={form.control}
                            name="postal_code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Postal Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Postal Code"
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
                    </div>

                    {/* Newsletter and Terms Acceptance */}
                    <div className="flex items-center space-x-4">
                        {/* <FormField
                            control={form.control}
                            name="newsletter_subscribed"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subscribe to Newsletter</FormLabel>
                                    <FormControl>
                                        <input
                                            type="checkbox"
                                            className="h-5 w-5"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        /> */}

                        {/* <FormField
                            control={form.control}
                            name="terms_accepted"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Accept Terms</FormLabel>
                                    <FormControl>
                                        <input
                                            type="checkbox"
                                            className="h-5 w-5"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        /> */}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full py-3 mt-6 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default Register;
