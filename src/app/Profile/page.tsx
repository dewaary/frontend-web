"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import Image from "next/image";

export default function Profile() {
  const router = useRouter();
  const { name, setUser, image } = useUser();


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/Login");
    }
  }, [router]);

  const handleLogout = async () => {
    const confirmLogout = confirm("Are you sure you want to logout?");

    if (confirmLogout) {
      try {
        const token = localStorage.getItem("token");

        await axios.get("http://127.0.0.1:8000/api/logout", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        localStorage.removeItem("token");
        setUser(null);

        router.push("/Login");
      } catch (error: any) {
        alert("Logout failed. Please try again.");
      }
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      const confirmBack = confirm("Are you sure you want to leave this page?");
      if (confirmBack) {
        return true;
      } else {
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  console.log("RESPONSE IMAGE", image);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-600">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Profile
        </h2>
        {image && (
        <Image 
          src={`http://localhost:8000/storage/${image}`}
          alt="Profile" 
          width={96} 
          height={96} 
          className="rounded-full w-24 h-24 mx-auto mb-4" 
        />
      )}
        <p className="text-lg text-gray-700">Welcome to your profile!</p>
        <p className="text-lg text-gray-700">{name}</p>

        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
