"use client";
import useProtectedRoute from "@/core/protectedRoute";
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
import Qr_gen from "@/core/qr_generator";
import Header from "@/core/header";


export default function Home() {
  useProtectedRoute();
  const showQR = () => {
    console.log("show qr")
  }
  return (
    <div className = "home-container">
      <Header />
    </div>
  );
}