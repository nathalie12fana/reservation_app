import connectDB from '@/lib/mongodb'
import Appartement from '@/models/Appartement'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    await connectDB();
    
    const appartement = await Appartement.findById(id);
    
    if (!appartement) {
      return NextResponse.json(
        { message: 'Appartement non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(appartement);
  } catch (error) {
    console.error('Erreur GET appartement:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;

  try {
    await connectDB();
    const body = await request.json();
    
    const appartement = await Appartement.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!appartement) {
      return NextResponse.json(
        { message: 'Appartement non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(appartement);
  } catch (error) {
    console.error('Erreur PUT appartement:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  try {
    await connectDB();
    
    const appartement = await Appartement.findByIdAndDelete(id);
    
    if (!appartement) {
      return NextResponse.json(
        { message: 'Appartement non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Appartement supprimé avec succès' });
  } catch (error) {
    console.error('Erreur DELETE appartement:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression', error: error.message },
      { status: 500 }
    );
  }
}
