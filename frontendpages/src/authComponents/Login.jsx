import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://localhost:7014/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.log(data.message)
        toast.err(data.message || "Login Failed");
        return;
      }

      const { token, user } = data;
      console.log(token);
      console.log(user);
      login(token, user);
      toast.success(`Welcome back, ${user.username}`);
      navigate(user.role === "FleetManager" ? "/manager" : "/driver", { replace: true });
    } catch (err) {
      toast.error("Login error. Please try again later");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md space-y-5 transform transition duration-500 ease-in-out animate-fade-in"
      >
        <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-4 animate-pulse">
          Login to Your Account
        </h2>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 text-left">Email</label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="transition-all duration-300 focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 text-left">Password</label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="transition-all duration-300 focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* <p className="text-sm text-right text-blue-600 hover:underline cursor-pointer transition duration-200">
          Forgot Password?
        </p> */}

        <Button
          id="loginbtn"
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300"
        >
          {loading ? 'Loading...' : 'Login'}
        </Button>

        <p className="text-sm text-center text-gray-600">
          New user?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
