"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link' // <--- Don't forget this import!

const AdminDashboard = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const [pendingCars, setPendingCars] = useState([])
  const [loading, setLoading] = useState(true)

  // 1. Fetch Pending Cars (Force fresh data)
  useEffect(() => {
    if (session?.user?.role !== 'admin') return;

    fetch(`/api/admin/pending?t=${Date.now()}`, { cache: 'no-store' }) // <--- Add no-store
      .then(res => res.json())
      .then(data => {
        setPendingCars(data)
        setLoading(false)
      })
      .catch(err => setLoading(false))
  }, [session])

  // Redirect if not admin
  if (session && session.user.role !== 'admin') {
    router.push('/')
    return null
  }

  // 2. Handle Rejection (Approval is now done in the Edit Page)
  const handleReject = async (carId) => {
    if(!confirm("Are you sure you want to PERMANENTLY delete this car?")) return;

    try {
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId, action: 'reject' })
      })

      if (res.ok) {
        setPendingCars(prev => prev.filter(c => c._id !== carId))
        alert("Car Rejected & Deleted. 🗑️")
      } else {
        alert("Action failed")
      }
    } catch (error) {
      alert("Server error")
    }
  }

  if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black mb-6">Admin Dashboard</h1>
        
        {/* Stats Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-200">
            <h2 className="text-xl font-bold">Pending Approvals</h2>
            <p className="text-gray-500">You have <span className="font-bold text-blue-600">{pendingCars.length}</span> cars waiting for review.</p>
        </div>

        {pendingCars.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed">
                <p className="text-xl text-gray-400 font-medium">No pending cars. Good job! 🎉</p>
            </div>
        ) : (
            <div className="grid gap-6">
                {pendingCars.map(car => (
                    <div key={car._id} className="bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row gap-6 items-start border border-gray-100">
                        
                        {/* Image Preview */}
                        <div className="w-full md:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden shrink-0 border">
                            {car.images[0] ? (
                                <img src={car.images[0]} className="w-full h-full object-cover" alt="Car Preview" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 text-xs">No Image</div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{car.title}</h3>
                                    <p className="text-blue-600 font-bold text-sm uppercase">{car.brand}</p>
                                </div>
                                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-bold border border-yellow-200">
                                    🕒 PENDING
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 mt-3 text-sm text-gray-600">
                                <p>💰 ₹{car.price.toLocaleString()}</p>
                                <p>📅 {car.year}</p>
                                <p>🚗 {car.kmDriven} km</p>
                            </div>
                            
                            <p className="mt-3 text-gray-500 text-xs italic bg-gray-50 inline-block px-2 py-1 rounded">
                                Seller: {car.sellerId}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 min-w-[160px]">
                            
                            {/* ✏️ EDIT BUTTON (Links to Edit Page) */}
                            <Link href={`/admin/edit/${car._id}`}>
                                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2">
                                    ✏️ Edit & Verify
                                </button>
                            </Link>

                            {/* 🗑️ REJECT BUTTON (Deletes immediately) */}
                            <button 
                                onClick={() => handleReject(car._id)}
                                className="w-full bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition border border-red-100"
                            >
                                🗑️ Reject
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard