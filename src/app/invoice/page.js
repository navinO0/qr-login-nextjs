"use client"
import CreateCustomerForm from "@/core/custumCard"
import TenantFormCard from "@/core/tenetFormCard"
import InvoicePage from "./invoiceCall"


const Invoice = () => {
    return (
        <div className="flex flex-row justify-between">
            <div className="flex flex-col align-s">
            <CreateCustomerForm />
                <TenantFormCard />
            </div>
            <div className="w-full mw-3xl">
                <InvoicePage />
            </div>
        </div>
    )
}

export default Invoice