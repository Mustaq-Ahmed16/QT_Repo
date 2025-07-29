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

function App() {


  return (
    <>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/manager" element={<ManagerDashboard/>}/>
        <Route path="/driver" element={<DriverDashboard/>}/>
        {/* <Route path="/manager/trips" element={<TripsPage/>}/> */}
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
