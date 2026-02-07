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
    carType: 'Sedan',
    userPhone: ''
  })

  // 📞 YOUR ADMIN WHATSAPP NUMBER (International Format without +)
  const ADMIN_WHATSAPP = "916206297928"; 

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
        // 1. Save to Database first (So you never lose a lead)
        const res = await fetch('/api/ride', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

        if(res.ok) {
            // 2. Format the message for WhatsApp
            // We use encodeURIComponent to handle spaces and newlines correctly
            const messageText = `🚖 *New Ride Request* \n\n` +
                                `📍 From: ${formData.source}\n` +
                                `📍 To: ${formData.destination}\n` +
                                `📅 Date: ${formData.date}\n` +
                                `🚗 Car: ${formData.carType}\n` +
                                `📞 Customer Phone: ${formData.userPhone}`;

            const encodedMsg = encodeURIComponent(messageText);
            
            // 3. Smart Redirect Logic
            // Check if user is on a Mobile Device to open the App directly
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            if (isMobile) {
                // Force open the WhatsApp App on Mobile
                window.location.href = `whatsapp://send?phone=${ADMIN_WHATSAPP}&text=${encodedMsg}`;
            } else {
                // Open WhatsApp Web on Desktop in a new tab
                window.open(`https://web.whatsapp.com/send?phone=${ADMIN_WHATSAPP}&text=${encodedMsg}`, '_blank');
            }

            // 4. Show success and redirect home after a short delay
            setTimeout(() => {
                alert("Request Sent! Admin will contact you shortly.");
                router.push('/');
            }, 1000);

        } else {
            alert("Failed to save booking. Please try again.");
        }
    } catch (error) {
        console.error("Booking Error:", error);
        alert("Something went wrong.");
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4">
      <div className="w-full max-w-lg mt-10">
        <h1 className="text-3xl font-black mb-2 text-blue-900">Book Intercity Ride 🚖</h1>
        <p className="text-gray-500 mb-8">We will call you to confirm the fare.</p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm">
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 ml-1">From</label>
                    <input 
                        required 
                        placeholder="City (e.g. Ranchi)" 
                        className="w-full p-3 rounded-lg border font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
                        onChange={e => setFormData({...formData, source: e.target.value})} 
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 ml-1">To</label>
                    <input 
                        required 
                        placeholder="City (e.g. JSR)" 
                        className="w-full p-3 rounded-lg border font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
                        onChange={e => setFormData({...formData, destination: e.target.value})} 
                    />
                </div>
            </div>

            <div>
                <label className="text-xs font-bold text-gray-500 ml-1">Travel Date</label>
                <input 
                    required 
                    type="date" 
                    className="w-full p-3 rounded-lg border font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" 
                    onChange={e => setFormData({...formData, date: e.target.value})} 
                />
            </div>

            <div>
                <label className="text-xs font-bold text-gray-500 ml-1">Your Mobile Number</label>
                <input 
                    required 
                    type="number" 
                    placeholder="9876543210" 
                    className="w-full p-3 rounded-lg border font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
                    onChange={e => setFormData({...formData, userPhone: e.target.value})} 
                />
            </div>

            <div>
                <label className="text-xs font-bold text-gray-500 ml-1 mb-2 block">Select Car Type</label>
                <div className="grid grid-cols-3 gap-2">
                    {['Sedan', 'SUV', 'Large'].map(type => (
                        <button 
                            type="button" 
                            key={type}
                            onClick={() => setFormData({...formData, carType: type})}
                            className={`p-3 rounded-lg border font-bold text-sm transition-all ${formData.carType === type ? 'bg-black text-white border-black shadow-lg' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <button 
                disabled={loading} 
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg mt-4 flex items-center justify-center gap-2"
            >
                {loading ? "Processing..." : (
                    <>
                        <span>Request on WhatsApp</span>
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