import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  nom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  telephone: {
    type: String,
    required: false,
  },
  motDePasse: {
    type: String,
    required: true,
  },
  role: { 
    type: String, 
    enum: ["client", "proprietaire", "admin"], 
    default: "client" 
  },
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;