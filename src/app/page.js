"use client";

import useProtectedRoute from "@/core/protectedRoute";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import parseToken from "@/core/parseJson";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


const UserContext = createContext();

export default function Home() {
  const [userData, setUserData] = useState({});
  const { data: session } = useSession();
  useEffect(() => {
   if(session?.user?.token && session?.user?.token !== "undefined"){
    Cookies.set("jwt_token", session.user.token);
   }
    const token = Cookies.get("jwt_token");
    if (token) {
      setUserData(parseToken(token));
    }
  }, [session]);

  useEffect(() => {
  }, [userData]);
  useProtectedRoute();
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
