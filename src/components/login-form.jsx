"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use this for redirect
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies
// Define schema for form validation
const formSchema = z.object({
    username: z.string().min(2).max(50).optional(),
    password: z.string().min(8).max(50).optional(), // Add password validation
    loginCode : z.string().optional()
});

export function LoginForm({ className, ...props }) {
  const router = useRouter();
  
  useEffect(() => {
    const token = Cookies.get("jwt_token");
    if (token) {
      router.push("/"); // Redirect to the home page if the token exists
    }
  }, [router]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // To handle errors

  // Setup form with react-hook-form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      loginCode : ""
    },
  });

  // Define a submit handler
  const onSubmit = async (values) => {
    setIsLoading(true);
    setError(null);
    const { loginCode, username, password } = values;
    if (loginCode) {
      const logi = await loginWithCodeFunc(loginCode);
        if (!logi) {
            router.push("/login")
        }
        router.push("/")
    }
    try {
      const response = await fetch('http://127.0.0.1:3004/user/public/login/user', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      if (response.ok) {
        // Handle successful login (get JWT token from response)
        const data = await response.json();

        // Store the JWT token in cookies
        Cookies.set('jwt_token', data.token, { expires: 1 }); // Store token for 1 day

        // Redirect to the homepage after successful login
        router.push('/');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'An error occurred while logging in.');
      }
    } catch (error) {
      setError('Failed to connect to the server.');
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="Username" 
                  {...form.register("username")} 
                  required 
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                placeholder = "********"
                  {...form.register("password")} 
                  required 
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/register" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block flex flex-col justify-center items-center border-l border-col-gray login-cide-container">
          
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">Have a code ?</Label>
      <Input 
                  id="loginCode" 
                  type="text" 
                placeholder = "********"
                  {...form.register("loginCode")} 
                  required 
                />
    </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs text-balance " >
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
