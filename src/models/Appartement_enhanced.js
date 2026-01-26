import mongoose from "mongoose";

const AppartementSchema = new mongoose.Schema(
  {
    titre: { 
      type: String, 
      required: [true, "Le titre est requis"],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: ["Studio", "Appartement", "Villa", "Duplex", "Chambre"],
      default: "Appartement"
    },
    prix: { 
      type: Number, 
      required: [true, "Le prix est requis"],
      min: [0, "Le prix ne peut pas être négatif"]
    },
    ville: { 
      type: String, 
      required: [true, "La ville est requise"],
      trim: true
    },
    adresse: { 
      type: String,
      trim: true
    },
    localisation: {
      type: String,
      trim: true
    },
    pieces: {
      type: Number,
      min: 0,
      default: 1
    },
    chambres: {
      type: Number,
      min: 0,
      default: 1
    },
    sallesDeBain: {
      type: Number,
      min: 0,
      default: 1
    },
    surface: {
      type: Number, // en m²
      min: 0
    },
    images: {
      type: [String],
      default: []
    },
    services: {
      type: [String],
      default: []
    },
    disponible: { 
      type: Boolean, 
      default: true 
    },
    meuble: {
      type: Boolean,
      default: false
    },
    proprietaire: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User"
    },
    // Additional useful fields
    etage: {
      type: Number
    },
    parking: {
      type: Boolean,
      default: false
    },
    animauxAutorises: {
      type: Boolean,
      default: false
    },
    dateDisponibilite: {
      type: Date,
      default: Date.now
    },
    vues: {
      type: Number,
      default: 0
    },
    favoris: {
      type: Number,
      default: 0
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for search performance
AppartementSchema.index({ ville: 1, disponible: 1, prix: 1 });
AppartementSchema.index({ titre: "text", description: "text" });

// Virtual for price per square meter
AppartementSchema.virtual("prixParM2").get(function() {
  if (this.surface && this.surface > 0) {
    return Math.round(this.prix / this.surface);
  }
  return null;
});

export default mongoose.models.Appartement || mongoose.model("Appartement", AppartementSchema);
