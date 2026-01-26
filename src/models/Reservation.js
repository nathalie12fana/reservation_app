import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema(
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
      enum: ["en_attente", "confirmée", "annulée"], 
      default: "en_attente" 
    },
    prixTotal: { 
      type: Number, 
      required: true 
    },
  },
  { timestamps: true }
);

export default mongoose.models.Reservation || mongoose.model("Reservation", ReservationSchema);
