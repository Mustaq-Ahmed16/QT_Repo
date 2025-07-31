import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = "https://localhost:7014/api";

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState({
    driverId: null,
    name: "",
    licenseNumber: "",
    email: "",
    password: "",
   
  });
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await fetch(`${API_BASE}/drivers`);
      const data = await res.json();
      setDrivers(data);
    } catch (err) {
      toast.error("Failed to load drivers");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!form.licenseNumber.trim()) {
      toast.error("License Number is required");
      return false;
    }
    if (!isEditing) {
      if (!form.email.trim()) {
        toast.error("Email is required");
        return false;
      }
      if (!form.password.trim()) {
        toast.error("Password is required");
        return false;
      }
    }
    return true;
  };

  const handleRegisterOrUpdate = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isEditing) {
        const res = await fetch(`${API_BASE}/drivers/${form.driverId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            licenseNumber: form.licenseNumber,
          }),
        });
        if (!res.ok) throw new Error("Update failed");
        toast.success("Driver updated successfully");
      } else {
        const res = await fetch(`${API_BASE}/auth/register-driver`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            licenseNumber: form.licenseNumber,
            email: form.email,
            password: form.password,
           
          }),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Registration failed");
        }
        toast.success("Driver registered successfully");
      }

      fetchDrivers();
      setDialogOpen(false);
      resetForm();
    } catch (err) {
      toast.error(err.message || "Failed to save driver");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (driver) => {
    setForm({
      driverId: driver.driverId,
      name: driver.name,
      licenseNumber: driver.licenseNumber,
      email: "",
      password: "",
      
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this driver?")) return;
    try {
      const res = await fetch(`${API_BASE}/drivers/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Driver deleted");
      fetchDrivers();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const resetForm = () => {
    setForm({
      driverId: null,
      name: "",
      licenseNumber: "",
      email: "",
      password: "",
     
    });
    setIsEditing(false);
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
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
              <DialogContent className="sm:max-w-[500px] bg-white text-black rounded-lg shadow-lg">
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
                    disabled={loading}
                  />
                  <Input
                    name="licenseNumber"
                    value={form.licenseNumber}
                    onChange={handleChange}
                    placeholder="License Number"
                    disabled={loading}
                  />
                  {!isEditing && (
                    <>
                      <Input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        disabled={loading}
                      />
                      <Input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Password"
                        disabled={loading}
                      />
                      
                    </>
                  )}
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setDialogOpen(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={handleRegisterOrUpdate}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : isEditing ? "Update" : "Register"}
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
    </>
  );
}