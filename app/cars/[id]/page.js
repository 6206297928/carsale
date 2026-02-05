"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation' // Import useRouter
import { useSession } from 'next-auth/react'
import QRModal from '@/components/QRModal'

const CarDetails = () => {
  const { id } = useParams()
  const router = useRouter() // For redirecting to login
  const { data: session } = useSession()
  const [car, setCar] = useState(null)
  const [showQR, setShowQR] = useState(false) 

  useEffect(() => {
    fetch(`/api/cars/${id}`).then(res => res.json()).then(setCar)
  }, [id])

  // 🔽 NEW LOGIC: Single Handler
  const handleBookClick = () => {
    if (session) {
        // If logged in, show the QR Code
        setShowQR(true)
    } else {
        // If NOT logged in, go to Login Page
        router.push('/login')
    }
  }

  if (!car) return <div className="p-20 text-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10">
      
      {showQR && (
        <QRModal 
            amount={car.bookingAmount} 
            carId={car._id} 
            onClose={() => setShowQR(false)} 
        />
      )}

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        <div className="md:w-1/2">
            <img src={car.images[0]} className="w-full h-full object-cover" />
        </div>

        <div className="md:w-1/2 p-8 flex flex-col justify-between">
            <div>
                <h1 className="text-3xl font-black mb-2">{car.title}</h1>
                <p className="text-gray-500 font-bold mb-6">{car.brand} • {car.year}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="font-bold text-lg">₹{car.price.toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-blue-500">Booking Token (5%)</p>
                        <p className="font-bold text-lg text-blue-700">₹{car.bookingAmount.toLocaleString()}</p>
                    </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-8">
                    {car.description}
                </p>
            </div>

            {/* 🔽 UPDATED: Single Unified Button */}
            <button 
                onClick={handleBookClick}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition shadow-lg"
            >
                Book Now
            </button>

        </div>
      </div>
    </div>
  )
}

export default CarDetails