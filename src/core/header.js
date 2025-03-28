"use client";
import {
  Menubar,
  MenubarMenu,
} from "@/components/ui/menubar";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { CloseAlert } from "./closeAlert";
import { QrWithAlert } from "./qrWithAlert";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Header = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const token = Cookies.get("jwt_token");
      setVisible(!!token && token !== "undefined");
    };

    checkToken(); // Check token on mount

    const interval = setInterval(checkToken, 1000); // Polling every second
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  if (!visible) return null;

  return (
    <div className="flex-1 flex justify-between items-center relative">
      <SidebarTrigger className="cn-30px" />
      <Menubar className="flex justify-end border-none shadow-none space-x-6 p-7 border-b flex-shrink-0">
        <MenubarMenu>
          <QrWithAlert />
        </MenubarMenu>
        <MenubarMenu>
          <CloseAlert />
        </MenubarMenu>
      </Menubar>
    </div>
  );
};

export default Header;
