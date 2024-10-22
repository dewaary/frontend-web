/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

interface ProfileData {
  name?: string;
  profile_image?: string;
}

export default function Profile() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const getDataProfile = async () => {
    try {
      const profileResponse = await axios.get("http://127.0.0.1:8000/api/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (profileResponse.status === 200) {
        setProfileData(profileResponse.data.data);
      } else {
        console.error("Profile Response Error:", profileResponse);
      }
    } catch (err) {
      console.error("Error fetching profile data:", err);
    }
  };

  useEffect(() => {
    getDataProfile();
  }, []);


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
        router.push("/Login");
      } catch (error: any) {
        alert("Logout failed. Please try again.");
      }
    }
  };

  console.log(profileData)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-600">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Profile
        </h2>
        {profileData?.profile_image && (
          <Image 
            src={`http://localhost:8000/storage/${profileData?.profile_image}`}
            alt="Profile" 
            width={96} 
            height={96} 
            className="rounded-full w-24 h-24 mx-auto mb-4" 
          />
        )}
        <p className="text-lg text-gray-700">Welcome to your profile!</p>
        {profileData?.name && (
          <p className="text-lg text-gray-700">{profileData.name}</p>
        )}

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
