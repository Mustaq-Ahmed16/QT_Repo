import React, { useEffect, useState } from "react";
import axios from "axios";
import apiClient from "@/apiClient";
import { Button } from "@/components/ui/button";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";


export default function TripsPage() {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [showModal, setShowModal] = useState(false);
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

  const fetchData = async () => {
    const [driversRes, vehiclesRes, tripsRes] = await Promise.all([
      apiClient.get("/drivers"),
      apiClient.get("/vehicle/all"),
      apiClient.get("/trip"),
    ]);
    setDrivers(driversRes.data);
    setVehicles(vehiclesRes.data.result);
    setTrips(tripsRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!window.confirm("Confirm submission?")) return;
    const adjustedData = {
      ...formData,
      tripStartTime: new Date(formData.tripStart).toISOString(),
      tripEndTime: new Date(formData.tripEnd).toISOString(),
    };

    try {
      const response = await fetch(
        "https://localhost:7291/api/trip/assign-trip",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(adjustedData),
        }
      );

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Trip assignment failed");

      alert("✅ Trip assigned successfully");
      setShowModal(false);
      fetchData();
      setFormData({
        driverId: "",
        vehicleId: "",
        origin: "",
        destination: "",
        tripStart: "",
        tripEnd: "",
      });
    } catch (error) {
      alert(`🚫 Error: ${error.message}`);
      console.error("Assign trip error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirm delete?")) return;
    await axios.delete(`https://localhost:7291/api/trip/${id}`);
    fetchData();
  };

  const getStatus = (start) => {
    return new Date(start) > new Date() ? "Upcoming" : "Completed";
  };

  const paginatedTrips = trips.slice(
    (page - 1) * tripsPerPage,
    page * tripsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-400 to-teal-300 p-8 text-gray-800 transition-all duration-300">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-xl p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-blue-900">
            🚗 Trip Scheduler
          </h1>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            + Add Trip
          </Button>
        </div>

        {/* Trip Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse shadow-sm rounded-md">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="p-2">Driver</th>
                <th className="p-2">Vehicle</th>
                <th className="p-2">Origin</th>
                <th className="p-2">Destination</th>
                <th className="p-2">Start</th>
                <th className="p-2">End</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTrips.map((trip) => (
                <tr
                  key={trip.tripId}
                  className="text-center hover:bg-gray-100 transition"
                >
                  <td className="p-2">{trip.driverId}</td>
                  <td className="p-2">{trip.vehicleId}</td>
                  <td className="p-2">{trip.origin}</td>
                  <td className="p-2">{trip.destination}</td>
                  <td className="p-2">
                    {new Date(trip.tripStartTime).toLocaleString()}
                  </td>
                  <td className="p-2">
                    {new Date(trip.tripEndTime).toLocaleString()}
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm text-white ${
                        getStatus(trip.tripStart) === "Upcoming"
                          ? "bg-yellow-500"
                          : "bg-green-600"
                      }`}
                    >
                      {getStatus(trip.tripStart)}
                    </span>
                  </td>
                  <td className="p-2 space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => alert("Edit not implemented")}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(trip.tripId)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center space-x-2 mt-4">
          {[...Array(Math.ceil(trips.length / tripsPerPage)).keys()].map(
            (n) => (
              <button
                key={n}
                onClick={() => setPage(n + 1)}
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  page === n + 1
                    ? "bg-blue-700 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {n + 1}
              </button>
            )
          )}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle>📝 Assign New Trip</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <Select
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
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
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

            <Input
              name="origin"
              placeholder="Origin"
              value={formData.origin}
              onChange={handleInput}
            />
            <Input
              name="destination"
              placeholder="Destination"
              value={formData.destination}
              onChange={handleInput}
            />
            <Input
              name="tripStart"
              type="datetime-local"
              value={formData.tripStart}
              onChange={handleInput}
            />
            <Input
              name="tripEnd"
              type="datetime-local"
              value={formData.tripEnd}
              onChange={handleInput}
            />
          </div>
          <DialogFooter className="mt-4 flex justify-end space-x-3">
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Submit
            </Button>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

