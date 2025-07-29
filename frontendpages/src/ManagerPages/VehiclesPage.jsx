import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";


const API_BASE = "https://localhost:7014/api/vehicle";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    id: null,
    number: "",
    model: "",
    capacity: "",
  });
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 5;

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await fetch(`${API_BASE}/all`);
      const data = await res.json();
      console.log(data.result);
      setVehicles(data.result);
    } catch (err) {
      toast.error("Failed to load vehicles");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const payload = {
      vehicleNumber: form.number,
      model: form.model,
      capacity: form.capacity,
    };

    try {
      if (editing) {
        await fetch(`${API_BASE}/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`${API_BASE}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      fetchVehicles();
      setDialogOpen(false);
      resetForm();
    } catch (err) {
      toast.error("Error saving vehicle.");
    }
  };

  const handleEdit = (v) => {
    setForm({
      id: v.id,
      number: v.vehicleNumber,
      model: v.model,
      capacity: v.capacity,
    });
    setEditing(true);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vehicle?")) return;
    try {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      fetchVehicles();
    } catch {
      alert("Failed to delete vehicle");
    }
  };

  const resetForm = () => {
    setForm({ id: null, number: "", model: "", capacity: "" });
    setEditing(false);
  };

  const indexOfLast = currentPage * vehiclesPerPage;
  const indexOfFirst = indexOfLast - vehiclesPerPage;
  const currentVehicles = vehicles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(vehicles.length / vehiclesPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-cyan-400 to-teal-300 p-8 text-gray-800 transition-all duration-300">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-xl p-6 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Vehicle Manager</h2>
          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm();
                  setEditing(false);
                }}
                className="bg-pink-600 hover:bg-pink-700"
              >
                + Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white text-black">
              <DialogHeader>
                <DialogTitle>
                  {editing ? "Edit Vehicle" : "Add Vehicle"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  name="vehicleNumber"
                  value={form.vehicleNumber}
                  onChange={handleChange}
                  placeholder="Vehicle Number"
                />
                <Input
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  placeholder="Model"
                />
                <Input
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  placeholder="Capacity"
                  type="number"
                />
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  {editing ? "Update" : "Add"}
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
                <th className="p-2">Vehicle Number</th>
                <th className="p-2">Model</th>
                <th className="p-2">Capacity</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentVehicles.map((v, idx) => (
                <tr
                  key={v.vehicleId}
                  className="bg-white/10 hover:bg-white/20 transition"
                >
                  <td className="p-2 text-center">{indexOfFirst + idx + 1}</td>
                  <td className="p-2">{v.vehicleNumber}</td>
                  <td className="p-2">{v.model}</td>
                  <td className="p-2 text-center">{v.capacity}</td>
                  <td className="p-2 space-x-2 text-center">
                    <Button size="sm" onClick={() => handleEdit(v.vehicleId)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(v.vehicleId)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              {currentVehicles.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No vehicles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              size="sm"
              variant={currentPage === i + 1 ? "default" : "secondary"}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}