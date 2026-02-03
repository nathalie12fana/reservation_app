import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    await connectDB();
    
    const { nom, email, telephone, password } = await request.json();
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Créer l'utilisateur
    const user = await User.create({
      nom,
      email,
      telephone,
      motDePasse: hashedPassword,
      role: 'client'
    });
    
    // Retourner l'utilisateur sans le mot de passe
    const userWithoutPassword = {
      _id: user._id,
      nom: user.nom,
      email: user.email,
      telephone: user.telephone,
      role: user.role
    };
    
    return NextResponse.json(
      { message: 'Inscription réussie', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur register:', error);
    return NextResponse.json(
      { message: 'Erreur lors de l\'inscription', error: error.message },
      { status: 500 }
    );
  }
}