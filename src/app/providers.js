"use client"; // Important: This ensures the component is client-side

import ErroToaster from "@/core/errorToaster";
import { SessionProvider } from "next-auth/react";
import { createContext, useContext, useState } from "react";

export const UserContext = createContext(null);

export default function Providers({ children }) {
  const [redirect, setRedirect] = useState("null"); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  

  return (
    <SessionProvider>
      <UserContext.Provider value={{ redirect, setRedirect, error, setError, success, setSuccess }}>
        {children}
        {error && <ErroToaster message={error} success={false} />}
        {success && <ErroToaster message={success} success={true} />}
      </UserContext.Provider>
    </SessionProvider>
  );
}

export const useUserContext = () => useContext(UserContext);