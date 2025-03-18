"use client"; // Ensures this runs only on the client side

import React, { useRef, useEffect, useState } from "react";

const InvoiceTemplate = ({ company, billTo, items, taxRate, additionalCosts }) => {
    const invoiceRef = useRef();
    // const [isClient, setIsClient] = useState(false);

    // useEffect(() => {
    //     setIsClient(true); // Prevents server-client mismatch
    // }, []);

    const handleDownloadPDF = async () => {
        if (!isClient) return; // Ensures it runs only on client side

        const html2pdf = (await import("html2pdf.js")).default;
        const element = invoiceRef.current;

        const options = {
            margin: 10,
            filename: "invoice.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };

        html2pdf().set(options).from(element).save();
    };

    if (!isClient) return <p className="text-center text-lg text-gray-500">Loading...</p>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg border border-black rounded-lg">
            <div ref={invoiceRef} className="p-6">
                {/* Company Information */}
                <h1 className="text-2xl font-bold text-black">{company.name}</h1>
                <p className="text-gray-800">{company.address}</p>
                <p className="text-gray-800">{company.phone}</p>

                {/* Bill To Information */}
                <div className="mt-6 border-t border-gray-300 pt-4">
                    <h2 className="text-lg font-semibold text-black">Bill To:</h2>
                    <p className="text-gray-800">{billTo.name}</p>
                    <p className="text-gray-800">{billTo.company}</p>
                    <p className="text-gray-800">{billTo.address}</p>
                    <p className="text-gray-800">{billTo.phone}</p>
                </div>

                {/* Invoice Items */}
                <div className="mt-6 border-t border-gray-300 pt-4">
                    <h2 className="text-lg font-semibold text-black">Invoice Items</h2>
                    <table className="w-full mt-2 border-collapse border border-gray-400">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-400 px-4 py-2">Description</th>
                                <th className="border border-gray-400 px-4 py-2">Amount ($)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index} className="border border-gray-400">
                                    <td className="border border-gray-400 px-4 py-2">{item.description}</td>
                                    <td className="border border-gray-400 px-4 py-2 text-right">${item.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Total Calculation */}
                <div className="mt-6 border-t border-gray-300 pt-4 text-right">
                    <p className="text-lg font-semibold text-black">Subtotal: ${items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</p>
                    <p className="text-lg font-semibold text-black">Tax ({taxRate}%): ${(items.reduce((sum, item) => sum + item.amount, 0) * (taxRate / 100)).toFixed(2)}</p>
                    <p className="text-lg font-semibold text-black">Additional Costs: ${additionalCosts.toFixed(2)}</p>
                    <p className="text-2xl font-bold text-black">Total: ${(items.reduce((sum, item) => sum + item.amount, 0) + (items.reduce((sum, item) => sum + item.amount, 0) * (taxRate / 100)) + additionalCosts).toFixed(2)}</p>
                </div>
            </div>

            {/* Download PDF Button */}
            <button
                onClick={handleDownloadPDF}
                className="mt-6 px-6 py-2 bg-black text-white rounded-lg shadow hover:bg-gray-800 w-full"
            >
                Download PDF
            </button>
        </div>
    );
};

export default InvoiceTemplate;
