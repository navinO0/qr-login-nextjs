"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Cookies from "js-cookie";

export default function LoginForm() {
  const { data: session } = useSession();

  const handleLogin = async () => {
    const res = await signIn("google");
    if (res?.error) {
      console.error("Login failed", res.error);
    } else {
    //   Cookies.set("jwt_token", session?.jwt, { expires: 7 });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {!session ? (
        <button onClick={handleLogin} className="bg-red-500 text-white p-2">
          Sign in with Google
        </button>
      ) : (
        <div>
          <p>Welcome, {session.user?.name}!</p>
          <button onClick={() => signOut()} className="bg-gray-700 text-white p-2">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}