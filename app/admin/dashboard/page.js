"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const AdminDashboard = () => {
  const [cars, setCars] = useState([])     // Booked/Pending Cars
  const [rides, setRides] = useState([])   // 🆕 Ride Requests

  useEffect(() => {
    // Fetch Cars
    fetch(`/api/admin/pending?t=${Date.now()}`, { cache: 'no-store' }).then(res => res.json()).then(setCars)

    // 🆕 Fetch Rides (Create a simple GET route or use this inline for simplicity)
    // Ideally, create /api/ride/all, but here we can just assume you add a GET to the previous route
    // For now, let's just assume we need to implement the fetch:
    // fetch('/api/ride').then(res => res.json()).then(setRides) 
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black mb-8">Admin Dashboard 🛡️</h1>

        {/* 🆕 NEW SECTION: RIDE REQUESTS */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <h2 className="text-xl font-bold mb-4">🚖 Intercity Ride Requests</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-3">Route</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Phone (Click to Call)</th>
                            <th className="p-3">Car</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Placeholder until you connect the GET API */}
                        {rides.length === 0 && <tr><td colSpan="4" className="p-4 text-center text-gray-400">No rides yet. (Implement GET API)</td></tr>}
                        
                        {rides.map(ride => (
                            <tr key={ride._id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-bold">{ride.source} ➝ {ride.destination}</td>
                                <td className="p-3">{ride.date}</td>
                                <td className="p-3">
                                    <a href={`tel:${ride.userPhone}`} className="text-blue-600 font-bold font-mono">
                                        {ride.userPhone}
                                    </a>
                                </td>
                                <td className="p-3 bg-gray-100 rounded text-xs font-bold">{ride.carType}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* EXISTING SECTION: CAR APPROVALS */}
        <div>
            <h2 className="text-xl font-bold mb-4">Pending Car Approvals</h2>
            {/* ... (Keep your existing car list code here) ... */}
        </div>

      </div>
    </div>
  )
}

export default AdminDashboard