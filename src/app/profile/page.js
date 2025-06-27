"use client";

import useProtectedRoute from "@/core/protectedRoute";
import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import parseToken from "@/core/parseJson";
import Base64ImageDisplay from "@/core/headerProfile";
import { useSession } from "next-auth/react";

const UserContext = createContext();

export default function Home() {
    useProtectedRoute();
  const [userData, setUserData] = useState({});
  const { data: session } = useSession();
  useEffect(() => {
    const token = Cookies.get("jwt_token");
    if (token) {
      setUserData(parseToken(token));
    }
  }, [session]);
  return (
      <div className="flex">
        <div className="flex justify-center items-center w-full h-full">
          <Base64ImageDisplay />
        </div>
      </div>

  );
}


