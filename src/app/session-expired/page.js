"use client"
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";


const SessionExpired = () => {
     const router = useRouter();
    const redirectToLogin = () => {
        Cookies.remove("jwt_token");
        router.push("/login");
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
                <img
                                src={"https://res.cloudinary.com/dzapdxkgc/image/upload/v1742656764/vecteezy_conceptual-os-error-warning-for-web-pages-banners_5611288_g1lyqq.jpg"}
                                alt="Error Image"
                                className="w-100"
                />
                <span className='text-red-600 font-semibold text-lg bg-red-100 border-l-4 border-red-500 p-3 rounded-md shadow-md '>Session Expired Please Login</span>
                <Button onClick={redirectToLogin}  className="mt-4 w-50">Login</Button>
        </div>
    );
};

export default SessionExpired