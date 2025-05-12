'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showToggleIcon, setShowToggleIcon] = useState(false);
  const [passwordValid, setPasswordValid] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agree: false,
  });

  const validatePassword = (password: string) => {
    const isValid =
      password.length >= 8 &&
      /[a-zA-Z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password);
    setPasswordValid(isValid);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'password') {
      setShowToggleIcon(value.length > 0);
      validatePassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.agree) {
      alert('You must agree to the terms.');
      return;
    }

    if (!passwordValid) {
      alert('Password must be at least 8 characters long and include a letter, number, and special symbol.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/super-admin/Register', formData);
      console.log('Success:', response.data);

      if (response.data.register_sate === true) {
        router.push('/');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message);
        if (error.response?.data.register_sate === true) {
          router.push('/');
        }
      } else {
        console.error('Unexpected error:', error);
        alert('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormReady = formData.name && formData.email && formData.password && formData.agree && passwordValid;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/images/bg21.jpg')] bg-cover bg-center px-4 sm:px-8 md:px-12 py-10">
      <div className="bg-black rounded-2xl shadow-lg p-8 sm:p-10 w-full max-w-150 text-white">
        <h1 className="text-4xl font-bold text-teal-600 mb-2">Hi!, Welcome to Inquoto</h1>
        <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
        <p className="text-gray-400 mb-5 text-sm">Create an account to get started with Inquoto.</p>

        <form className="space-y-5 mt-10" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full px-4 py-2 rounded-md bg-transparent border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-md bg-transparent border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create your password"
                className={`w-full px-4 py-2 rounded-md bg-transparent border ${
                  passwordValid ? 'border-gray-600' : 'border-red-500'
                } focus:outline-none focus:ring-2 ${passwordValid ? 'focus:ring-teal-500' : 'focus:ring-red-500'} pr-10`}
              />
              {showToggleIcon && (
                <span
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-400 hover:text-white"
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
            {!passwordValid && (
              <p className="text-sm text-red-500 mt-1">
                Password must be at least 8 characters long and include a letter, number, and special character.
              </p>
            )}
          </div>

          <div className="flex items-center text-sm text-gray-300">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              className="mr-2"
            />
            I agree to the
            <a href="#" className="underline text-teal-400 ml-1">Terms & Conditions</a>
          </div>

          <button
            type="submit"
            disabled={!isFormReady || loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-md font-semibold transition flex items-center justify-center gap-2 disabled"
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 100 16v-4l-3.5 3.5L12 24v-4a8 8 0 01-8-8z"
                ></path>
              </svg>
            )}
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
