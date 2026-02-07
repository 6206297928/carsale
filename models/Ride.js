import mongoose from "mongoose";

const RideSchema = new mongoose.Schema({
  // 🟢 Make userId Optional (So guests can book)
  userId: { type: String, default: "Guest" }, 
  
  source: { type: String, required: true },
  destination: { type: String, required: true },
  date: { type: String, required: true },
  carType: { type: String, default: '4 Seater' },
  
  // 📞 Phone is the most important field now
  userPhone: { type: String, required: true }, 
  
  status: { 
    type: String, 
    enum: ['PENDING', 'CONTACTED', 'COMPLETED', 'CANCELLED'], 
    default: 'PENDING' 
  },
}, { timestamps: true });

export default mongoose.models.Ride || mongoose.model("Ride", RideSchema);