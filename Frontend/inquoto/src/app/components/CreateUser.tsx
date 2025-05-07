// pages/signup.tsx
export default function Signup() {
    return (
      <div className="flex h-screen">
        {/* Left Panel */}
        <div className="w-1/2 bg-white px-12 py-10 flex flex-col justify-center">
          <div className="text-2xl font-bold mb-8">
            <span className="text-3xl">🌀 DAILY</span>
          </div>
          <h2 className="text-xl font-semibold mb-6">Create an account</h2>
  
          <form className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input type="text" placeholder="Enter your name" className="w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input type="email" placeholder="Enter your mail" className="w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input type="password" placeholder="Enter your password" className="w-full border border-gray-300 rounded-md p-2" />
            </div>
  
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm">I agree to all the <a href="#" className="text-blue-600 underline">Terms & Conditions</a></span>
            </div>
  
            <button type="submit" className="w-full bg-teal-900 text-white py-2 rounded-md">Sign up</button>
          </form>
  
          <div className="my-4 text-center text-gray-500">Or</div>
  
          <div className="flex space-x-4 justify-center">
            <button className="border border-gray-300 py-2 px-4 rounded-md w-full flex items-center justify-center">
              <img src="/google.svg" alt="Google" className="w-5 mr-2" />
              Google
            </button>
            <button className="border border-gray-300 py-2 px-4 rounded-md w-full flex items-center justify-center">
              <img src="/facebook.svg" alt="Facebook" className="w-5 mr-2" />
              Facebook
            </button>
          </div>
  
          <p className="mt-6 text-center text-sm">Already have an account? <a href="#" className="text-blue-600">Log in</a></p>
        </div>
  
        {/* Right Panel */}
        <div className="w-1/2 bg-[#00353f] text-white flex flex-col justify-center items-center relative p-10">
          <div className="absolute top-10 right-10">
            {/* You can replace with real images or components */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow-lg">
              <p className="text-black text-sm mb-2">Analytics</p>
              <img src="/graph-placeholder.svg" alt="Analytics Graph" className="w-64 h-24" />
            </div>
            <div className="bg-white rounded-full w-28 h-28 flex items-center justify-center shadow-lg">
              <div className="text-black text-center">
                <div className="text-sm">Total</div>
                <div className="text-lg font-bold">42%</div>
              </div>
            </div>
          </div>
  
          <div className="text-center mt-40">
            <h2 className="text-lg font-semibold mb-2">Very simple way you can engage</h2>
            <p className="text-sm">Welcome to (DAILY) Inventory Management System!<br />
              Efficiently track and manage your inventory with ease.</p>
          </div>
        </div>
      </div>
    );
  }
  