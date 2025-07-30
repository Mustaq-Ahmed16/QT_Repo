import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import axios from "axios";
import apiClient from "@/apiClient";
import { Button } from "@/components/ui/button";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function TripsPage() {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [fleetManager, setFleetManager] = useState({ id: "", name: "" });

  const [formData, setFormData] = useState({
    driverId: "",
    vehicleId: "",
    origin: "",
    destination: "",
    tripStart: "",
    tripEnd: "",
  });

  const [page, setPage] = useState(1);
  const tripsPerPage = 5;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setFleetManager({
          id: decoded.fleetManagerId,
          name: decoded.userName,
        });
      } catch (err) {
        toast.error("❌ Invalid token");
      }
    }
  }, [token]);

  const fetchData = async () => {
    try {
      const [driversRes, vehiclesRes, tripsRes] = await Promise.all([
        apiClient.get("/drivers"),
        apiClient.get("/vehicle/all"),
        apiClient.get("/trip"),
      ]);
      setDrivers(driversRes.data);
      setVehicles(vehiclesRes.data.result);
      setTrips(tripsRes.data);
    } catch (err) {
      toast.error("❌ Failed to fetch data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      driverId: "",
      vehicleId: "",
      origin: "",
      destination: "",
      tripStart: "",
      tripEnd: "",
    });
    setEditingTrip(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (trip) => {
    setEditingTrip(trip);
    setFormData({
      driverId: trip.driverId,
      vehicleId: trip.vehicleId,
      origin: trip.origin,
      destination: trip.destination,
      tripStart: trip.tripStartTime.slice(0, 16),
      tripEnd: trip.tripEndTime.slice(0, 16),
    });
    setShowModal(true);
  };

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const adjustedData = {
      ...formData,
      tripStartTime: new Date(formData.tripStart).toISOString(),
      tripEndTime: new Date(formData.tripEnd).toISOString(),
      fleetManagerId: fleetManager.id,
    };

    if (editingTrip) adjustedData.tripId = editingTrip.tripId;

    const confirmAction = editingTrip ? "Update" : "Assign";
    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          const url = editingTrip
            ? `https://localhost:7014/api/trip/${editingTrip.tripId}`
            : "https://localhost:7014/api/trip/assign-trip";
          const method = editingTrip ? "PUT" : "POST";

          const response = await fetch(url, {
            method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(adjustedData),
          });

          const result = await response.json();
          if (!response.ok) throw new Error(result.message);

          fetchData();
          setShowModal(false);
          resetForm();
          resolve(`✅ Trip ${confirmAction.toLowerCase()}ed successfully`);
        } catch (err) {
          reject(`❌ ${confirmAction} failed: ${err.message}`);
        }
      }),
      {
        loading: `${confirmAction}ing trip...`,
        success: (msg) => msg,
        error: (msg) => msg,
      }
    );
  };

  const handleDelete = async (tripId) => {
    toast.promise(
      axios
        .delete(`https://localhost:7014/api/trip/${tripId}`)
        .then(() => fetchData()),
      {
        loading: "Deleting trip...",
        success: "🗑️ Trip deleted",
        error: "❌ Delete failed",
      }
    );
  };

  const getStatusBadge = (startTime) => {
    const isUpcoming = new Date(startTime) > new Date();
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
          isUpcoming ? "bg-yellow-500" : "bg-green-600"
        }`}
      >
        {isUpcoming ? "Upcoming" : "Completed"}
      </span>
    );
  };

  const paginatedTrips = trips.slice(
    (page - 1) * tripsPerPage,
    page * tripsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-400 to-teal-300 p-4 text-gray-800">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-blue-900">🚗 Trip Scheduler</h1>
          <Button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            + Add Trip
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow rounded-md">
            <thead className="bg-blue-100 text-blue-800 text-sm">
              <tr>
                {["Fleet Manager", "Driver", "Vehicle", "Origin", "Destination", "Trip Start", "Trip End", "Submission", "Status", "Actions"].map((col) => (
                  <th key={col} className="p-2">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedTrips.map((trip) => (
                <tr key={trip.tripId} className="text-center hover:bg-gray-100 transition">
                  <td className="p-2">{trip.fleetManager.userName}</td>
                  <td className="p-2">{trip.driver.userName}</td>
                  <td className="p-2">{trip.vehicle.vehicleNumber}</td>
                  <td className="p-2">{trip.origin}</td>
                  <td className="p-2">{trip.destination}</td>
                  <td className="p-2">{new Date(trip.tripStartTime).toLocaleString()}</td>
                  <td className="p-2">{new Date(trip.tripEndTime).toLocaleString()}</td>
                  <td className="p-2">{new Date(trip.submissionDate).toLocaleString()}</td>
                  <td className="p-2">{getStatusBadge(trip.tripEndTime)}</td>
                  <td className="p-2 flex justify-center space-x-2">
                    <Button variant="outline" onClick={() => openEditModal(trip)}>Edit</Button>
                    <Button variant="destructive" onClick={() => handleDelete(trip.tripId)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-4">
          {[...Array(Math.ceil(trips.length / tripsPerPage)).keys()].map((n) => (
            <button
              key={n}
              onClick={() => setPage(n + 1)}
              className={`px-4 py-1 mx-1 rounded-full text-sm font-medium ${
                page === n + 1 ? "bg-blue-700 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {n + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-white rounded-lg shadow-lg max-w-md mx ​:contentReference[oaicite:0]{index=0}
                <DialogContent className="bg-white rounded-lg shadow-lg max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTrip ? "✏️ Edit Trip" : "📝 Assign New Trip"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Fleet Manager (disabled) */}
            <Input
              label="Fleet Manager"
              value={fleetManager.name}
              disabled
              className="bg-gray-100"
            />

            {/* Driver Select */}
            <Select
              value={formData.driverId}
              onValueChange={(value) =>
                setFormData({ ...formData, driverId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Driver" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map((d) => (
                  <SelectItem key={d.driverId} value={d.driverId}>
                    {d.driverId}. {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Vehicle Select */}
            <Select
              value={formData.vehicleId}
              onValueChange={(value) =>
                setFormData({ ...formData, vehicleId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((v) => (
                  <SelectItem key={v.vehicleId} value={v.vehicleId}>
                    {v.vehicleNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Origin & Destination */}
            <Input
              name="origin"
              placeholder="Origin"
              value={formData.origin}
              onChange={handleInput}
              required
            />
            <Input
              name="destination"
              placeholder="Destination"
              value={formData.destination}
              onChange={handleInput}
              required
            />

            {/* Trip Times */}
            <Input
              name="tripStart"
              type="datetime-local"
              value={formData.tripStart}
              onChange={handleInput}
              required
            />
            <Input
              name="tripEnd"
              type="datetime-local"
              value={formData.tripEnd}
              onChange={handleInput}
              required
            />
          </div>

          <DialogFooter className="mt-4 flex justify-end space-x-3">
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {editingTrip ? "Update" : "Submit"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
​
