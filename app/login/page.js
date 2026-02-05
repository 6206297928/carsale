"use client"
import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const Login = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('customer') // 'customer' or 'admin'
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false
    })

    if (res.error) {
      alert("Invalid Credentials")
      setLoading(false)
    } else {
      // Redirect based on Tab Selection
      if (activeTab === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/')
      }
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">
        
        {/* TABS HEADER */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
          <button 
            onClick={() => setActiveTab('customer')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'customer' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-700'}`}
          >
            👤 Customer Login
          </button>
          <button 
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'admin' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            🛡️ Admin Login
          </button>
        </div>

        <h1 className="text-2xl font-black text-center mb-2">
            {activeTab === 'customer' ? 'Welcome Back!' : 'Admin Portal'}
        </h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
            {activeTab === 'customer' ? 'Login to buy or sell your car.' : 'Secure access for staff only.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
            <input 
                type="email" 
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="name@example.com"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input 
                type="password" 
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="••••••••"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white transition active:scale-95 ${activeTab === 'customer' ? 'bg-black hover:bg-gray-800' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? "Verifying..." : `Login as ${activeTab === 'customer' ? 'Customer' : 'Admin'}`}
          </button>
        </form>

        {activeTab === 'customer' && (
            <p className="text-center mt-6 text-sm text-gray-500">
                New here? <Link href="/register" className="font-bold text-black underline">Create Account</Link>
            </p>
        )}
      </div>
    </div>
  )
}

export default Login