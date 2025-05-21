import React, { useState } from "react";
import { Button } from "../../components/ui/Button";

const AuthPage = ({ onLogin }: { onLogin: () => void }) => {
  const [isSignup, setIsSignup] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-80">
        
        {/* Sign Up / Log In Header */}
        <h2 className="text-xl font-semibold mb-4">{isSignup ? "Sign Up" : "Log In"}</h2>
        
        {/* Email and password inputs  */}
        <input className="w-full mb-2 p-2 border rounded" placeholder="Email" />
        <input className="w-full mb-4 p-2 border rounded" placeholder="Password" type="password" />

        {/* Sign Up / Log In Button  */}
        <Button className="w-full mb-2" onClick={onLogin}>{isSignup ? "Sign Up" : "Log In"}</Button>
       
        {/* Convenience links to switch between Sign Up and Log In */} 
        <button
          className="text-blue-600 text-sm"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Already have an account? Log in" : "Don't have an account? Sign up"}
        </button>
      
        </div>
    </div>
  );
};

export default AuthPage;
