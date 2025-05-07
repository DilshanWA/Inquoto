"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  
  };

  return (
    <div className="h-screen flex items-center bg-green-100">
      <div className="h-screen w-1/2 bg-white">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="justify-center text-left mb-10 w-1/2">
            <h1 className="text-4xl font-bold text-gray-800">Welcome to NecMac System</h1>
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
                <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center">
                  <input
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={togglePassword}
                    className="mr-2"
                  />
                  <label htmlFor="showPassword" className="text-sm text-gray-600">Show</label>
                </div>
              )}
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className='text-gray-500 font-light text-center'>Powered by NecMac Engineering Pvt.</p>
          </form>
        </div>
      </div>

      <div className="relative h-screen w-1/2 bg-[url('/images/bg1.jpg')] bg-cover bg-center">
        <div className="absolute inset-1"></div>
        <div className="relative z-10 text-white p-8" />
      </div>
    </div>
  );
}
