"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [cars, setCars] = useState([])
  const [filteredCars, setFilteredCars] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [brand, setBrand] = useState('')
  const [sort, setSort] = useState('')

  useEffect(() => {
    fetch(`/api/cars?t=${Date.now()}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setCars(data)
        setFilteredCars(data)
        setLoading(false)
      })
      .catch(err => setLoading(false))
  }, [])

  // Filter Logic
  useEffect(() => {
    let result = [...cars]
    if (brand) result = result.filter(car => car.brand.toLowerCase().includes(brand.toLowerCase()))
    if (sort === 'low') result.sort((a, b) => a.price - b.price)
    if (sort === 'high') result.sort((a, b) => b.price - a.price)
    setFilteredCars(result)
  }, [brand, sort, cars])

  const uniqueBrands = [...new Set(cars.map(c => c.brand))]

  if (loading) return <div className="text-center p-20 text-xl font-bold text-gray-500">Loading Showroom...</div>

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-black mb-4">FIND YOUR DREAM CAR</h1>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto">Verified Sellers. Secure Payments. Instant Booking.</p>
      </div>

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row gap-4 items-center border border-gray-100">
            <select className="w-full p-3 border rounded-lg font-bold text-gray-700" onChange={(e) => setBrand(e.target.value)}>
                <option value="">All Brands</option>
                {uniqueBrands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            
            <select className="w-full p-3 border rounded-lg font-bold text-gray-700" onChange={(e) => setSort(e.target.value)}>
                <option value="">Sort By Price</option>
                <option value="low">Low to High</option>
                <option value="high">High to Low</option>
            </select>
        </div>
      </div>

      {/* Car Grid */}
      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredCars.map(car => (
            <div key={car._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden border border-gray-100 group">
                <div className="h-60 overflow-hidden relative">
                    <img src={car.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    {car.status === 'BOOKED' && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white font-black text-2xl tracking-wider border-4 border-white px-4 py-2 rotate-[-12deg]">SOLD OUT</span>
                        </div>
                    )}
                </div>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{car.title}</h2>
                            <p className="text-sm text-gray-500 uppercase font-bold tracking-wide">{car.brand}</p>
                        </div>
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{car.year}</span>
                    </div>
                    
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{car.description}</p>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <span className="text-2xl font-black text-blue-600">₹{car.price.toLocaleString()}</span>
                        
                        {/* 🔽 UPDATED: Button is always "Book Now" */}
                        {car.status === 'AVAILABLE' ? (
                            <Link href={`/cars/${car._id}`}>
                                <button className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition">
                                    Book Now
                                </button>
                            </Link>
                        ) : (
                            <button disabled className="bg-gray-200 text-gray-400 px-6 py-2 rounded-lg font-bold cursor-not-allowed">
                                Booked
                            </button>
                        )}
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  )
}