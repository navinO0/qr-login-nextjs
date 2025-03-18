"use client";
import InvoiceTemplate from "./invoiceTemplate";




const invoiceData = {
  company: {
    name: "ABC Corp",
    address: "123 Street, City, ST, ZIP",
    phone: "123-456-7890",
  },
  billTo: {
    name: "John Doe",
    company: "XYZ Ltd",
    address: "456 Avenue, City, ST, ZIP",
    phone: "987-654-3210",
  },
  items: [
    { description: "Product 1", amount: 50 },
    { description: "Service Fee", amount: 100 },
  ],
  taxRate: 10,
  additionalCosts: 5,
};

export default function InvoicePage() {
  return <InvoiceTemplate {...invoiceData} />;
}
