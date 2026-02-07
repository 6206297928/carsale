import mongoose from "mongoose";

const RideSchema = new mongoose.Schema({
  source: { type: String, required: true },
  destination: { type: String, required: true },
  date: { type: String, required: true },
  carType: { type: String, enum: ['Sedan', 'SUV', 'Luxury'], default: 'Sedan' },
  userPhone: { type: String, required: true }, // 📞 Crucial for Admin to call back
  status: { 
    type: String, 
    enum: ['PENDING', 'CONTACTED', 'COMPLETED', 'CANCELLED'], 
    default: 'PENDING' 
  },
}, { timestamps: true });

export default mongoose.models.Ride || mongoose.model("Ride", RideSchema);