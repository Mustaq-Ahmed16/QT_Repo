import { useState, useEffect } from 'react';
import {
  Card, CardHeader, CardTitle, CardContent,
} from '@/components/ui/card';
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import apiClient from '@/apiClient';

export default function SearchPage() {
  const [mode, setMode] = useState('all'); // 'all', 'driver', 'vehicle'
  const [keyword, setKeyword] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // on mount, fetch all trips and the lists
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [trRes, drRes, vhRes] = await Promise.all([
        apiClient('https://localhost:7014/api/trip'),
        fetch('https://localhost:7014/api/drivers'),
        apiClient('https://localhost:7014/api/vehicle/all'),
      ]);
      const [trData, drData, vhData] = await Promise.all([
        trRes.data, drRes.json(), vhRes.data.result,
      ]);
      setTrips(trData);
      setDrivers(drData);
      setVehicles(vhData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await apiClient(
        `https://localhost:7014/api/trip/search?keyword=${keyword}`
      );
      const data = await res.data;
      setTrips(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <h1 className="text-4xl font-bold text-indigo-800 mb-6 animate-fade-in">Trips</h1>

      <div className="flex gap-3 mb-6 animate-slide-up">
        <select
          value={mode}
          onChange={(e) => {
            setMode(e.target.value);
            setKeyword('');
          }}
          className="p-2 border rounded"
        >
          <option value="all">All Trips</option>
          <option value="driver">Search by Driver</option>
          <option value="vehicle">Search by Vehicle Number</option>
        </select>

        {(mode === 'driver' || mode === 'vehicle') && (
          <select
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 p-2 border rounded"
          >
            <option value="">Select {mode === 'driver' ? 'Driver' : 'Vehicle'}</option>
            {(mode === 'driver' ? drivers : vehicles).map((item) => (
              <option
                key={mode === 'driver' ? item.driverId : item.vehicleId}
                value={mode === 'driver' ? item.name : item.vehicleNumber}
              >
                {mode === 'driver' ? item.name : item.vehicleNumber}
              </option>
            ))}
          </select>
        )}

        {mode === 'all' ? null : (
          <Button
            onClick={handleSearch}
            disabled={loading || keyword === ''}
            className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300"
          >
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        )}
      </div>

      {loading ? (
        <p className="text-center text-indigo-600 animate-pulse">Loading trips...</p>
      ) : trips.length === 0 ? (
        <p className="text-center text-indigo-600">No results found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Dialog key={trip.tripId}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-indigo-700">
                      {trip.origin} ➡️ {trip.destination}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Start: {trip.tripStartTime}</p>
                    <p className="text-sm text-gray-600">End: {trip.tripEndTime}</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md transition-all duration-300">
                <DialogHeader>
                  <DialogTitle className="text-indigo-800">Trip Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Trip ID:</strong> {trip.tripId}</p>
                  <p><strong>Origin:</strong> {trip.origin}</p>
                  <p><strong>Destination:</strong> {trip.destination}</p>
                  <p><strong>Start Time:</strong> {new Date(trip.tripStartTime).toLocaleString()}</p>
                  <p><strong>End Time:</strong> {new Date(trip.tripEndTime).toLocaleString()}</p>
                  <p><strong>Submission Date:</strong> {new Date(trip.submissionDate).toLocaleString()}</p>
                  <p><strong>Driver:</strong> {trip.driver.userName}</p>
                  <p><strong>Vehicle Number:</strong> {trip.vehicle.vehicleNumber}</p>
                  <p><strong>Vehicle Model:</strong> {trip.vehicle.model}</p>
                  <p><strong>Fleet Manager:</strong> {trip.fleetManager.userName}</p>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </div>
  );
}
