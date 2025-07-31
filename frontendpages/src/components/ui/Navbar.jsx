import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { token,logout,user } = useAuth();

  const handleLogout = () => {
    logout();
    // localStorage.removeItem("token");
    // localStorage.clear();
    navigate("/login",{ replace: true });
  };
 

  // const handleBackRoute = () => {
  //   if (role === "user") navigate("/user");
  //   else navigate("/librarian");
  // };

  return (
    <nav className="bg-white shadow-md px-6 py-2 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <img src="https://lh3.googleusercontent.com/N65QzGs0bsztdWnB9noTiXWDhNmHq6iDzZbF3_gq7zRsoMU9ftIfTwAZB9x6AB45Ag=s300" alt="Fleet Logo" className="w-20 h-18" />
        <h1 className="text-xl md:text-2xl font-bold text-purple-700">Driver Trip Scheduler</h1>
      </div>
      <div className="space-x-4">
        {token ? (
          <>
            <Button variant="outline" className="bg-purple-200 text-purple-800 font-semibold" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Link to="/" className="text-purple-600 hover:underline">Home</Link>
            <Link to="/login" className="text-purple-600 hover:underline">Login</Link>
            <Link to="/register" className="text-purple-600 hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
