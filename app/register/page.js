"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const Register = () => {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', secret: '' })
  const [isAdminSignup, setIsAdminSignup] = useState(false) // Toggle for Admin field
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 1. Determine Role based on Secret Key
    // Only check secret if the "Admin" checkbox is actually checked
    const role = (isAdminSignup && form.secret === 'admin123') ? 'admin' : 'customer'

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role })
      })

      if (res.ok) {
        alert('Account created successfully! Please login.')
        router.push('/login')
      } else {
        const data = await res.json()
        setError(data.error || 'Registration failed')
      }
    } catch (err) {
      setError('Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-black mb-2 text-center">Create Account</h1>
        <p className="text-center text-gray-500 mb-6">Join CARSALE to buy & sell cars.</p>
        
        {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Standard Fields for Everyone */}
          <input 
            placeholder="Full Name" 
            className="w-full p-3 border rounded-lg"
            onChange={(e) => setForm({...form, name: e.target.value})}
            required
          />
          <input 
            type="email" placeholder="Email Address" 
            className="w-full p-3 border rounded-lg"
            onChange={(e) => setForm({...form, email: e.target.value})}
            required
          />
          <input 
            type="tel" placeholder="Mobile Number" 
            className="w-full p-3 border rounded-lg"
            onChange={(e) => setForm({...form, mobile: e.target.value})}
            required
          />
          <input 
            type="password" placeholder="Password" 
            className="w-full p-3 border rounded-lg"
            onChange={(e) => setForm({...form, password: e.target.value})}
            required
          />
          
          {/* Admin Toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isAdminSignup}
                onChange={(e) => setIsAdminSignup(e.target.checked)}
                className="rounded border-gray-300"
              />
              I am an Agency Owner
            </label>
          </div>

          {/* Conditional Secret Key Field (Only shows if checked) */}
          {isAdminSignup && (
            <div className="p-3 bg-gray-50 rounded border animate-fade-in">
              <p className="text-xs text-gray-500 mb-1 font-bold">Admin Verification</p>
              <input 
                type="password" placeholder="Enter Secret Key" 
                className="w-full p-2 border rounded text-sm"
                onChange={(e) => setForm({...form, secret: e.target.value})}
              />
            </div>
          )}

          <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account? <Link href="/login" className="text-blue-600 font-bold">Login here</Link>
        </p>
      </div>
    </div>
  )
}

export default Register