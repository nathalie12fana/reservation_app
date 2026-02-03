import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();
    
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }
    
    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.motDePasse);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }
    
    // Créer un token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    // Retourner l'utilisateur sans le mot de passe
    const userWithoutPassword = {
      _id: user._id,
      nom: user.nom,
      email: user.email,
      telephone: user.telephone,
      role: user.role
    };
    
    const response = NextResponse.json({
      message: 'Connexion réussie',
      user: userWithoutPassword,
      token
    });
    
    // Définir le cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 jours
    });
    
    return response;
  } catch (error) {
    console.error('Erreur login:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la connexion', error: error.message },
      { status: 500 }
    );
  }
}