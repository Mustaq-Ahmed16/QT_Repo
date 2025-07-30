import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";
import { ArrowRight, Info } from "lucide-react";

const Landing = () => {
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `url('https://www.sustainabletruckvan.com/wp-content/uploads/2022/10/01-Solera-1879x1080.jpg')`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-8 py-24 animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-md animate-slide-down duration-1000">
          Welcome to{" "}
          <span className="text-purple-400">Driver Trip Scheduler</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-purple-100 max-w-2xl animate-fade-in-up delay-200">
          Simplify fleet management with smart scheduling, real-time tracking,
          and intuitive dashboards.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4 animate-zoom-in delay-500">
          <Link to="/login">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 text-lg shadow-lg transition-all duration-300 transform hover:scale-105">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white/10 transition-transform hover:scale-105"
              >
                Learn More <Info className="ml-2 h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white rounded-lg shadow-xl transition-all">
              <DialogTitle>What is Driver Trip Scheduler?</DialogTitle>
              <DialogDescription className="text-gray-600 mt-2">
                Our platform helps fleet managers and drivers stay organized and
                efficient. Schedule trips, assign drivers, and track
                performance—all in one place.
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Floating Feature Box */}
      <div className="absolute bottom-10 right-10 bg-white/90 backdrop-blur-md p-4 rounded-lg shadow-lg hidden md:block animate-slide-left delay-700">
        <h3 className="text-lg font-semibold text-purple-800">✨ Features</h3>
        <ul className="mt-2 text-sm text-gray-700 list-disc list-inside space-y-1">
          <li>Live Trip Monitoring</li>
          <li>Driver Performance Metrics</li>
          <li>Fleet Manager Dashboard</li>
          <li>Mobile Friendly</li>
        </ul>
      </div>
    </div>
  );
};

export default Landing;
