import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";// Adjust path based on your project

const API_BASE = "https://localhost:7014/api";

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState({
    driverId: null,
    name: "",
    licenseNumber: "",
    email: "",
    password: "",
    phone: "",
  });
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await fetch(`${API_BASE}/drivers`);
      const data = await res.json();
      setDrivers(data);
    } catch (err) {
      alert("Failed to load drivers");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegisterOrUpdate = async () => {
    try {
      if (isEditing) {
        await fetch(`${API_BASE}/drivers/${form.driverId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            licenseNumber: form.licenseNumber,
          }),
        });
      } else {
        await fetch(`${API_BASE}/auth/register-driver`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            licenseNumber: form.licenseNumber,
            email: form.email,
            password: form.password,
            phone: form.phone,
          }),
        });
      }

      fetchDrivers();
      setDialogOpen(false);
      resetForm();
    } catch (err) {
      alert("Failed to save driver");
    }
  };

  const handleEdit = (driver) => {
    setForm({
      driverId: driver.driverId,
      name: driver.name,
      licenseNumber: driver.licenseNumber,
      email: "",
      password: "",
      phone: "",
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this driver?")) return;
    try {
      await fetch(`${API_BASE}/drivers/${id}`, { method: "DELETE" });
      fetchDrivers();
    } catch {
      alert("Failed to delete");
    }
  };

  const resetForm = () => {
    setForm({
      driverId: null,
      name: "",
      licenseNumber: "",
      email: "",
      password: "",
      phone: "",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-400 to-teal-300 p-8 text-gray-800 transition-all duration-300">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-xl p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Drivers Manager</h2>
          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  resetForm();
                  setIsEditing(false);
                }}
              >
                + Register Driver
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white text-black">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Update Driver" : "Register New Driver"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                />
                <Input
                  name="licenseNumber"
                  value={form.licenseNumber}
                  onChange={handleChange}
                  placeholder="License Number"
                />
                {!isEditing && (
                  <>
                    <Input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email"
                    />
                    <Input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Password"
                    />
                    <Input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone"
                    />
                  </>
                )}
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={handleRegisterOrUpdate}
                >
                  {isEditing ? "Update" : "Register"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto text-black border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-blue-100 text-blue-800">
                <th className="p-2">#</th>
                <th className="p-2">Name</th>
                <th className="p-2">License</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver, idx) => (
                <tr
                  key={driver.driverId}
                  className="bg-white/10 hover:bg-white/20 transition"
                >
                  <td className="p-2 text-center">{idx + 1}</td>
                  <td className="p-2">{driver.name}</td>
                  <td className="p-2">{driver.licenseNumber}</td>
                  <td className="p-2 text-center space-x-2">
                    <Button size="sm" onClick={() => handleEdit(driver)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(driver.driverId)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              {drivers.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No drivers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}