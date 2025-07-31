import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import {
  Hourglass,
  Users,
  CarFront,
  ArrowRightLeft,
  Search,
  Truck,
  UserPlus,
} from 'lucide-react'; // optional icons library


import TripsPage from './TripsPage';
import DriversPage from './DriversPage';
import VehiclesPage from './VehiclesPage';
import SearchPage from './SearchPage';

const ManagerDashboard = () => {
  const [selected, setSelected] = useState('Trips');

  const options = [
    { label: 'Trips', icon: <ArrowRightLeft size={18} /> },
    { label: 'Drivers', icon: <Users size={18} /> },
    { label: 'Vehicles', icon: <Truck size={18} /> },
    { label: 'Search', icon: <Search size={18} /> },
  ];

  const renderContent = () => {
    switch (selected) {
      case 'Trips':
        return <div className="animate-fade-in"><TripsPage/></div>;
      case 'Drivers':
        return <div className="animate-fade-in"><DriversPage/></div>;
      case 'Vehicles':
        return <div className="animate-fade-in"><VehiclesPage/></div>;
      case 'Search':
        return <div className="animate-fade-in"><SearchPage/></div>;
      default:
        return <div>Select an option from the sidebar</div>;
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 to-white">
      {/* Sidebar */}
      <aside className="w-50 bg-white shadow-md p-6 space-y-4 border-r transition-all duration-500">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">Dashboard</h2>
        {options.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            onClick={() => setSelected(item.label)}
            className={`w-full justify-start space-x-2 py-2 text-left transition-all duration-200 ${
              selected === item.label
                ? 'bg-purple-100 text-purple-800 font-semibold'
                : 'text-gray-700 hover:bg-purple-50'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 transition-all duration-300">
        {/* <h1 className="text-3xl font-semibold text-purple-700 mb-6 animate-fade-in">
          {selected}
        </h1> */}
         {renderContent()}
        {/* <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-500">
         
        </div> */}
      </main>
    </div>
  );
};

export default ManagerDashboard;

