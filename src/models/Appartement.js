import mongoose from "mongoose";

const AppartementSchema = new mongoose.Schema(
  {
    titre: { 
     type: String, 
     required: true },
    description: {
      type: String },
    prix: { 
        type: Number, 
        required: true },
    ville: { 
        type: String, 
        required: true },
    adresse: { 
        type: String },
        images: [String],
    disponible: { 
        type: Boolean, 
        default: true },
    proprietaire: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Appartement || mongoose.model("Appartement", AppartementSchema);
