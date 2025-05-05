'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordTyped, setIsPasswordTyped] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const togglePassword = () => setShowPassword(!showPassword);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setIsPasswordTyped(!!value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isRegistering && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const endpoint = isRegistering ? '/api/register' : '/api/login';

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      setSuccess(isRegistering ? 'Registered successfully!' : 'Logged in successfully!');
      if (!isRegistering) {
        
        localStorage.setItem('token', data.token);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="h-screen flex items-center bg-green-100">
      <div className="h-screen w-1/2 bg-white">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="justify-center text-left mb-10 w-1/2">
            <h1 className="text-5xl font-bold text-gray-800">
              {isRegistering ? 'Create Account' : 'Welcome Back!'}
            </h1>
            <p className="text-black mt-2">
              {isRegistering
                ? 'Please enter your details to register.'
                : 'Please enter your login credentials.'}
            </p>
          </div>

          <form className="flex flex-col space-y-5 w-1/2" onSubmit={handleSubmit}>
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
                  <label htmlFor="showPassword" className="text-sm text-gray-600">
                    Show
                  </label>
                </div>
              )}
            </div>

            {isRegistering && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border border-gray-300 text-black placeholder:text-gray-300 p-4 rounded"
                required
              />
            )}

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <button
              type="submit"
              className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600 transition"
            >
              {isRegistering ? 'Register' : 'Login'}
            </button>

            <p className="text-sm text-gray-600">
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-blue-600 underline"
              >
                {isRegistering ? 'Login here' : 'Register here'}
              </button>
            </p>
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
