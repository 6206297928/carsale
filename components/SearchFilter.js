"use client"
import { useState } from 'react'

const SearchFilter = ({ onFilter }) => {
  const [brand, setBrand] = useState('')
  const [sort, setSort] = useState('newest') // Default sort

  const handleChange = (key, value) => {
    // Update local state
    if (key === 'brand') setBrand(value)
    if (key === 'sort') setSort(value)

    // Send data to parent
    onFilter({
      brand: key === 'brand' ? value : brand,
      sort: key === 'sort' ? value : sort
    })
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
      
      {/* 1. Filter by Brand */}
      <div className="w-full md:w-1/2">
        <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Filter by Brand</label>
        <select 
          className="w-full p-3 border rounded-lg bg-gray-50 outline-none cursor-pointer hover:bg-white transition"
          value={brand}
          onChange={(e) => handleChange('brand', e.target.value)}
        >
          <option value="">All Brands</option>
          <option value="Maruti">Maruti Suzuki</option>
          <option value="Hyundai">Hyundai</option>
          <option value="Honda">Honda</option>
          <option value="Tata">Tata</option>
          <option value="BMW">BMW</option>
          <option value="Mercedes">Mercedes</option>
          <option value="Toyota">Toyota</option>
          <option value="Mahindra">Mahindra</option>
        </select>
      </div>

      {/* 2. Sort By Price/Date */}
      <div className="w-full md:w-1/2">
        <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Sort Cars</label>
        <select 
          className="w-full p-3 border rounded-lg bg-gray-50 outline-none cursor-pointer hover:bg-white transition"
          value={sort}
          onChange={(e) => handleChange('sort', e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
        </select>
      </div>

    </div>
  )
}

export default SearchFilter