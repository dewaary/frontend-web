"use client";

import { useState, FormEvent } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from "@/context/UserContext";

export default function Register() {
  const [email, setEmail] = useState<string>("");
  const [name, setLocalName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setUser } = useUser(); 
  const router = useRouter();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirmation", confirmPassword);
    if (profileImage) {
      formData.append("profile_image", profileImage);
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setIsLoading(false);
        toast.success("Registration successful! Check your email for OTP.", {
          position: "top-right",
          autoClose: 2000,
        });

        localStorage.setItem('token', response.data.token);
        
        setTimeout(() => {
          router.push("/OTP");
        }, 2000);
      }
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = error.response?.data?.message || "Registration failed";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-600">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full relative">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">Create Account</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setLocalName(e.target.value)}
            className="p-4 border rounded-md shadow-md text-black focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-4 border rounded-md shadow-md text-black focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-4 border rounded-md shadow-md text-black focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-4 border rounded-md shadow-md text-black focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
            className="p-4 border rounded-md shadow-md text-black focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300"
          />
          <button
            type="submit"
            className="py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all duration-300 shadow-lg flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            ) : (
              "Register"
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-700">
          Already have an account?{" "}
          <Link href="/Login" className="text-blue-600 underline hover:text-blue-700 font-semibold">
            Login
          </Link>
        </p>

        {/* Komponen toast untuk notifikasi */}
        <ToastContainer />
      </div>
    </div>
  );
}
