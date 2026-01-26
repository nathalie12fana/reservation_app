import mongoose from "mongoose";

// 1. HARDCODE YOUR URI HERE (Temporary - delete this file after use)
const MONGODB_URI = "mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxx.mongodb.net/booking_appartment_system?retryWrites=true&w=majority";

// 2. Define the Schema inside the script so it doesn't rely on other files
const AppartementSchema = new mongoose.Schema({
  titre: String,
  ville: String,
  quartier: String,
  prix: Number,
  disponible: Boolean,
  images: [String],
  proprietaireEmail: String,
});

const Appartement = mongoose.models.Appartement || mongoose.model("Appartement", AppartementSchema);

const appartementsData = [
  { titre: "Studio moderne", ville: "Douala", quartier: "Akwa", prix: 50000, disponible: true, images: [], proprietaireEmail: "owner1@mail.com" },
  { titre: "Appartement T2 meublé", ville: "Douala", quartier: "Bonapriso", prix: 75000, disponible: true, images: [], proprietaireEmail: "owner2@mail.com" },
  { titre: "Appartement T3 haut standing", ville: "Yaoundé", quartier: "Bastos", prix: 120000, disponible: true, images: [], proprietaireEmail: "owner3@mail.com" },
  { titre: "Studio économique", ville: "Yaoundé", quartier: "Mvan", prix: 35000, disponible: true, images: [], proprietaireEmail: "owner4@mail.com" },
  { titre: "Appartement T2 avec balcon", ville: "Douala", quartier: "Logpom", prix: 60000, disponible: true, images: [], proprietaireEmail: "owner5@mail.com" },
  { titre: "Chambre moderne", ville: "Bafoussam", quartier: "Tougang", prix: 25000, disponible: true, images: [], proprietaireEmail: "owner6@mail.com" },
  { titre: "Appartement familial", ville: "Yaoundé", quartier: "Emana", prix: 90000, disponible: true, images: [], proprietaireEmail: "owner7@mail.com" },
  { titre: "Studio meublé", ville: "Douala", quartier: "Makepe", prix: 45000, disponible: true, images: [], proprietaireEmail: "owner8@mail.com" }
];

async function seed() {
  try {
    console.log("Connecting directly to Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected!");

    await Appartement.deleteMany({});
    console.log("Cleared old data.");

    await Appartement.insertMany(appartementsData);
    console.log("✅ Successfully seeded 8 apartments!");
    
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

seed();