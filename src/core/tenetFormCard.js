"use client"
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";

const TenantFormCard = () => {
    const [formData, setFormData] = useState({
        tenant_id: '',
        tenant_name: '',
        contact_no: '',
        selling_person: '',
        company_email: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
        gst_no: '',
        company_logo: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Make your API call to submit the data
        // Add your API call logic here...
    };

    return (
        <Card className="w-full max-w-3xl p-6 m-2">
            <CardHeader>
                <CardTitle>Tenant details or Bill From</CardTitle>
                <CardDescription>Fill in the details to register the tenant</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Tenant ID */}
                    <div className="flex flex-col">
                        <Label htmlFor="tenant_id">Tenant ID</Label>
                        <Input
                            id="tenant_id"
                            name="tenant_id"
                            value={formData.tenant_id}
                            onChange={handleChange}
                            placeholder="Tenant ID"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Tenant Name */}
                    <div className="flex flex-col">
                        <Label htmlFor="tenant_name">Tenant Name</Label>
                        <Input
                            id="tenant_name"
                            name="tenant_name"
                            value={formData.tenant_name}
                            onChange={handleChange}
                            placeholder="Tenant Name"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Contact Number */}
                    <div className="flex flex-col">
                        <Label htmlFor="contact_no">Contact Number</Label>
                        <Input
                            id="contact_no"
                            name="contact_no"
                            value={formData.contact_no}
                            onChange={handleChange}
                            placeholder="Contact Number"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Selling Person */}
                    <div className="flex flex-col">
                        <Label htmlFor="selling_person">Selling Person</Label>
                        <Input
                            id="selling_person"
                            name="selling_person"
                            value={formData.selling_person}
                            onChange={handleChange}
                            placeholder="Selling Person"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Company Email */}
                    <div className="flex flex-col">
                        <Label htmlFor="company_email">Company&apos;s Email</Label>
                        <Input
                            id="company_email"
                            name="company_email"
                            value={formData.company_email}
                            onChange={handleChange}
                            placeholder="Company Email"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Address */}
                    <div className="flex flex-col">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Address"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* City */}
                    <div className="flex flex-col">
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="City"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* State */}
                    <div className="flex flex-col">
                        <Label htmlFor="state">State</Label>
                        <Input
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="State"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Pincode */}
                    <div className="flex flex-col">
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                            id="pincode"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            placeholder="Pincode"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Country */}
                    <div className="flex flex-col">
                        <Label htmlFor="country">Country</Label>
                        <Input
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="Country"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* GST Number */}
                    <div className="flex flex-col">
                        <Label htmlFor="gst_no">GST No</Label>
                        <Input
                            id="gst_no"
                            name="gst_no"
                            value={formData.gst_no}
                            onChange={handleChange}
                            placeholder="GST No"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Company Logo */}
                    <div className="flex flex-col">
                        <Label htmlFor="company_logo">Company Logo</Label>
                        <Input
                            id="company_logo"
                            name="company_logo"
                            type="file"
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default TenantFormCard;
