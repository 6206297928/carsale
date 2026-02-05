import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String }, // <--- NEW FIELD
  role: { 
    type: String, 
    enum: ["customer", "admin"], 
    default: "customer" 
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);