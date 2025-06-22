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

    const interval = setInterval(checkToken, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="flex-1 flex justify-between items-center relative gap-4 pl-2 bg-gradient-to-r from-slate-900 to-slate-800">
      <SidebarTrigger className="text-xl font-semibold text-white hover:bg-slate-700 p-2 rounded-md cursor-pointer transition duration-200" />

      <Menubar className="flex justify-end border-none shadow-none space-x-6 p-7 border-b flex-shrink-0 bg-transparent text-white">
        <MenubarMenu>
          <QrWithAlert />
        </MenubarMenu>

        <MenubarMenu>
          {/* Close Alert Button */}
          <CloseAlert />
        </MenubarMenu>
      </Menubar>
    </div>
  );
};

export default Header;
