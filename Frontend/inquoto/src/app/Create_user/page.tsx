'use client';

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/images/bg8.jpg')] bg-cover bg-center px-4 sm:px-8 md:px-12 py-10">
      <div className="bg-black  rounded-2xl shadow-lg p-8 sm:p-10 w-full max-w-150 text-white">
        <h1 className="text-3xl font-bold text-center mb-2">Create  Your Account</h1>
        <p className="text-center text-gray-300 text-sm mb-6">
          Please fill the form below to register.
        </p>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 rounded-md bg-transparent border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-md bg-transparent border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Create your password"
              className="w-full px-4 py-2 rounded-md bg-transparent border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <input type="checkbox" className="mr-2" />
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
