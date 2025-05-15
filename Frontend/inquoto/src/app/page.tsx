"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useNotification } from "@/app/context/NotificationContext";



export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordTyped, setIsPasswordTyped] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addNotification } = useNotification();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setIsPasswordTyped(!!value);
  };

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');  // Clear previous errors

      try {
        const response = await axios.post('http://localhost:5000/api/vi/login', {
          email,
          password
        });

        // Ensure all required data exists before storing
        const { uid, name, role, idToken } = response.data;
        if (!uid || !name || !role || !idToken) {
          throw new Error("Incomplete login response");
        }

        localStorage.setItem('uid', response.data.uid);
        localStorage.setItem('name', response.data.name); // Store user data in local storage
        localStorage.setItem('role', response.data.role); // Store role in local storage
        localStorage.setItem('token', response.data.idToken); 
        localStorage.setItem('email', email); // Store email in local storage
        router.push('/dashboard'); // Redirect on success
        addNotification("You have successfully logged in.");

      } catch (err: any) {
        console.error("Login failed:", err);

        // Handle specific error messages based on the error type
        if (err.response?.data?.message) {
          // Specific error message returned from the backend
          if (err.response.data.message.includes("Invalid email or password or borth")) {
            setError("Email or Password is incorrect.");
          } else {
            setError(err.response.data.message);
          }
        } else {
          // Generic error message if no specific error response is provided
          setError("Login failed. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };


  return (
    <div className="h-screen flex items-center bg-green-100">
      <div className="h-screen w-1/2 bg-white relative">
        {/* Error Popup will only appear inside this box */}

        <div className="flex flex-col items-center justify-center h-full">
          <div className="justify-center text-left mb-10 w-1/2">
            <h1 className="text-4xl font-bold text-gray-800">LOGIN </h1>
            <p className="text-black mt-2">Please enter your login credentials.</p>
          </div>

          <form className="flex flex-col space-y-5 w-1/2" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 text-black placeholder:text-gray-300 p-4 rounded"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                className="border border-gray-300 text-black placeholder:text-gray-300 p-4 rounded w-full"
                required
              />
              {isPasswordTyped && (
                <span
                  className="absolute right-3 top-5 cursor-pointer text-black hover:text-black"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274
                        4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 
                        0-8.268-2.943-9.542-7a10.05 10.05 0 012.465-3.568M21 
                        21L3 3m7.515 7.515A3 3 0 0012 15a3 3 0 
                        002.485-1.485" />
                    </svg>
                  )}
                </span>
              )}
            </div>

            <a href="#" className="underline text-teal-400 ml-1">Forgot Password?</a>

            <button
              type="submit"
              className="bg-teal-600 text-white p-4 rounded cursor-pointer hover:bg-teal-500 transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className='text-gray-500 font-light text-center'>Powered by NecMac Engineering Pvt.</p>
          </form>
        </div>
      </div>
      {/* Image Side */}
      <div className="relative h-screen w-1/2 bg-[url(/images/bg25.jpg)] bg-cover  flex flex-col ">
        <div className="absolute inset-0 bg-black/50  px-30 py-15 flex flex-col justify-center items-start">
        <div className=''>
          <h1 className='text-5xl font-medium'>Welcome to</h1>
            <h2 className='text-6xl font-bold text-white'>QuantifyPro <span className='text-medium'>Dashboard</span></h2>
            <p className='text-white text-xl mt-5'>Manage your Quotations & Invoices with Ease!</p>
            <p className='text-white text-sm mt-5 font-light'>A secure and powerful platform for handling 
            <br />all your business documents in one place.</p>
          </div>
          
            <p className='relative top-95 flex-end'>Powerd By NeoMac Engineering</p>
        </div>    
      </div>
    </div> 
  );
}
