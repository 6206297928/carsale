"use client"
import React, { useState } from 'react'

const QRModal = ({ amount, carId, onClose }) => {
  const [txnId, setTxnId] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if(!txnId || !phone) return alert("Please enter Transaction ID and Phone Number")
    setLoading(true)

    const res = await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ carId, transactionId: txnId, phone })
    })

    const data = await res.json()
    
    if(data.success) {
      alert("Booking Confirmed! ✅\nAdmin will contact you shortly.")
      window.location.href = '/' 
    } else {
      alert(data.error)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 font-bold text-xl">✕</button>

        <h2 className="text-xl font-black text-center mb-1">Scan & Pay</h2>
        <p className="text-center text-blue-600 font-bold text-lg mb-4">₹{amount.toLocaleString()}</p>

        <div className="bg-gray-100 p-2 rounded-xl mb-4 h-40 flex items-center justify-center">
            <img src="/qrcode.jpg" alt="QR" className="h-full object-contain mix-blend-multiply" />
        </div>

        <div className="space-y-3">
            <div>
                <label className="text-xs font-bold text-gray-500 ml-1">Your Phone Number</label>
                <input type="number" placeholder="9876543210" className="w-full p-2 border rounded-lg bg-gray-50 text-sm font-bold" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 ml-1">UPI Ref / UTR Number</label>
                <input type="text" placeholder="e.g. 428109..." className="w-full p-2 border rounded-lg bg-gray-50 text-sm font-bold" value={txnId} onChange={(e) => setTxnId(e.target.value)} />
            </div>
        </div>

        <button onClick={handleConfirm} disabled={loading} className="w-full bg-black text-white py-3 rounded-xl font-bold mt-4 text-sm">
            {loading ? "Processing..." : "Submit Payment Details"}
        </button>
      </div>
    </div>
  )
}

export default QRModal