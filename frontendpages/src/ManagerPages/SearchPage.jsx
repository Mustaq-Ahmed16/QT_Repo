import { useState } from 'react';

import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SearchPage() {
  const [keyword, setKeyword] = useState('');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://localhost:7014/api/trip/search?keyword=${keyword}`);
      const data = await res.json();
      setTrips(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <h1 className="text-4xl font-bold text-indigo-800 mb-6 animate-fade-in">Search Trips</h1>
      <div className="flex gap-3 mb-6 animate-slide-up">
        <Input 
          placeholder="Search by vehicle number or driver name" 
          value={keyword} 
          onChange={(e) => setKeyword(e.target.value)} 
          className="flex-1 transition-all duration-300 focus:ring-2 focus:ring-indigo-500"
        />
        <Button
          onClick={handleSearch} 
          disabled={loading} 
          className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300"
        >
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>
      {loading ? (
        <p className="text-center text-indigo-600 animate-pulse">Loading trips...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Dialog key={trip.tripId}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-indigo-700"> {trip.origin} ➡️ {trip.destination} </CardTitle>
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
                  <DialogTitle className="text-indigo-800">Trip Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Trip ID:</strong> {trip.tripId}</p>
                  <p><strong>Origin:</strong> {trip.origin}</p>
                  <p><strong>Destination:</strong> {trip.destination}</p>
                  <p><strong>Start Time:</strong> {trip.tripStartTime}</p>
                  <p><strong>End Time:</strong> {trip.tripEndTime}</p>
                  <p><strong>Submission Date:</strong> {trip.SubmissionDate}</p>
                  <p><strong>Driver ID:</strong> {trip.DriverId}</p>
                  <p><strong>Vehicle ID:</strong> {trip.VehicleId}</p>
                  <p><strong>Fleet Manager ID:</strong> {trip.fleetManagerId}</p>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </div>
  );
}