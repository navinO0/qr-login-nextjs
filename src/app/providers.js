"use client"; 

import { SessionProvider } from "next-auth/react";

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Providers component wraps its children with a SessionProvider

/******  d0e13c90-00b4-4dcb-a532-ff00ce85f5f9  *******/

export default function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
