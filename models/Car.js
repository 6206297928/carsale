import mongoose from "mongoose";

const CarSchema = new mongoose.Schema({
  title: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  bookingAmount: { type: Number, required: true },
  year: { type: Number, required: true },
  kmDriven: { type: Number, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  
  status: { 
    type: String, 
    enum: ['AVAILABLE', 'BOOKED', 'SOLD', 'PENDING'], 
    default: 'AVAILABLE' 
  },
  
  sellerId: { type: String }, 
  buyerId: { type: String },
  buyerPhone: { type: String }, // <--- New Field
  transactionId: { type: String, default: null } 

}, { timestamps: true });

export default mongoose.models.Car || mongoose.model("Car", CarSchema);