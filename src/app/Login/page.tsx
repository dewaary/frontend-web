"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from "@/context/UserContext";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { setUser } = useUser();

  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });
  
      if (response.status === 200) {
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 2000,
        });
  
        const token = response.data.token;
        localStorage.setItem("token", token);
        const profileResponse = await axios.get("http://127.0.0.1:8000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("RESPONSE IMAGE", profileResponse?.data?.data?.profile_image)
  
        if (profileResponse.status === 200) {
          setUser({
            name: profileResponse?.data?.data?.name,
            email: profileResponse?.data?.data?.email,
            image: profileResponse?.data?.data?.profile_image || '',
          });
        }
  
        setTimeout(() => {
          router.push("/Profile");
        }, 2000);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-600">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Login
        </h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-4 border rounded-md text-black shadow-md focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300"
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-4 border rounded-md text-black shadow-md focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300"
            required
          />
          <button
            type="submit"
            className="py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-gray-700">
          Don&apos;t have an account?{" "}
          <Link
            href="/Register"
            className="text-blue-600 underline hover:text-blue-700 font-semibold"
          >
            Register
          </Link>
        </p>
        <ToastContainer />
      </div>
    </div>
  );
}
