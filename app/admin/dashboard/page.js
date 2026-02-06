"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const AdminDashboard = () => {
  const [pendingCars, setPendingCars] = useState([])
  const [bookedCars, setBookedCars] = useState([]) // <--- New State
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/admin/pending?t=${Date.now()}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(setPendingCars)

    // Fetch Booked Cars (Reusing general API for simplicity)
    fetch(`/api/cars?t=${Date.now()}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
         // Filter for BOOKED status
         setBookedCars(data.filter(c => c.status === 'BOOKED'))
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black mb-8">Admin Dashboard 🛡️</h1>

        {/* --- SECTION 1: BOOKING ALERTS --- */}
        <div className="mb-10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="bg-red-600 text-white px-2 py-1 rounded text-sm animate-pulse">Action Required</span> 
                Recent Bookings
            </h2>
            <div className="bg-white rounded-xl shadow overflow-hidden border">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-3">Car</th>
                            <th className="p-3">Buyer Phone</th>
                            <th className="p-3">UTR / Txn ID</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookedCars.length === 0 ? (
                            <tr><td colSpan="4" className="p-4 text-center text-gray-400">No bookings yet.</td></tr>
                        ) : bookedCars.map(car => (
                            <tr key={car._id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-bold">{car.title}</td>
                                <td className="p-3 text-blue-600 font-mono font-bold">
                                    <a href={`tel:${car.buyerPhone}`}>{car.buyerPhone || "N/A"}</a>
                                </td>
                                <td className="p-3 font-mono bg-yellow-50">{car.transactionId || "N/A"}</td>
                                <td className="p-3">
                                    <Link href={`/admin/edit/${car._id}`}>
                                        <button className="text-xs bg-black text-white px-3 py-1 rounded">Verify</button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* --- SECTION 2: PENDING APPROVALS --- */}
        <div>
            <h2 className="text-xl font-bold mb-4">Pending Approvals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingCars.map(car => (
                    <div key={car._id} className="bg-white p-4 rounded-xl shadow-sm border flex gap-4">
                        <img src={car.images[0]} className="w-20 h-20 rounded-lg object-cover bg-gray-100" />
                        <div className="flex-1">
                            <h3 className="font-bold text-sm line-clamp-1">{car.title}</h3>
                            <p className="text-xs text-gray-500 mb-2">₹{car.price.toLocaleString()}</p>
                            <Link href={`/admin/edit/${car._id}`}>
                                <button className="w-full bg-blue-600 text-white text-xs py-2 rounded font-bold">Review</button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard