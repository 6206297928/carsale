"use client"
import { CldUploadWidget } from 'next-cloudinary';

const ImageUploader = ({ onUpload }) => {
  return (
    <CldUploadWidget 
      uploadPreset="carsale_preset" 
      onSuccess={(result) => {
        // Send the image URL back to the form
        onUpload(result.info.secure_url); 
      }}
    >
      {({ open }) => {
        return (
          <button 
            type="button" onClick={() => open()}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:bg-blue-50 transition"
          >
            <span className="text-2xl">📷</span>
            <span className="text-sm text-gray-500 mt-2">Upload Car Photos</span>
          </button>
        );
      }}
    </CldUploadWidget>
  );
};

export default ImageUploader;