"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const BookRide = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    date: '',
    carType: '4 Seater', // Default
    userPhone: ''
  })

  // 📞 YOUR ADMIN WHATSAPP NUMBER
  const ADMIN_WHATSAPP = "918210633753"; 

  const carOptions = [
    { label: "4 Seater", desc: "Sedan / Hatchback" },
    { label: "7 Seater", desc: "Ertiga / Innova" },
    { label: "9 Seater", desc: "Tempo Traveller" },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
        // 1. Save to Database
        const res = await fetch('/api/ride', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

        if(res.ok) {
            // 2. Format Message
            const messageText = `🚖 *Intercity Ride Request* \n\n` +
                                `📍 From: ${formData.source}\n` +
                                `📍 To: ${formData.destination}\n` +
                                `📅 Date: ${formData.date}\n` +
                                `👥 Capacity: ${formData.carType}\n` +
                                `📞 Customer: ${formData.userPhone}`;

            const encodedMsg = encodeURIComponent(messageText);
            
            // 3. Smart Redirect (Mobile vs Desktop)
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            if (isMobile) {
                window.location.href = `whatsapp://send?phone=${ADMIN_WHATSAPP}&text=${encodedMsg}`;
            } else {
                window.open(`https://web.whatsapp.com/send?phone=${ADMIN_WHATSAPP}&text=${encodedMsg}`, '_blank');
            }

            setTimeout(() => {
                alert("Request Sent! We will check availability and call you.");
                router.push('/');
            }, 1000);

        } else {
            alert("Connection error. Please try again.");
        }
    } catch (error) {
        console.error(error);
        alert("Something went wrong.");
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4">
      <div className="w-full max-w-lg mt-8 mb-20">
        
        <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-blue-900">Book Intercity Cab 🚖</h1>
            <p className="text-gray-500 text-sm">Reliable outstation rides.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xl">
            
            {/* Route Inputs */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 ml-1">From City</label>
                    <input 
                        required 
                        placeholder="e.g. CBSA" 
                        className="w-full p-3 rounded-xl border border-gray-200 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        onChange={e => setFormData({...formData, source: e.target.value})} 
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 ml-1">To City</label>
                    <input 
                        required 
                        placeholder="e.g. Ranchi" 
                        className="w-full p-3 rounded-xl border border-gray-200 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        onChange={e => setFormData({...formData, destination: e.target.value})} 
                    />
                </div>
            </div>

            {/* Date & Phone */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 ml-1">Travel Date</label>
                    <input 
                        required 
                        type="date" 
                        className="w-full p-3 rounded-xl border border-gray-200 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        onChange={e => setFormData({...formData, date: e.target.value})} 
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 ml-1">Mobile No.</label>
                    <input 
                        required 
                        type="number" 
                        placeholder="98765..." 
                        className="w-full p-3 rounded-xl border border-gray-200 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        onChange={e => setFormData({...formData, userPhone: e.target.value})} 
                    />
                </div>
            </div>

            {/* 🆕 SEATING SELECTION */}
            <div>
                <label className="text-xs font-bold text-gray-500 ml-1 mb-2 block">Select Vehicle Size</label>
                <div className="grid grid-cols-3 gap-2">
                    {carOptions.map((opt) => (
                        <div 
                            key={opt.label}
                            onClick={() => setFormData({...formData, carType: opt.label})}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-center
                                ${formData.carType === opt.label 
                                    ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md transform scale-105' 
                                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                                }`}
                        >
                            <span className="font-black text-sm block">{opt.label}</span>
                            <span className="text-[9px] opacity-70 leading-tight mt-1">{opt.desc}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Submit Button */}
            <button 
                disabled={loading} 
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition shadow-lg mt-4 flex items-center justify-center gap-2"
            >
                {loading ? "Processing..." : (
                    <>
                        <span>Check Availability</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592z"/>
                        </svg>
                    </>
                )}
            </button>
        </form>
      </div>
    </div>
  )
}

export default BookRide