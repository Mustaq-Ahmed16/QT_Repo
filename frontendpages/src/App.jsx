import { useState } from 'react'

import './App.css'
import { Input } from './components/ui/input'
import { Button } from './components/ui/button'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './authComponents/Login'
import Register from './authComponents/Register'
import Navbar from './components/ui/Navbar'
import ManagerDashboard from './ManagerPages/ManagerDashboard'
import DriverDashboard from './DriverPages/DriverDashboard'
import TripsPage from './ManagerPages/TripsPage'
import Landing from './authComponents/Landing'
import DriversPage from './ManagerPages/DriversPage'
import VehiclesPage from './ManagerPages/VehiclesPage'
import SearchPage from './ManagerPages/SearchPage'
import MyTripsPage from './DriverPages/MyTripsPage'
import ProtectedRoute from './PrivateRoutes/PrivateRoute'

function App() {


  return (
    <>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        {/* <Route path="/manager" element={<ManagerDashboard/>}/>
        <Route path="/driver" element={<DriverDashboard/>}/> */}
        <Route
            path="/manager"
            element={
              <ProtectedRoute allowedRoles={["FleetManager"]}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/trips"
            element={
              <ProtectedRoute allowedRoles={["FleetManager"]}>
                <TripsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/drivers"
            element={
              <ProtectedRoute allowedRoles={["FleetManager"]}>
                <DriversPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/vehicles"
            element={
              <ProtectedRoute allowedRoles={["FleetManager"]}>
                <VehiclesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/search"
            element={
              <ProtectedRoute allowedRoles={["FleetManager"]}>
                <SearchPage />
              </ProtectedRoute>
            }
          />


          {/* Driver Dashboard */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute allowedRoles={["FleetManager"]}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver"
            element={
              <ProtectedRoute allowedRoles={["Driver"]}>
                <DriverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/trips"
            element={
              <ProtectedRoute allowedRoles={["Driver"]}>
                <MyTripsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/vehicles"
            element={
              <ProtectedRoute allowedRoles={["Driver"]}>
                <VehiclesPage />
              </ProtectedRoute>
            }
          />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
