import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-400 py-3 text-center text-xs border-t border-slate-800">
      <p>&copy; {new Date().getFullYear()} CARSALE. All rights reserved.</p>
    </footer>
  )
}

export default Footer