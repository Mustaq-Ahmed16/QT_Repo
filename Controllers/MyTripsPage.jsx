import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, Clock } from 'lucide-react';

export default function MyTripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('jwtToken'); // Assuming token is stored in localStorage
        const res = await fetch('/api/trip/assign-trip', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTrips(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const isTripCompleted = (tripEndTime) => {
    const endTime = new Date(tripEndTime);
    const now = new Date();
    return endTime < now;
  };

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-teal-50 to-cyan-100 min-h-screen">
      <h1 className="text-4xl font-bold text-teal-800 mb-6 animate-fade-in">My Assigned Trips</h1>
      {loading ? (
        <p className="text-center text-teal-600 animate-pulse">Loading trips...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Dialog key={trip.tripId}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-teal-700 flex items-center justify-between">
                      Trip {trip.tripId}
                      {isTripCompleted(trip.tripEndTime) ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Origin: {trip.origin}</p>
                    <p className="text-sm text-gray-600">Destination: {trip.destination}</p>
                    <p className="text-sm text-gray-600">Start: {trip.tripStartTime}</p>
                    <p className="text-sm text-gray-600">End: {trip.tripEndTime}</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md transition-all duration-300">
                <DialogHeader>
                  <DialogTitle className="text-teal-800">Trip Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Trip ID:</strong> {trip.tripId}</p>
                  <p><strong>Origin:</strong> {trip.origin}</p>
                  <p><strong>Destination:</strong> {trip.destination}</p>
                  <p><strong>Start Time:</strong> {trip.tripStartTime}</p>
                  <p><strong>End Time:</strong> {trip.tripEndTime}</p>
                  <p><strong>Submission Date:</strong> {trip.submissionDate}</p>
                  <p><strong>Driver Name:</strong> {trip.driverName}</p>
                  <p><strong>Fleet Manager:</strong> {trip.FleetManagername}</p>
                  <p><strong>Vehicle Number:</strong> {trip.VehicleNumber}</p>
                  <p><strong>Vehicle Model:</strong> {trip.VehicleModel}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    {isTripCompleted(trip.tripEndTime) ? (
                      <span className="text-green-600">Completed</span>
                    ) : (
                      <span className="text-yellow-600">Ongoing</span>
                    )}
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </div>
  );
}
