/**
 * Script de réinitialisation de la collection users
 * 
 * UTILISATION:
 * 1. Assurez-vous que votre MONGODB_URI est correctement configuré dans .env
 * 2. Exécutez: node scripts/resetUsers.js
 * 3. Redémarrez votre application
 * 4. Créez de nouveaux utilisateurs avec le nouveau modèle
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ ERREUR: MONGODB_URI n\'est pas défini dans .env');
  process.exit(1);
}

async function resetUsers() {
  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');
    
    // Vérifier si la collection existe
    const collections = await mongoose.connection.db.listCollections().toArray();
    const usersCollectionExists = collections.some(col => col.name === 'users');
    
    if (!usersCollectionExists) {
      console.log('ℹ️  La collection users n\'existe pas encore');
      console.log('✅ Aucune action nécessaire - vous pouvez créer de nouveaux utilisateurs');
      await mongoose.connection.close();
      process.exit(0);
    }
    
    console.log('🗑️  Suppression de la collection users...');
    await mongoose.connection.db.dropCollection('users');
    console.log('✅ Collection users supprimée avec succès');
    
    console.log('');
    console.log('✅ TERMINÉ!');
    console.log('');
    console.log('📝 Prochaines étapes:');
    console.log('1. Redémarrez votre application Next.js');
    console.log('2. Allez sur /register pour créer de nouveaux utilisateurs');
    console.log('3. Les utilisateurs seront créés avec le nouveau modèle');
    console.log('');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('');
    console.error('💡 Vérifiez:');
    console.error('1. Que MongoDB est bien démarré');
    console.error('2. Que MONGODB_URI dans .env est correct');
    console.error('3. Que vous avez les permissions nécessaires');
    console.error('');
    process.exit(1);
  }
}

console.log('');
console.log('⚠️  ATTENTION: Ce script va supprimer tous les utilisateurs existants');
console.log('');
console.log('Démarrage dans 3 secondes...');
console.log('Appuyez sur CTRL+C pour annuler');
console.log('');

setTimeout(() => {
  resetUsers();
}, 3000);
