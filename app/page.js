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
    // Fetch cars with a timestamp to prevent caching old data
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
      
      {/* 🆕 HERO SECTION: 3 Actions (Buy, Sell, Ride) */}
      <div className="bg-slate-900 text-white pt-12 pb-24 px-4 rounded-b-[3rem] shadow-xl mb-12">
        <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
              Whatever moves you.
            </h1>
            <p className="text-slate-400 mb-10 text-lg md:text-xl max-w-2xl mx-auto">
              Buy a premium verified car, sell your old one at the best price, or book a comfortable intercity ride.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 md:gap-6">
                
                {/* 1. Buy Car (Scrolls down to showroom) */}
                <button 
                  onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })} 
                  className="bg-white text-slate-900 px-6 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition flex items-center gap-2 shadow-lg"
                >
                    🚗 Buy Car
                </button>

                {/* 2. Sell Car (Links to Sell Page) */}
                <Link href="/sell">
                    <button className="bg-transparent border-2 border-white/30 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-white/10 transition flex items-center gap-2">
                        💰 Sell Car
                    </button>
                </Link>

                {/* 3. Book Ride (Links to Ride Page) */}
                <Link href="/rides">
                    <button className="bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2 border border-blue-500 shadow-lg shadow-blue-900/50">
                        🚖 Intercity Ride
                    </button>
                </Link>

            </div>
        </div>
      </div>

      {/* SHOWROOM HEADER */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            Latest Arrivals <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{cars.length} Cars</span>
        </h2>
      </div>

      {/* 📱 CAR GRID: Mobile (2 Cols) | Desktop (3 Cols) */}
      <div className="max-w-7xl mx-auto px-2 md:px-6 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
        
        {cars.map(car => (
            <div key={car._id} className="bg-white rounded-xl md:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden relative group">
                
                {/* 📸 IMAGE SLIDER (Horizontal Scroll) */}
                <div className="h-32 md:h-64 relative overflow-x-auto snap-x snap-mandatory flex scrollbar-hide">
                    {car.images.map((img, i) => (
                        <img key={i} src={img} className="w-full h-full object-cover flex-shrink-0 snap-center" alt={car.title} />
                    ))}
                    
                    {/* Badge showing photo count */}
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] md:text-xs px-2 py-1 rounded-full backdrop-blur-sm pointer-events-none">
                        {car.images.length} Photos
                    </div>

                    {/* Sold Overlay */}
                    {car.status === 'BOOKED' && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                            <span className="text-white text-xs md:text-3xl font-black border-2 md:border-4 border-white px-3 md:px-6 py-1 md:py-2 -rotate-12 tracking-widest uppercase">SOLD</span>
                        </div>
                    )}
                </div>

                {/* DETAILS SECTION */}
                <Link href={`/cars/${car._id}`}>
                    <div className="p-3 md:p-6">
                        <h2 className="text-sm md:text-xl font-bold text-gray-900 truncate">{car.title}</h2>
                        <p className="text-[10px] md:text-sm text-gray-500 uppercase font-bold mb-2 truncate">{car.brand} • {car.year} • {car.kmDriven}km</p>
                        
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50 md:border-gray-100">
                            <span className="text-sm md:text-2xl font-black text-blue-600">₹{(car.price/100000).toFixed(2)}L</span>
                            <span className="hidden md:block text-xs bg-gray-100 px-3 py-1.5 rounded-lg font-bold text-gray-600 hover:bg-black hover:text-white transition">View Details</span>
                        </div>
                    </div>
                </Link>

                {/* 🛡️ ADMIN ONLY CONTROLS */}
                {isAdmin && (
                    <div className="bg-blue-50 p-2 border-t border-blue-100 flex justify-center">
                        <Link href={`/admin/edit/${car._id}`} className="w-full">
                            <button className="w-full bg-blue-100 text-blue-700 text-[10px] md:text-sm font-bold py-1.5 rounded hover:bg-blue-200 uppercase tracking-wide">
                                ✏️ Edit / Delete
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