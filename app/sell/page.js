"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import ImageUploader from '@/components/ImageUploader'

const Sell = () => {
  const { data: session } = useSession()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    title: '',
    brand: '', // <--- Now a text field
    price: '',
    year: '',
    kmDriven: '',
    description: '',
    images: []
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageUpload = (url) => {
    setFormData(prev => ({ ...prev, images: [...prev.images, url] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Simple Validation
    if(!formData.title || !formData.brand || !formData.price || formData.images.length === 0) {
      alert("Please fill all details and upload at least one image.")
      return;
    }

    const price = Number(formData.price)
    const bookingAmount = price * 0.05 // 5% token amount

    const res = await fetch('/api/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        price,
        bookingAmount,
        sellerId: session?.user?.email 
      })
    })

    if (res.ok) {
      alert("Car Listed Successfully! Waiting for Admin Approval.")
      router.push('/profile')
    }
  }

  if (!session) return <div className="p-20 text-center">Please Login to Sell</div>

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Sell Your Car</h1>
        <p className="text-gray-500 mb-8">Enter the details below. Our team will verify it shortly.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Image Uploader */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <label className="block text-sm font-bold text-blue-900 mb-2">Car Photos</label>
            <div className="flex gap-4 mb-4 flex-wrap">
              {formData.images.map((img, i) => (
                <img key={i} src={img} className="w-20 h-20 object-cover rounded-lg border shadow-sm" />
              ))}
            </div>
            <ImageUploader onUpload={handleImageUpload} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Ad Title</label>
              <input name="title" placeholder="e.g. 2020 Honda City ZX" onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
            </div>

            {/* 🔽 UPDATED: BRAND TEXT INPUT */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Brand</label>
              <input 
                type="text" 
                name="brand" 
                placeholder="e.g. Mercedes-Benz" 
                onChange={handleChange} 
                className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹)</label>
              <input type="number" name="price" placeholder="500000" onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Year</label>
              <input type="number" name="year" placeholder="2021" onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">KM Driven</label>
              <input type="number" name="kmDriven" placeholder="15000" onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea name="description" placeholder="Tell us about the car condition, features, etc." onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl h-32"></textarea>
          </div>

          <button className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition transform active:scale-95">
            Submit for Approval 🚀
          </button>

        </form>
      </div>
    </div>
  )
}

export default Sell