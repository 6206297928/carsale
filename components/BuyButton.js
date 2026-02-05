"use client"
import React, { useState } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react' // 1. Import Auth hooks

const BuyButton = ({ car, amount }) => {
  const { data: session } = useSession() // 2. Get user session data
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePayment = async () => {
    // 3. CHECK LOGIN STATUS FIRST
    if (!session) {
      alert("Please login to book this car! 🔒")
      signIn() // Redirects to the login page
      return
    }

    setLoading(true)

    // 4. Create Order on Backend
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        carId: car._id, 
        amount: amount 
      })
    })
    
    const data = await res.json()

    if (!res.ok) {
      alert(data.error)
      setLoading(false)
      return
    }

    // 5. Open Razorpay Options
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.order.amount,
      currency: "INR",
      name: "CARSALE Agency",
      description: `Booking Token for ${car.title}`,
      order_id: data.order.id,
      handler: async function (response) {
        // Verify Payment on Backend
        const verifyRes = await fetch('/api/verify', {
          method: 'POST',
          body: JSON.stringify({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            carId: car._id
          })
        })

        if (verifyRes.ok) {
          alert('Booking Successful! 🎉')
          router.refresh() // Reload page to update status
        } else {
          alert('Payment verification failed.')
        }
      },
      prefill: {
        // 6. Auto-fill the logged-in user's details
        name: session?.user?.name || "Customer", 
        email: session?.user?.email || "customer@example.com",
        contact: "" // We don't have phone number in User model yet
      },
      theme: {
        color: "#2563EB"
      }
    }

    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
    setLoading(false)
  }

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      
      <button 
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold text-lg transition shadow-lg transform active:scale-95 disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay ₹${amount.toLocaleString()} to Book`}
      </button>
    </>
  )
}

export default BuyButton