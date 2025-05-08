'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import react,{ useState } from 'react';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agree: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.agree) {
      alert('You must agree to the terms.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/super-admin/Register', formData);
      console.log('Success:', response.data);
      if (response.data.register_sate === true) {
           router.push('/');
        };
      
      
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message);
        if (error.response?.data.register_sate === true) {
          router.push('/');
       };
      } else {
        console.error('Unexpected error:', error);
        alert('An unexpected error occurred.');
      }
    }
    
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/images/bg8.jpg')] bg-cover bg-center px-4 sm:px-8 md:px-12 py-10">
      <div className="bg-black  rounded-2xl shadow-lg p-8 sm:p-10 w-full max-w-150 text-white">
        <h1 className="text-3xl font-bold text-center mb-2">Create Your Account</h1>
        <p className="text-center text-gray-300 text-sm mb-6">
          Please fill the form below to register.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
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
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create your password"
              className="w-full px-4 py-2 rounded-md bg-transparent border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center text-sm text-gray-300">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              className="mr-2"
            />
            I agree to the <a href="#" className="underline text-teal-400 ml-1">Terms & Conditions</a>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-md font-semibold transition"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
