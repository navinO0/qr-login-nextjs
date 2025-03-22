"use client";
import useProtectedRoute from "@/core/protectedRoute";
import Header from "@/core/header";
import HeaderProfile from "@/core/headerProfile";
import ErroToaster from "@/core/errorToaster";





export default function Home() {
  useProtectedRoute();
  const showQR = () => {
    console.log("show qr")
  }
  return (
    <div className="">
      <Header />
      <div className="flex justify-center align-center vw-100 h-screen">
        <HeaderProfile />
        <ErroToaster/>
      </div>
      <div>
      </div>
    </div>
  );
}