"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const Profile = () => {
  const { data: session } = useSession()
  const [data, setData] = useState({ myListings: [], myOrders: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(resData => {
            setData(resData)
            setLoading(false)
        })
    }
  }, [session])

  if (!session) return <div className="p-10 text-center">Please Login</div>
  if (loading) return <div className="p-10 text-center">Loading Profile...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {session.user.name[0]}
            </div>
            <div>
                <h1 className="text-2xl font-bold">{session.user.name}</h1>
                <p className="text-gray-500">{session.user.email}</p>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 inline-block uppercase">{session.user.role} Account</span>
            </div>
        </div>

        {/* SECTION 1: MY BOOKINGS */}
        <h2 className="text-xl font-bold mb-4">🔑 My Car Bookings</h2>
        {data.myOrders.length === 0 ? (
            <div className="bg-white p-6 rounded-xl shadow-sm mb-8 text-gray-400">You haven't booked any cars yet.</div>
        ) : (
            <div className="grid md:grid-cols-2 gap-4 mb-8">
                {data.myOrders.map(car => (
                    <div key={car._id} className="bg-white p-4 rounded-xl shadow-sm flex gap-4 border-l-4 border-green-500">
                        <img src={car.images[0]} className="w-24 h-24 object-cover rounded" />
                        <div>
                            <h3 className="font-bold">{car.title}</h3>
                            <p className="text-sm text-gray-500">Booked for ₹{car.bookingAmount.toLocaleString()}</p>
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold mt-2 inline-block">🎉 BOOKED</span>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* SECTION 2: MY LISTINGS */}
        <h2 className="text-xl font-bold mb-4">📤 My Listings (Cars I'm Selling)</h2>
        {data.myListings.length === 0 ? (
            <div className="bg-white p-6 rounded-xl shadow-sm text-gray-400">You haven't listed any cars for sale.</div>
        ) : (
            <div className="grid md:grid-cols-2 gap-4">
                {data.myListings.map(car => (
                    <div key={car._id} className="bg-white p-4 rounded-xl shadow-sm flex gap-4 relative">
                        <img src={car.images[0]} className="w-24 h-24 object-cover rounded" />
                        <div>
                            <h3 className="font-bold">{car.title}</h3>
                            <p className="text-sm text-gray-500">₹{car.price.toLocaleString()}</p>
                            
                            {/* Status Badge */}
                            <div className="mt-2">
                                {car.status === 'PENDING' && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-bold">🕒 Pending Approval</span>}
                                {car.status === 'AVAILABLE' && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold">✅ Live on Store</span>}
                                {car.status === 'BOOKED' && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">💰 Sold / Booked</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

      </div>
    </div>
  )
}

export default Profile