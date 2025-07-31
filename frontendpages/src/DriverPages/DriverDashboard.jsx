import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import {

  Truck,
  ArrowRightLeft,

} from 'lucide-react'; // optional icons library
import MyTripsPage from './MyTripsPage';
import VehiclesPage from '@/ManagerPages/VehiclesPage';



const DriverDashboard = () => {
  const [selected, setSelected] = useState('My Trips');

  const options = [
    { label: 'My Trips', icon: <ArrowRightLeft size={18} /> },
    { label: 'Vehicles', icon: <Truck size={18} /> },

  ];

  const renderContent = () => {
    switch (selected) {
      case 'My Trips':
        return <div className="animate-fade-in"><MyTripsPage/></div>;
      case 'Vehicles':
        return <div className="animate-fade-in"><VehiclesPage/></div>;
      default:
        return <div>Select an option from the sidebar</div>;
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 to-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 space-y-4 border-r transition-all duration-500">
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
     
         {renderContent()}
      
      </main>
    </div>
  );
};

export default DriverDashboard;
