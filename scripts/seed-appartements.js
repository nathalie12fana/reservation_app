// ✅ Using 'dotenv/config' as the very first import ensures variables load immediately
import 'dotenv/config'; 
import { connectDB } from "../src/lib/mongodb.js";
import Appartement from "../src/models/Appartement.js";

const appartementsData = [
  {
    titre: "Studio moderne",
    ville: "Douala",
    quartier: "Akwa",
    prix: 50000,
    disponible: true,
    images: ["https://placehold.co/600x400?text=Studio+Akwa"],
    proprietaireEmail: "owner1@mail.com",
  },
  {
    titre: "Appartement T2 meublé",
    ville: "Douala",
    quartier: "Bonapriso",
    prix: 75000,
    disponible: true,
    images: ["https://placehold.co/600x400?text=T2+Bonapriso"],
    proprietaireEmail: "owner2@mail.com",
  },
  {
    titre: "Appartement T3 haut standing",
    ville: "Yaoundé",
    quartier: "Bastos",
    prix: 120000,
    disponible: true,
    images: ["https://placehold.co/600x400?text=T3+Bastos"],
    proprietaireEmail: "owner3@mail.com",
  }
];

async function seedAppartements() {
  try {
    await connectDB();
    console.log("Connected to MongoDB...");

    // Clear existing data to avoid duplicates in your new Atlas DB
    await Appartement.deleteMany({});
    console.log("🗑️ Old data removed.");

    await Appartement.insertMany(appartementsData);
    console.log("✅ Seeding complete: 8 apartments added to Atlas.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedAppartements();