"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Cookies from "js-cookie";
import parseToken from "./parseJson";
import Loader from "./loader";
import clearToken from "./removeToken";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ErroToaster from "./errorToaster";
import { useSession } from "next-auth/react";

const Base64ImageDisplay = () => {
    const [imageSrc, setImageSrc] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState({});
    const router = useRouter();

    const { data: session } = useSession();
    const fetchImage = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        const token = Cookies.get('jwt_token');
        if (!token || token === 'undefined') {
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST || "http://127.0.0.1:3000"}/user/get/image`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (response.status === 401) {
                Cookies.remove('jwt_token');
                router.push("/session-expired");
                // clearToken();
                setError("Unauthorized: Token expired.");
                return;
            }

            if (response.ok) {
                const resp = await response.json();
                const base64Data = resp?.data?.image; // Safe chaining to avoid errors

                if (!base64Data) {
                    setError("");
                } else {
                    setImageSrc(base64Data); // Ensure correct format
                }
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Failed to fetch image.");
            }
        } catch (error) {
            setError("Failed to connect to the server.");
            console.error("Image fetch failed:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = Cookies.get('jwt_token');
        if (!(session?.user?.image)) {
            if (token) {
                setUserData(parseToken(token));
            }
            fetchImage();
        }

    }, []);

    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 flex-1 flex-shrink-0 flex justify-center items-center relative mx-auto h-auto">
            {error &&
                <div className="">
                    <ErroToaster message={error} />
                </div>}
            {isLoading ? (
                <div className=" w-100% h-[90vh]  flex items-center justify-center flex-col">
                    <Loader />
                </div>
            ) : (
                (
                    <div className=" w-100%  h-[95vh] flex items-center justify-center flex-col">

                        <Card className="w-[350px] flex justify-center">

                            <div className=" flex justify-start ml-6">
                                <img
                                    src={imageSrc ? imageSrc : session?.user?.image || "https://res.cloudinary.com/dzapdxkgc/image/upload/v1742595352/download_ykpnl5.png"}
                                    alt="Profile Image"
                                    className="w-32 h-32 object-cover rounded-full border-2 border-gray-400 shadow-lg filter brightness-100 contrast-125"
                                    style={{
                                        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5)", // Outer shadow + Vignette effect
                                        background: "linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(0,0,0,0.2))", // Subtle background gradient
                                    }}
                                />


                            </div>
                            <CardHeader>
                                <CardTitle><span >Hello, </span > {`${userData.first_name || session?.user?.name || ''} ${userData.middle_name || ''} ${userData.last_name || ''}`.trim()}</CardTitle>
                                <CardDescription>Welcome! Hope you have a great day! ☀️</CardDescription>
                            </CardHeader>
                            <CardContent>
                            </CardContent>

                        </Card>
                    </div>
                )
            )}
        </div>
    );
};

export default Base64ImageDisplay;
