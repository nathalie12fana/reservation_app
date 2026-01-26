import mongoose from "mongoose";

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in environment variables");
  process.exit(1);
}

// Appartement Schema
const AppartementSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String },
  type: { type: String },
  prix: { type: Number, required: true },
  ville: { type: String, required: true },
  quartier: { type: String },
  adresse: { type: String },
  pieces: { type: Number },
  chambres: { type: Number },
  sallesDeBain: { type: Number },
  surface: { type: Number },
  images: [String],
  services: [String],
  disponible: { type: Boolean, default: true },
  meuble: { type: Boolean, default: false },
  proprietaire: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  proprietaireEmail: { type: String }, // Temporary field for easy tracking
}, { timestamps: true });

const Appartement = mongoose.models.Appartement || mongoose.model("Appartement", AppartementSchema);

const appartements = [
  {
    titre: "Appartement T3 moderne à Bonapriso",
    description: "Superbe appartement de 3 pièces dans un quartier calme et sécurisé. Proche de toutes les commodités.",
    type: "Appartement",
    prix: 150000,
    ville: "Douala",
    quartier: "Bonapriso",
    adresse: "Avenue des Cocotiers",
    pieces: 3,
    chambres: 2,
    sallesDeBain: 2,
    surface: 85,
    images: ["/images/app1.svg", "/images/app2.svg"],
    services: ["WiFi", "Climatisation", "Parking", "Sécurité 24/7", "Piscine"],
    disponible: true,
    meuble: true,
    proprietaireEmail: "jean@mail.com"
  },
  {
    titre: "Studio lumineux à Bastos",
    description: "Studio confortable et bien équipé dans le quartier résidentiel de Bastos.",
    type: "Studio",
    prix: 65000,
    ville: "Yaoundé",
    quartier: "Bastos",
    adresse: "Rue 1.234",
    pieces: 1,
    chambres: 1,
    sallesDeBain: 1,
    surface: 35,
    images: ["/images/app3.svg"],
    services: ["WiFi", "Climatisation", "Cuisine équipée"],
    disponible: true,
    meuble: true,
    proprietaireEmail: "jean@mail.com"
  },
  {
    titre: "Villa spacieuse à Akwa",
    description: "Magnifique villa de 5 pièces avec jardin et garage. Idéale pour une grande famille.",
    type: "Villa",
    prix: 300000,
    ville: "Douala",
    quartier: "Akwa",
    adresse: "Boulevard de la Liberté",
    pieces: 5,
    chambres: 4,
    sallesDeBain: 3,
    surface: 200,
    images: ["/images/app1.svg", "/images/app2.svg", "/images/app3.svg"],
    services: ["WiFi", "Climatisation", "Parking", "Jardin", "Sécurité 24/7", "Piscine"],
    disponible: true,
    meuble: false,
    proprietaireEmail: "marie@mail.com"
  },
  {
    titre: "Appartement T2 à Bonamoussadi",
    description: "Appartement de 2 pièces dans un immeuble moderne avec ascenseur.",
    type: "Appartement",
    prix: 90000,
    ville: "Douala",
    quartier: "Bonamoussadi",
    adresse: "Rue 2045",
    pieces: 2,
    chambres: 1,
    sallesDeBain: 1,
    surface: 55,
    images: ["/images/app2.svg"],
    services: ["WiFi", "Parking", "Ascenseur"],
    disponible: true,
    meuble: false,
    proprietaireEmail: "marie@mail.com"
  },
  {
    titre: "Duplex moderne à Odza",
    description: "Beau duplex de 4 pièces avec terrasse. Vue dégagée.",
    type: "Duplex",
    prix: 180000,
    ville: "Yaoundé",
    quartier: "Odza",
    adresse: "Carrefour Odza",
    pieces: 4,
    chambres: 3,
    sallesDeBain: 2,
    surface: 120,
    images: ["/images/app1.svg", "/images/app3.svg"],
    services: ["WiFi", "Climatisation", "Parking", "Terrasse"],
    disponible: true,
    meuble: true,
    proprietaireEmail: "jean@mail.com"
  },
  {
    titre: "Studio étudiant à Ngoa Ekelle",
    description: "Petit studio parfait pour étudiant. Proche de l'université.",
    type: "Studio",
    prix: 45000,
    ville: "Yaoundé",
    quartier: "Ngoa Ekelle",
    adresse: "Derrière Campus",
    pieces: 1,
    chambres: 1,
    sallesDeBain: 1,
    surface: 25,
    images: ["/images/app2.svg"],
    services: ["WiFi", "Cuisine équipée"],
    disponible: true,
    meuble: true,
    proprietaireEmail: "marie@mail.com"
  },
  {
    titre: "Appartement T4 à Bepanda",
    description: "Grand appartement familial dans un quartier animé.",
    type: "Appartement",
    prix: 120000,
    ville: "Douala",
    quartier: "Bepanda",
    adresse: "Carrefour Bepanda",
    pieces: 4,
    chambres: 3,
    sallesDeBain: 2,
    surface: 95,
    images: ["/images/app3.svg"],
    services: ["WiFi", "Parking"],
    disponible: true,
    meuble: false,
    proprietaireEmail: "jean@mail.com"
  },
  {
    titre: "Villa de luxe à Bastos",
    description: "Villa haut standing avec piscine et jardin tropical. Finitions premium.",
    type: "Villa",
    prix: 450000,
    ville: "Yaoundé",
    quartier: "Bastos",
    adresse: "Avenue Kennedy",
    pieces: 6,
    chambres: 5,
    sallesDeBain: 4,
    surface: 300,
    images: ["/images/app1.svg", "/images/app2.svg", "/images/app3.svg"],
    services: ["WiFi", "Climatisation", "Parking", "Jardin", "Sécurité 24/7", "Piscine", "Salle de sport"],
    disponible: true,
    meuble: true,
    proprietaireEmail: "marie@mail.com"
  }
];

async function seedDatabase() {
  try {
    console.log("🔌 Connexion à MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connecté à MongoDB");

    console.log("🏢 Ajout des appartements...");
    
    for (const appartData of appartements) {
      try {
        const appart = await Appartement.create(appartData);
        console.log(`  ✓ ${appart.titre} créé`);
      } catch (err) {
        console.log(`  ⚠️  Erreur pour "${appartData.titre}": ${err.message}`);
      }
    }

    const totalCount = await Appartement.countDocuments();
    console.log(`\n✅ Terminé! Vous avez maintenant ${totalCount} appartements dans la base`);

  } catch (error) {
    console.error("❌ Erreur:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Connexion fermée");
  }
}

seedDatabase();
