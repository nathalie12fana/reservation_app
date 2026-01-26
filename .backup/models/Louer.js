import mongoose from "mongoose";

const LouerSchema = new mongoose.Schema(
  {
    appartement: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Appartement", 
      required: true 
    },
    utilisateur: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    reservation: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Reservation" 
    },
    dateDebut: { 
      type: Date, 
      required: true 
    },
    dateFin: { 
      type: Date, 
      required: true 
    },
    statut: { 
      type: String, 
      enum: ["en_cours", "terminée"], 
      default: "en_cours" 
    },
  },
  { timestamps: true }
);

export default mongoose.models.Louer || mongoose.model("Louer", LouerSchema);
