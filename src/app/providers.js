"use client"; // Important: This ensures the component is client-side

import { SessionProvider } from "next-auth/react";
import { createContext, useContext, useState } from "react";

export const UserContext = createContext(null);

export default function Providers({ children }) {
  const [redirect, setRedirect] = useState("null"); 

  return (
    <SessionProvider>
      <UserContext.Provider value={{ redirect, setRedirect }}>
        {children}
      </UserContext.Provider>
    </SessionProvider>
  );
}

export const useUserContext = () => useContext(UserContext);