"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md">
      {/* Increased Width to 95% */}
      <div className="max-w-[95%] mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* LOGO: Bigger & Bolder */}
        <Link href="/" className="text-3xl md:text-4xl font-black text-white tracking-tighter">
          CARSALE<span className="text-blue-500">.</span>
        </Link>

        {/* RIGHT SIDE ACTIONS */}
        <div className="flex items-center gap-6">
          
          {pathname !== '/' && (
            <Link href="/" className="text-sm font-bold text-gray-300 hover:text-white transition hidden md:block">
              Showroom
            </Link>
          )}

          {session ? (
            <div className="relative">
              {/* USER ICON */}
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 bg-white text-slate-900 rounded-full flex items-center justify-center font-bold text-lg hover:bg-gray-200 transition border-2 border-slate-700"
              >
                {session.user?.email?.[0].toUpperCase()}
              </button>

              {/* DROPDOWN MENU */}
              {menuOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)}></div>
                    <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20 animate-fadeIn">
                        <div className="px-4 py-3 bg-gray-50 border-b">
                            <p className="text-xs text-gray-500">Signed in as</p>
                            <p className="text-sm font-bold text-gray-900 truncate">{session.user.email}</p>
                        </div>
                        <div className="py-1">
                            {session.user.role === 'admin' ? (
                                <Link href="/admin/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium">🛡️ Admin Dashboard</Link>
                            ) : (
                                <Link href="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium">👤 My Profile</Link>
                            )}
                            <Link href="/sell" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium">🚗 Sell Car</Link>
                            <button onClick={() => signOut()} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold border-t mt-1">Logout</button>
                        </div>
                    </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/login">
              <button className="bg-white text-slate-900 px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition">
                Login
              </button>
            </Link>
          )}

        </div>
      </div>
    </nav>
  )
}

export default Navbar