"use client";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Define form validation schema with new fields
const formSchema = z.object({
    customer_id: z.string().min(1).max(50),
    first_name: z.string().min(1).max(50),
    last_name: z.string().min(1).max(50),
    email: z.string().email(),
    mobile_no: z.string().min(10).max(15),
    address: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().min(5).max(6),
    country: z.string().min(2),
    is_active: z.enum(["yes", "no"]),
    dob: z.string().min(10),
    loyalty_points: z.number().optional(),
});

const CreateCustomerForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Initialize form with react-hook-form
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customer_id: "",
            first_name: "",
            last_name: "",
            email: "",
            mobile_no: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
            country: "",
            is_active: "yes",
            dob: "",
            loyalty_points: 0,
        },
    });

    // Handle form submission
    async function onSubmit(values) {
        setLoading(true);

        const requestData = {
            customer_id: values.customer_id,
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            mobile_no: values.mobile_no,
            address: values.address,
            city: values.city,
            state: values.state,
            pincode: values.pincode,
            country: values.country,
            is_active: values.is_active,
            dob: values.dob,
            loyalty_points: values.loyalty_points,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST || "http://127.0.0.1:3000"}/customer/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                const data = await response.json();
                setSuccessMessage("Customer created successfully!");
                form.reset(); // Reset the form after successful submission
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Something went wrong");
            }
        } catch (err) {
            setError("An error occurred while creating the customer.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <FormProvider {...form}> {/* Wrap form in FormProvider */}
            <Card className="w-full max-w-3xl  p-6 m-2">
                <CardHeader>
                    <CardTitle>Customer details or Bill to</CardTitle>
                    <CardDescription>Fill in the details to create a new customer</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">

                        {/* Customer ID */}
                        <div className="flex flex-col">
                            <FormField
                                control={form.control}
                                name="customer_id"
                                render={({ field }) => (
                                    <>
                                        <FormLabel>Customer ID</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Customer ID"
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </>
                                )}
                            />
                        </div>

                        {/* First Name */}
                        <div className="flex flex-col">
                            <FormField
                                control={form.control}
                                name="first_name"
                                render={({ field }) => (
                                    <>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="First Name"
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </>
                                )}
                            />
                        </div>

                        {/* Last Name */}
                        <div className="flex flex-col">
                            <FormField
                                control={form.control}
                                name="last_name"
                                render={({ field }) => (
                                    <>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Last Name"
                                                className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </>
                                )}
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Email"
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </>
                                )}
                            />
                        </div>

                        {/* Mobile No */}
                        <div className="flex flex-col">
                            <FormField
                                control={form.control}
                                name="mobile_no"
                                render={({ field }) => (
                                    <>
                                        <FormLabel>Mobile No</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Mobile No"
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </>
                                )}
                            />
                        </div>

                        {/* Address */}
                        <div className="flex flex-col">
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Address"
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </>
                                )}
                            />
                        </div>

                        {/* City */}
                        <div className="flex flex-col">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="City"
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </>
                                )}
                            />
                        </div>

                        {/* State */}
                        <div className="flex flex-col">
                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <>
                                        <FormLabel>State</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="State"
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </>
                                )}
                            />
                        </div>

                        {/* Pincode */}
                        <div className="flex flex-col">
                            <FormField
                                control={form.control}
                                name="pincode"
                                render={({ field }) => (
                                    <>
                                        <FormLabel>Pincode</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Pincode"
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </>
                                )}
                            />
                        </div>

                        {/* Country */}
                        <div className="flex flex-col">
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <>
                                        <FormLabel>Country</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Country"
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </>
                                )}
                            />
                        </div>

                        {/* Date of Birth */}
                        <div className="flex flex-col">
                            <FormField
                                control={form.control}
                                name="dob"
                                render={({ field }) => (
                                    <>
                                        <FormLabel>Date of Birth</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </>
                                )}
                            />
                        </div>

                        {/* Active Status */}
                        {/* <div className="flex flex-col">
                            <FormField
                                control={form.control}
                                name="is_active"
                                render={({ field }) => (
                                    <>
                                        <FormLabel>Is Active</FormLabel>
                                        <FormControl>
                                            <select
                                                {...field}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                            </select>
                                        </FormControl>
                                    </>
                                )}
                            />
                        </div> */}
                    </form>
                </CardContent>
            </Card>
        </FormProvider> // Make sure the Form is wrapped here
    );
};

export default CreateCustomerForm;
