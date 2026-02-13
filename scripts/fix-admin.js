import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb+srv://christellenathaliefana:Natalie123%40@e-commerce.keay56i.mongodb.net/location_db';

const fixAdmin = async () => {
  try {
    console.log('🔌 Connexion à MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à la base de données');

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash('password123', 10);
    console.log('🔐 Mot de passe hashé');

    // Mettre à jour ou créer l'admin
    const result = await mongoose.connection.db.collection('users').updateOne(
      { email: 'admin@mail.com' },
      { 
        $set: { 
          motDePasse: hashedPassword,
          role: 'admin',
          nom: 'Administrateur',
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      console.log('✅ Admin créé avec succès !');
    } else if (result.modifiedCount > 0) {
      console.log('✅ Mot de passe admin mis à jour !');
    } else {
      console.log('ℹ️  Admin déjà à jour');
    }
    
    console.log('\n📧 Email: admin@mail.com');
    console.log('🔑 Mot de passe: password123');
    console.log('\n🚀 Vous pouvez maintenant vous connecter sur /admin-login');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté de MongoDB');
  }
};

fixAdmin();