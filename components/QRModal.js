"use client"
import React, { useState } from 'react'

const QRModal = ({ amount, carId, onClose }) => {
  const [txnId, setTxnId] = useState('')
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if(!txnId) return alert("Please enter the UPI Transaction ID")
    setLoading(true)

    const res = await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ carId, transactionId: txnId })
    })

    const data = await res.json()
    
    if(data.success) {
      alert("Booking Confirmed! ✅\nAdmin will verify your payment shortly.")
      window.location.href = '/profile' // Redirect to profile
    } else {
      alert(data.error)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative animate-fadeIn">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black font-bold">✕</button>

        <h2 className="text-xl font-black text-center mb-2">Scan & Pay</h2>
        <p className="text-center text-gray-500 text-sm mb-4">
            Booking Amount: <span className="text-black font-bold text-lg">₹{amount.toLocaleString()}</span>
        </p>

        {/* QR Code Image */}
        <div className="bg-gray-100 p-4 rounded-xl mb-4 border-2 border-dashed border-gray-300">
            <img src="/qrcode.jpeg" alt="Admin QR" className="w-full h-full object-contain mix-blend-multiply" />
        </div>

        {/* Input Field */}
        <div className="mb-4">
            <label className="text-xs font-bold text-gray-600 ml-1">UPI Transaction ID (UTR)</label>
            <input 
                type="text" 
                placeholder="e.g. 4281093..." 
                className="w-full p-3 border rounded-lg bg-gray-50 font-mono text-sm"
                value={txnId}
                onChange={(e) => setTxnId(e.target.value)}
            />
        </div>

        <button 
            onClick={handleConfirm}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition"
        >
            {loading ? "Verifying..." : "Confirm Payment"}
        </button>

      </div>
    </div>
  )
}

export default QRModal