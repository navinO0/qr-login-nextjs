"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Cookies from "js-cookie";
import clearToken from "./removeToken";
import parseToken from "./parseJson";
import { CloseAlert } from "./closeAlert";
import { QrWithAlert } from "./qrWithAlert";

const Base64ImageDisplay = () => {
    const [imageSrc, setImageSrc] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState({});

    const fetchImage = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        const token = Cookies.get('jwt_token');
               if (!token || token === 'undefined') {
                   setError('No token found');
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
                clearToken();
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
        if (token) {
            setUserData(parseToken(token));
        }
        fetchImage();
    }, [fetchImage]);

    return (
        <div className="flex flex-col items-center gap-4">
            {error && <p className="text-red-500">{error}</p>}
            {isLoading ? (
                "Loading..."
            ) : (
                    (
                        <div className="dropdown dropdown-end">
                            <span className="text-lg  text-gray-900 font-serif font-semibold font-sans ">
                           <span className="font-bold font-serif font-semibold font-sans font-mono fs-8 text-#000">Hello, </span > {`${userData.first_name || ''} ${userData.middle_name || ''} ${userData.last_name || ''}`.trim()}
                        </span>
                                                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                                        <div className="w-10 rounded-full">
                                                        <img
                                src={imageSrc ? imageSrc : "https://res.cloudinary.com/dzapdxkgc/image/upload/v1742595352/download_ykpnl5.png"}
                                alt="Profile Image"
                                className="w-15 h-15 object-cover rounded-full border"
                            />
                                                        </div>
                                                    </div>
                                                    <ul
                                                        tabIndex={0}
                                                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                                                        {/* <li>
                                                            <a className="justify-between">
                                                                Profile
                                                                <span className="badge">New</span>
                                                            </a>
                                                        </li> */}
                                                        <li><CloseAlert /></li>
                                                    </ul>
                                                </div>
                    //     <div className="flex items-center gap-4 border-none border-gray-300 p-2 rounded-lg">
                            
                            
                    // </div>
                )
            )}
        </div>
    );
};

export default Base64ImageDisplay;
