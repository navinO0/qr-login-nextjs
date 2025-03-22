'use client'
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/components/ui/menubar"
import Qr_gen from "./qr_generator"
import { useState } from "react"
import PopupComponent from "./popupComponent"
import { Router } from "lucide-react"
import Cookies from "js-cookie"
import { CloseAlert } from "./closeAlert"
import { QrWithAlert } from "./qrWithAlert"
import HeaderProfile from "./headerProfile"
import { Button } from "@/components/ui/button"


const Header = () => {
    return (
        <div className=" ">
            <Menubar className="border-black w-full flex justify-end border-none shadow-none space-x-6 p-7 "> 
                <MenubarMenu>
                    <MenubarTrigger>
                        <QrWithAlert />
                    </MenubarTrigger>
                </MenubarMenu>
                <MenubarMenu>
                     <CloseAlert />
                </MenubarMenu>
            </Menubar>

            {/* <div className=" ">
                <div className="navbar bg-base-100 shadow-sm">
                    <div className="flex-1 justify-end">
                        <a className="p-6"> <HeaderProfile /></a>
                    </div>
                </div>
            </div> */}
            
            
        </div>
    )
}

{/* <Qr_gen qr_link={{ link: 'https://navinkambham.ccbp.tech/' }} /> */}

export default Header