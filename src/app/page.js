"use client";

import useProtectedRoute from "@/core/protectedRoute";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import parseToken from "@/core/parseJson";
import { useSession } from "next-auth/react";
import registerUser from "@/core/registerUser";
import { useUserContext } from "./providers";
import { useRouter } from "next/navigation";
import LandingPage from "@/core/landingPage";
import { getDeviceInfo } from "@/core/getDeviceInfo";


const UserContext = createContext();
export default function Home() {
   const [userData, setUserData] = useState({});
  const [deviceInfo, setDeviceInfo] = useState(null);
  const { data: session } = useSession();
  const { redirect } = useUserContext();
  const router = useRouter();

  useMemo(() => {
    const init = async () => {
      if (!session?.user?.token || session?.user?.token === "undefined") return;
      const Dinfo = await getDeviceInfo();
      setDeviceInfo(Dinfo);

      await registerUser(session.user, ['username', 'email', 'first_name'], Dinfo);


      const token = Cookies.get("jwt_token");
      if (token) {
        setUserData(parseToken(token));
      }

      const redirect = Cookies.get("redirect");
      if (redirect) {
        Cookies.remove("redirect");
        router.push(redirect);
      }
    };

    init();
  }, [session]);

  useEffect(() => {
  }, [userData]);
  useProtectedRoute();
  return (
    <LandingPage />
  );
}
