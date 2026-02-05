"use client"
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

const Navbar = () => {
  const { data: session } = useSession()
  const [pendingCount, setPendingCount] = useState(0)

  // Fetch Pending Count (Only if Admin)
  useEffect(() => {
    if (session?.user?.role === 'admin') {
      const fetchCount = async () => {
        try {
          // Add timestamp to prevent caching
          const res = await fetch(`/api/admin/pending?t=${Date.now()}`)
          const data = await res.json()
          if (Array.isArray(data)) {
            setPendingCount(data.length)
          }
        } catch (e) {
          console.error("Failed to fetch pending count")
        }
      }
      
      fetchCount() // Fetch immediately
      
      // Optional: Poll every 30 seconds to keep it fresh
      const interval = setInterval(fetchCount, 30000)
      return () => clearInterval(interval)
    }
  }, [session])

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-black text-blue-600 tracking-tighter">
          CARSALE<span className="text-black">.</span>
        </Link>

        {/* Desktop Menu */}
        <div className="flex items-center gap-6">
          
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-black">
            Showroom
          </Link>

          {/* 👑 ADMIN ONLY: Pending Cars Button */}
          {session?.user?.role === 'admin' && (
            <Link href="/admin/dashboard" className="relative group">
              <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition">
                Pending Cars
              </span>
              
              {/* 🔴 The Red Badge */}
              {pendingCount > 0 && (
                <span className="absolute -top-3 -right-4 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
                  {pendingCount}
                </span>
              )}
            </Link>
          )}

          {/* 🚗 CUSTOMER ONLY: Sell Car Button */}
          {session && session.user.role !== 'admin' && (
            <Link href="/sell" className="text-sm font-medium text-gray-600 hover:text-black">
              Sell Your Car
            </Link>
          )}

          {/* Auth Buttons */}
          {!session ? (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-bold hover:text-blue-600">
                Login
              </Link>
              <Link href="/register" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition">
                Get Started
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4 pl-4 border-l">
              <Link href="/profile">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs cursor-pointer hover:bg-blue-200 transition">
                  {session.user.name[0]}
                </div>
              </Link>
              <button 
                onClick={() => signOut()} 
                className="text-xs font-bold text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          )}

        </div>
      </div>
    </nav>
  )
}

export default Navbar