import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form };
    console.log(payload);
    // if (form.role === "user") delete payload.secretKey;

    try {
      const res = await fetch("https://localhost:7014/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Register Failed");
        return;
      }

      toast.success("Hurray! Registered Successfully, now please login");
      console.log(payload)
      navigate("/login");
    } catch (err) {
      toast.error("Registration error. Please try again later");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-4">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md space-y-5 transition-all duration-700 ease-in-out animate-fade-in"
      >
        <h2 className="text-3xl font-extrabold text-center text-purple-700 animate-pulse mb-2">
          Create Account
        </h2>

        <div className="space-y-1">
          <label className="block text-sm text-left font-medium text-gray-700">Name</label>
          <Input
            id="name"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="transition duration-200 focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm text-left font-medium text-gray-700">Email</label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="transition duration-200 focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm text-left font-medium text-gray-700">Password</label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="transition duration-200 focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* <div className="space-y-1">
          <label className="block text-sm text-left font-medium text-gray-700">Phone Number</label>
          <Input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="transition duration-200 focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm text-left font-medium text-gray-700">Address</label>
          <Input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
            className="transition duration-200 focus:ring-2 focus:ring-purple-400"
          />
        </div> */}
        <div className="space-y-1">
          <label className="block text-sm text-left font-medium text-gray-700">LicenseNumber</label>
          <Input
            id="license"
            name="licenseNumber"
            placeholder="License Number"
            value={form.licenseNumber}
            onChange={handleChange}
            required
            className="transition duration-200 focus:ring-2 focus:ring-purple-400"
          />
        </div> 

        <div className="space-y-1">
          <label className="block text-sm text-left font-medium text-gray-700">Role</label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          >
            <option value="">Select Role</option>
            <option value="FleetManager">Fleet Manager</option>
            <option value="Driver">Driver</option>
          </select>
        </div>

        {form.role === "FleetManager" && (
          <div className="space-y-1">
            <label className="block text-sm text-left font-medium text-gray-700">Admin Key</label>
            <Input
              id="adminkey"
              name="secretKey"
              placeholder="Admin Key"
              value={form.secretKey}
              onChange={handleChange}
              required
              className="transition duration-200 focus:ring-2 focus:ring-purple-400"
            />
          </div>
        )}

        <Button
          id="registerbtn"
          type="submit"
          className="w-full bg-purple-600 text-left hover:bg-purple-700 text-white transition-all duration-300"
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
