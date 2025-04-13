"use client";

import useProtectedRoute from "@/core/protectedRoute";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import parseToken from "@/core/parseJson";
import { useSession } from "next-auth/react";
import registerUser from "@/core/registerUser";
import { useUserContext } from "./providers";
import { useRouter } from "next/navigation";
import LandingPage from "@/core/landingPage";


const UserContext = createContext();
export default function Home() {
  const [userData, setUserData] = useState({});
  const { data: session } = useSession();
  const { redirect } = useUserContext();
  const router = useRouter()
  useEffect(() => {
    
   if(session?.user?.token && session?.user?.token !== "undefined"){
     Cookies.set("jwt_token", session.user.token);
    registerUser(session.user, ['username', 'email', 'first_name'])
   }
    const token = Cookies.get("jwt_token");
    if (token) {
      setUserData(parseToken(token));
    }
    
      const redirect = Cookies.get("redirect");
      if (redirect) {
        Cookies.remove("redirect");
        router.push(redirect);
      }
  
  }, [session]);

  useEffect(() => {
  }, [userData]);
  useProtectedRoute();
  return (

    <LandingPage />
  );
}
