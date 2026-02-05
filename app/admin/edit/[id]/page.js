"use client"
import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ImageUploader from '@/components/ImageUploader'

const AdminEditCar = () => {
  const params = useParams()
  const id = params?.id 
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    title: '', brand: '', price: '', year: '', kmDriven: '', description: '', images: [] 
  })

  useEffect(() => {
    if (!id) return;
    fetch(`/api/cars/${id}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
            ...data, 
            images: Array.isArray(data.images) ? data.images : [] 
        })
        setLoading(false)
      })
      .catch(err => setLoading(false))
  }, [id])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })
  const handleImageUpload = (url) => setFormData(prev => ({ ...prev, images: [...prev.images, url] }))
  const removeImage = (indexToRemove) => setFormData(prev => ({ ...prev, images: prev.images.filter((_, index) => index !== indexToRemove) }))

  const handleSaveAndApprove = async (e) => {
    e.preventDefault()
    if (!id) return;

    const price = Number(formData.price) || 0
    const bookingAmount = price * 0.05 

    const res = await fetch(`/api/cars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        price,
        bookingAmount,
        status: 'AVAILABLE' 
      })
    })

    if (res.ok) {
      alert("Car Updated & Approved Successfully! ✅")
      // 🛑 FORCE HARD REFRESH: Bypasses all Next.js caches
      window.location.href = '/admin/dashboard'; 
    } else {
      alert("Error updating car")
    }
  }

  if (loading) return <div className="p-10 text-center">Loading Car Details...</div>

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-blue-100">
        <h1 className="text-2xl font-black mb-6 text-blue-900">✏️ Edit & Verify Car</h1>
        <form onSubmit={handleSaveAndApprove} className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border">
            <label className="block text-sm font-bold mb-2">Manage Photos</label>
            {formData.images && formData.images.length > 0 ? (
                <div className="flex gap-4 flex-wrap mb-4">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative w-24 h-24 group bg-white shadow-sm rounded overflow-hidden border">
                        <img src={img} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg font-bold">✕</button>
                    </div>
                  ))}
                </div>
            ) : <p className="text-red-500 text-sm mb-4">⚠️ No images found.</p>}
            <ImageUploader onUpload={handleImageUpload} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
                <label className="text-sm font-bold text-gray-600">Car Title</label>
                <input name="title" value={formData.title || ''} onChange={handleChange} className="w-full p-3 border rounded-lg font-bold" />
            </div>
            <div>
                <label className="text-sm font-bold text-gray-600">Brand</label>
                <input type="text" name="brand" value={formData.brand || ''} onChange={handleChange} placeholder="e.g. Mercedes-Benz" className="w-full p-3 border rounded-lg" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
                <label className="text-sm font-bold text-gray-600">Price (₹)</label>
                <input name="price" type="number" value={formData.price || ''} onChange={handleChange} className="w-full p-3 border rounded-lg" />
            </div>
            <div>
                <label className="text-sm font-bold text-gray-600">Year</label>
                <input name="year" type="number" value={formData.year || ''} onChange={handleChange} className="w-full p-3 border rounded-lg" />
            </div>
            <div>
                <label className="text-sm font-bold text-gray-600">KM Driven</label>
                <input name="kmDriven" type="number" value={formData.kmDriven || ''} onChange={handleChange} className="w-full p-3 border rounded-lg" />
            </div>
          </div>

          <div>
             <label className="text-sm font-bold text-gray-600">Description</label>
             <textarea name="description" value={formData.description || ''} onChange={handleChange} className="w-full p-3 border rounded-lg h-32" />
          </div>

          <div className="pt-4 flex gap-4">
            <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold text-lg shadow-lg transition transform active:scale-95">✅ Save Changes & Approve</button>
            <button type="button" onClick={() => router.back()} className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-700">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default AdminEditCar