"use client";
import useProtectedRoute from "@/core/protectedRoute";

export default function Home() {
  useProtectedRoute();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen"
    >
     <h1>main page</h1>
    </div>
  );
}


// todo
// login(create, update(forgot password)) -> home
//shadcn
