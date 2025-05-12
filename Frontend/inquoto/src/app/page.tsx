"use client";

import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordTyped, setIsPasswordTyped] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const togglePassword = () => setShowPassword(!showPassword);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setIsPasswordTyped(!!value);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/dashboard');
    }
  }, []);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const response = await axios.post('http://localhost:5000/api/vi/login', {
        email,
        password
      });

      localStorage.setItem('uid', response.data.uid);
      localStorage.setItem('name', response.data.name) // Store user data in local storage
      localStorage.setItem('role', response.data.role); // Store role in local storage
      localStorage.setItem('token', response.data.idToken); 
      localStorage.setItem('email', email); // Store email in local storag
      router.push('/dashboard'); // Redirect on success

    } catch (err: any) {
      console.error("Login failed:", err);
  
      // Handle error message
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center bg-green-100">
      <div className="h-screen w-1/2 bg-white">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="justify-center text-left mb-10 w-1/2">
            <h1 className="text-4xl font-bold text-gray-800">Welcome to <span className='text-teal-600'>QuantifyPro</span> </h1>
            <p className="text-black  mt-2">Please enter your login credentials.</p>
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

            {error && <p className="text-red-600 text-sm">{error}</p>}

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

       <div className="relative h-screen w-1/2 bg-[url('/images/bg30.jpg')] bg-cover bg-center">
        
      </div>
    </div> 
  );
}
