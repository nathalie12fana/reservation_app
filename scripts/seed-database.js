import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "your_mongodb_uri_here";

// Models
const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["locataire", "proprietaire", "admin"], default: "locataire" },
}, { timestamps: true });

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
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Appartement = mongoose.models.Appartement || mongoose.model("Appartement", AppartementSchema);

// Sample data
const users = [
  {
    fullName: "Jean Dupont",
    userName: "jeandupont",
    email: "jean@mail.com",
    password: "password123",
    role: "proprietaire"
  },
  {
    fullName: "Marie Kamga",
    userName: "mariekamga",
    email: "marie@mail.com",
    password: "password123",
    role: "proprietaire"
  },
  {
    fullName: "Paul Nkeng",
    userName: "paulnkeng",
    email: "paul@mail.com",
    password: "password123",
    role: "locataire"
  },
  {
    fullName: "Sophie Mbida",
    userName: "sophiembida",
    email: "sophie@mail.com",
    password: "password123",
    role: "locataire"
  }
];

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
    meuble: true
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
    meuble: true
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
    meuble: false
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
    meuble: false
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
    meuble: true
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
    meuble: true
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
    meuble: false
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
    meuble: true
  },
  {
    titre: "Chambre meublée à Makepe",
    description: "Chambre confortable dans une maison partagée. Idéale pour jeune professionnel.",
    type: "Chambre",
    prix: 35000,
    ville: "Douala",
    quartier: "Makepe",
    adresse: "Makepe Missoke",
    pieces: 1,
    chambres: 1,
    sallesDeBain: 1,
    surface: 15,
    images: ["/images/app1.svg"],
    services: ["WiFi", "Cuisine partagée"],
    disponible: true,
    meuble: true
  },
  {
    titre: "Appartement T3 à Essos",
    description: "Appartement bien situé près du marché central.",
    type: "Appartement",
    prix: 95000,
    ville: "Yaoundé",
    quartier: "Essos",
    adresse: "Carrefour Essos",
    pieces: 3,
    chambres: 2,
    sallesDeBain: 1,
    surface: 70,
    images: ["/images/app2.svg", "/images/app3.svg"],
    services: ["WiFi", "Parking"],
    disponible: true,
    meuble: false
  }
];

async function seedDatabase() {
  try {
    console.log("🔌 Connexion à MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connecté à MongoDB");

    // Clear existing data
    console.log("🗑️  Suppression des anciennes données...");
    await User.deleteMany({});
    await Appartement.deleteMany({});
    console.log("✅ Anciennes données supprimées");

    // Create users
    console.log("👥 Création des utilisateurs...");
    const createdUsers = [];
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        fullName: userData.fullName,
        userName: userData.userName,
        email: userData.email,
        passwordHash: hashedPassword,
        role: userData.role
      });
      createdUsers.push(user);
      console.log(`  ✓ ${user.fullName} créé(e)`);
    }

    // Create appartements
    console.log("🏢 Création des appartements...");
    const proprietaires = createdUsers.filter(u => u.role === "proprietaire");
    
    for (let i = 0; i < appartements.length; i++) {
      const appartData = appartements[i];
      // Assign owner randomly from proprietaires
      const owner = proprietaires[i % proprietaires.length];
      
      const appart = await Appartement.create({
        ...appartData,
        proprietaire: owner._id
      });
      console.log(`  ✓ ${appart.titre} créé`);
    }

    console.log("\n✅ Base de données peuplée avec succès!");
    console.log(`📊 ${createdUsers.length} utilisateurs créés`);
    console.log(`🏠 ${appartements.length} appartements créés`);
    
    console.log("\n📝 Identifiants de test:");
    console.log("   Propriétaire: jean@mail.com / password123");
    console.log("   Locataire: paul@mail.com / password123");

  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Connexion fermée");
  }
}

seedDatabase();
