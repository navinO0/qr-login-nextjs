"use client";

import useProtectedRoute from "@/core/protectedRoute";
import Header from "@/core/header";
import Whiteboard from "@/whiteBoard";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import parseToken from "@/core/parseJson";
import { useRouter } from "next/navigation";
import Base64ImageDisplay from "@/core/headerProfile";


// ✅ Correcting context declaration
const UserContext = createContext();

export default function Home() {
  const [userData, setUserData] = useState({});
  const router = useRouter();

  useEffect(() => {
      const token = Cookies.get("jwt_token");
      if (token) {
        setUserData(parseToken(token));
        console.log("User data:", userData);
    }
  }, [router]);

  useProtectedRoute();
  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      <div className="h-screen">
        <Header />
        <div className="flex justify-center items-center w-screen h-screen">
          <Whiteboard />
          {/* <Base64ImageDisplay /> */}
        </div>
      </div>
    </UserContext.Provider>
  );
}

// ✅ Exporting context so it can be used elsewhere
export const useUserContext = () => useContext(UserContext);
