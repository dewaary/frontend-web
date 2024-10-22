/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, FormEvent, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function OTP() {
    const [otp, setOtp] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [countdown, setCountdown] = useState<number>(60); 
    const router = useRouter();
    const token = localStorage.getItem('token');
  
    const handleOTPVerification = async (e: FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
    
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/verify-otp", {
          otp,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
    
        if (response.status === 200) {
          toast.success("OTP verified successfully!", {
            position: "top-right",
            autoClose: 2000,
          });
    
          setTimeout(() => {
            router.push("/Profile");
          }, 2000);
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "OTP verification failed";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
     
    const handleResendOTP = async (e: FormEvent) => {
      e.preventDefault(); 
      setIsLoading(true); 
    
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/resend-otp", {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log("RESPONSE OTP", response)
    
        if (response.status === 200) {
          toast.success("OTP resent! Please check your email.", {
            position: "top-right",
            autoClose: 2000,
          });
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to resend OTP. Please try again.";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    useEffect(() => {
      if (countdown > 0) {
        const timer = setInterval(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
      }
    }, [countdown]);
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-600">
        <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full relative">
          <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">Verify OTP</h2>
          <p className="text-center text-gray-600 mb-4">Please check your email. The OTP has been sent to your email address.</p>
          <form onSubmit={handleOTPVerification} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter OTP Code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="p-4 border rounded-md shadow-md text-black focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300"
              required
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
                "Verify OTP"
              )}
            </button>
          </form>
  
          <div className="mt-4 text-center text-gray-700">
            {countdown > 0 ? (
              <p>Please wait {countdown} seconds to resend OTP.</p>
            ) : (
              <button
                onClick={handleResendOTP}
                className="text-blue-600 underline hover:text-blue-700 font-semibold"
              >
                Resend OTP
              </button>
            )}
          </div>
          <ToastContainer />
        </div>
      </div>
    );
  }
  
