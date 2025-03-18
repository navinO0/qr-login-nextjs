"use client";
import useProtectedRoute from "@/core/protectedRoute";
import Header from "@/core/header";




export default function Home() {
  useProtectedRoute();
  const showQR = () => {
    console.log("show qr")
  }
  return (
    <div className="">
      <Header />
    </div>
  );
}