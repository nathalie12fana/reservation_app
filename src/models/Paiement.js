import mongoose from "mongoose";

const PaiementSchema = new mongoose.Schema(
  {
    reservation: { type: mongoose.Schema.Types.ObjectId, ref: "Reservation", required: true },
    utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    montant: { type: Number, required: true },
    datePaiement: { type: Date, default: Date.now },
    statut: { type: String, enum: ["en_attente", "effectué", "annulé"], default: "en_attente" },
    modePaiement: { type: String, enum: ["espèce", "carte", "mobileMoney"], default: "espèce" },
  },
  { timestamps: true }
);

export default mongoose.models.Paiement || mongoose.model("Paiement", PaiementSchema);
