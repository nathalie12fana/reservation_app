import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: { 
    type: String, 
    enum: ["locataire", "proprietaire", "admin"], 
    default: "locataire" },
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
