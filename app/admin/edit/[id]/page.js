"use client"
import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation' 

const EditCar = () => {
  const router = useRouter()
  const params = useParams()
  // React.use() or ensuring params are ready isn't needed for client components params hook
  // But we accept that params might be async in future, currently useParams hook handles it.
  const id = params?.id 
  
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    year: '',
    kmDriven: '',
    fuelType: 'Petrol',
    price: '',
    description: '',
    images: '',
    status: 'AVAILABLE'
  })

  // 1. FETCH EXISTING DATA
  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;

      try {
        // 🟢 FIX 2: Changed URL from /api/car/... to /api/cars/...
        const res = await fetch(`/api/cars/${id}`)
        
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Server returned HTML instead of JSON.");
        }

        const data = await res.json()
        
        if (data.error) {
            alert("Car not found!")
            router.push('/')
        } else {
            setFormData({
                ...data,
                images: Array.isArray(data.images) ? data.images.join(',') : data.images
            })
        }
      } catch (error) {
        console.error("Failed to fetch car:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCar()
  }, [id, router])

  // 2. HANDLE UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
        const formattedData = {
            ...formData,
            images: formData.images.split(',').map(url => url.trim())
        }

        // 🟢 FIX 2: URL to /api/cars/
        const res = await fetch(`/api/cars/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedData)
        })

        if(res.ok) {
            alert("Car Updated Successfully! ✅")
            router.push('/')
        } else {
            alert("Update Failed ❌")
        }
    } catch (error) {
        console.error(error)
        alert("Something went wrong.")
    }
    setLoading(false)
  }

  // 3. HANDLE DELETE
  const handleDelete = async () => {
    if(!confirm("Are you sure you want to delete this car?")) return;

    setLoading(true)
    try {
        // 🟢 FIX 2: URL to /api/cars/
        const res = await fetch(`/api/cars/${id}`, {
            method: 'DELETE',
        })

        if(res.ok) {
            alert("Car Deleted Successfully! 🗑️")
            router.push('/')
        } else {
            alert("Delete Failed ❌")
        }
    } catch (error) {
        console.error(error)
        alert("Something went wrong.")
    }
    setLoading(false)
  }

  if (loading) return <div className="p-20 text-center font-bold text-gray-500">Loading Car Details...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center pb-20">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h1 className="text-2xl font-black text-gray-800">Edit Car Details ✏️</h1>
            <button onClick={() => router.back()} className="text-gray-400 font-bold text-sm">Cancel</button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-5">
            {/* Same form fields as before - kept brief for copy-pasting */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="p-3 border rounded-lg w-full font-bold" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                <input className="p-3 border rounded-lg w-full font-bold" placeholder="Brand" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <input type="number" className="p-3 border rounded-lg w-full" placeholder="Year" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
                <input type="number" className="p-3 border rounded-lg w-full" placeholder="KM" value={formData.kmDriven} onChange={e => setFormData({...formData, kmDriven: e.target.value})} />
                <select className="p-3 border rounded-lg w-full bg-white" value={formData.fuelType} onChange={e => setFormData({...formData, fuelType: e.target.value})}>
                    <option>Petrol</option><option>Diesel</option><option>CNG</option><option>Electric</option>
                </select>
            </div>
            <input type="number" className="p-3 border rounded-lg w-full font-black text-green-700" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            <textarea className="p-3 border rounded-lg w-full text-xs" rows="3" placeholder="Image URLs..." value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} />
            <textarea className="p-3 border rounded-lg w-full" rows="4" placeholder="Description..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            <select className="p-3 border-2 border-blue-100 bg-blue-50 rounded-lg w-full font-bold text-blue-900" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="AVAILABLE">✅ Available</option>
                <option value="BOOKED">🔒 Booked</option>
                <option value="PENDING">⏳ Pending</option>
            </select>

            <div className="pt-6 flex gap-4">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition shadow-lg">💾 Save Changes</button>
                <button type="button" onClick={handleDelete} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-3.5 rounded-xl font-bold transition">🗑️ Delete Car</button>
            </div>
        </form>
      </div>
    </div>
  )
}

export default EditCar