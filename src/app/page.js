"use client";

import useProtectedRoute from "@/core/protectedRoute";
import Header from "@/core/header";
import Whiteboard from "@/whiteBoard";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import parseToken from "@/core/parseJson";
import { useRouter } from "next/navigation";
import Base64ImageDisplay from "@/core/headerProfile";
import { useSession } from "next-auth/react";
import axios from "axios";
import { getToken } from "next-auth/jwt";

const UserContext = createContext();

export default function Home() {
  const [userData, setUserData] = useState({});
  const router = useRouter();
  const { data: session } = useSession();
    console.log("JWT Token:", session);
  useEffect(() => {
   if(session?.user?.token){
    Cookies.set("jwt_token", session.user.token);
   }
    const token = Cookies.get("jwt_token");
    if (token) {
      setUserData(parseToken(token));
    }
  }, [session]);

  useEffect(() => {
    if (userData) console.log("User data:", userData);
  }, [userData]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      <div className="flex">
        <div className="flex justify-center items-center h-[90vh] w-[100%] ">
          <img
           src={"https://res.cloudinary.com/dzapdxkgc/image/upload/v1743199597/Lovepik_com-380422385-smart-payment-method-illustration-qr-code-scan-code-payment-simple-retail_wzyehm.png"}
           alt="Home Image"
           className="w-100 h-100 object-cover "/>
        </div>
      </div>
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
