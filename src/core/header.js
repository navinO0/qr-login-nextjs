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
import { FcMultipleDevices } from "react-icons/fc";
import { PopoverDemo } from "./popover";
// import ChatUI from "./chatUi";
// import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
// import { CardContent, Popover } from "@mui/material";
// import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import DeviceManager from "./deviceManager";

const Header = () => {
  const [visible, setVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  const handleOpenChange = () => setIsOpen(() => !isOpen);

  return (
    <div className="flex-1 flex justify-between items-center relative gap-4 pl-2 bg-gradient-to-r from-slate-900 to-slate-800">
      <SidebarTrigger className="text-xl font-semibold text-white hover:bg-slate-700 p-2 rounded-md cursor-pointer transition duration-200" />

      <Menubar className="flex justify-end border-none shadow-none space-x-6 p-7 border-b flex-shrink-0 bg-transparent text-white">
        <MenubarMenu>
          <QrWithAlert />
        </MenubarMenu>
        <MenubarMenu>
          <Popover open={isOpen} className="!bg-transparent !shadow-none !border-none !p-0 !m-0 w-auto h-auto">
            <PopoverContent side="top" align="end" className="!p-0 !m-0 w-auto h-auto">
              <div className={cn("flex p-1 my-1 w-full", "justify-start")}>
                <div className="relative flex flex-col align-start max-w-[100%] align-center items-center self-center justify-center">
                  <p className={cn("flex w-full text-[10px] font-semibold text-gray-500", "justify-center")}>Manage Devices</p>
                  <div className={cn("rounded-lg p-0 min-w-[100px] text-sm break-words relative")}>
                    <CardContent className="p-2 flex flex-col gap-1">
                      <DeviceManager />
                    </CardContent>
                  </div>
                </div>
              </div>
            </PopoverContent>
            <div className="relative" onClick={handleOpenChange}>
              <span className="text-black"><FcMultipleDevices fontSize={30} /></span>
            </div>
            <PopoverTrigger></PopoverTrigger>
          </Popover>
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
