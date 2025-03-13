// "use client";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { useState } from "react";

// // Define form validation schema with new fields
// const formSchema = z.object({
//     customer_id: z.string().min(1).max(50),
//     first_name: z.string().min(1).max(50),
//     last_name: z.string().min(1).max(50),
//     email: z.string().email(),
//     mobile_no: z.string().min(10).max(15),
//     address: z.string().min(5),
//     city: z.string().min(2),
//     state: z.string().min(2),
//     pincode: z.string().min(5).max(6),
//     country: z.string().min(2),
//     is_active: z.enum(["yes", "no"]),
//     dob: z.string().min(10),
//     loyalty_points: z.number().optional(),
// });

// const CreateCustomerForm = () => {
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [successMessage, setSuccessMessage] = useState(null);

//     // Initialize form with react-hook-form
//     const form = useForm({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             customer_id: "",
//             first_name: "",
//             last_name: "",
//             email: "",
//             mobile_no: "",
//             address: "",
//             city: "",
//             state: "",
//             pincode: "",
//             country: "",
//             is_active: "yes",
//             dob: "",
//             loyalty_points: 0,
//         },
//     });

//     // Handle form submission
//     async function onSubmit(values) {
//         setLoading(true);

//         const requestData = {
//             customer_id: values.customer_id,
//             first_name: values.first_name,
//             last_name: values.last_name,
//             email: values.email,
//             mobile_no: values.mobile_no,
//             address: values.address,
//             city: values.city,
//             state: values.state,
//             pincode: values.pincode,
//             country: values.country,
//             is_active: values.is_active,
//             dob: values.dob,
//             loyalty_points: values.loyalty_points,
//         };

//         try {
//             const response = await fetch(`http://127.0.0.1:3009/customer/create`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(requestData),
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 setSuccessMessage("Customer created successfully!");
//                 form.reset(); // Reset the form after successful submission
//             } else {
//                 const errorData = await response.json();
//                 setError(errorData.message || "Something went wrong");
//             }
//         } catch (err) {
//             setError("An error occurred while creating the customer.");
//         } finally {
//             setLoading(false);
//         }
//     }

//     return (
//         <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg space-y-6">
//             <h2 className="text-3xl font-semibold text-center text-blue-600 mb-8">Create Customer</h2>

//             {successMessage && (
//                 <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
//                     {successMessage}
//                 </div>
//             )}

//             {error && (
//                 <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
//                     {error}
//                 </div>
//             )}

//             <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                     {/* Customer ID and Name Fields */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                         <FormField
//                             control={form.control}
//                             name="customer_id"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Customer ID</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             placeholder="Customer ID"
//                                             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="first_name"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>First Name</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             placeholder="First Name"
//                                             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="last_name"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Last Name</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             placeholder="Last Name"
//                                             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>

//                     {/* Email and Mobile Fields */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                         <FormField
//                             control={form.control}
//                             name="email"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Email</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             placeholder="Email"
//                                             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="mobile_no"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Mobile No</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             placeholder="Mobile No"
//                                             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>

//                     {/* Address, City, and State Fields */}
//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//                         <FormField
//                             control={form.control}
//                             name="address"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Address</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             placeholder="Address"
//                                             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="city"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>City</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             placeholder="City"
//                                             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="state"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>State</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             placeholder="State"
//                                             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>

//                     {/* Pincode and Country Fields */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                         <FormField
//                             control={form.control}
//                             name="pincode"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Pincode</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             placeholder="Pincode"
//                                             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="country"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Country</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             placeholder="Country"
//                                             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>

//                     {/* Date of Birth and Active Status Fields */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                         <FormField
//                             control={form.control}
//                             name="dob"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Date of Birth</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             type="date"
//                                             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         <FormField
//                             control={form.control}
//                             name="is_active"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Active Status</FormLabel>
//                                     <FormControl>
//                                         <select
//                                             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             {...field}
//                                         >
//                                             <option value="yes">Yes</option>
//                                             <option value="no">No</option>
//                                         </select>
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>

//                     {/* Submit Button */}
//                     <Button
//                         type="submit"
//                         className="w-full py-3 mt-6 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
//                         disabled={loading}
//                     >
//                         {loading ? 'Creating...' : 'Create Customer'}
//                     </Button>
//                 </form>
//             </Form>
//         </div>
//     );
// };

// export default CreateCustomerForm;
