"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'admin'
  const router = useRouter()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/cars?t=${Date.now()}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setCars(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="text-center p-20 text-sm font-bold text-gray-400">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Navbar Buffer */}
      <div className="h-4"></div>

      {/* GRID LOGIC: 
         - mobile: grid-cols-2 (Small cards, 2 per row)
         - desktop: md:grid-cols-3 (Big cards, 3 per row - restored to previous size)
      */}
      <div className="max-w-7xl mx-auto px-2 md:px-6 grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-8">
        
        {cars.map(car => (
            <div key={car._id} className="bg-white rounded-lg md:rounded-2xl shadow-sm hover:shadow-xl transition border border-gray-100 overflow-hidden relative group">
                
                {/* 📸 SLIDER */}
                <div className="h-32 md:h-64 relative overflow-x-auto snap-x snap-mandatory flex scrollbar-hide">
                    {car.images.map((img, i) => (
                        <img key={i} src={img} className="w-full h-full object-cover flex-shrink-0 snap-center" />
                    ))}
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] md:text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                        {car.images.length} Photos
                    </div>
                    {car.status === 'BOOKED' && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                            <span className="text-white text-xs md:text-2xl font-black border-2 md:border-4 border-white px-2 md:px-4 py-1 md:py-2 -rotate-12">SOLD</span>
                        </div>
                    )}
                </div>

                {/* DETAILS */}
                <Link href={`/cars/${car._id}`}>
                    <div className="p-2 md:p-6">
                        <h2 className="text-xs md:text-xl font-bold text-gray-900 truncate">{car.title}</h2>
                        <p className="text-[10px] md:text-sm text-gray-500 uppercase font-bold mb-1 md:mb-2 truncate">{car.brand} • {car.year}</p>
                        
                        <div className="flex items-center justify-between mt-2 pt-2 md:border-t md:border-gray-100">
                            <span className="text-sm md:text-2xl font-black text-blue-600">₹{(car.price/100000).toFixed(2)}L</span>
                            {/* Hidden on mobile to save space, visible on desktop */}
                            <span className="hidden md:block text-xs bg-gray-100 px-2 py-1 rounded font-bold text-gray-600">View</span>
                        </div>
                    </div>
                </Link>

                {/* ADMIN CONTROLS */}
                {isAdmin && (
                    <div className="bg-gray-50 p-1 md:p-2 border-t flex justify-center">
                        <Link href={`/admin/edit/${car._id}`} className="w-full">
                            <button className="w-full bg-blue-100 text-blue-700 text-[10px] md:text-sm font-bold py-1 md:py-2 rounded hover:bg-blue-200 uppercase tracking-wide">
                                ✏️ Edit Details
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        ))}
      </div>
    </div>
  )
}