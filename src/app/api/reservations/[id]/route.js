import connectDB from '@/lib/mongodb'
import Reservation from '@/models/Reservation'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    await connectDB();
    
    const reservation = await Reservation.findById(id)
      .populate('utilisateur', 'nom email telephone')
      .populate('appartement');
    
    if (!reservation) {
      return NextResponse.json(
        { message: 'Réservation non trouvée' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Erreur GET reservation:', error);
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
    
    const reservation = await Reservation.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    )
    .populate('utilisateur', 'nom email telephone')
    .populate('appartement');
    
    if (!reservation) {
      return NextResponse.json(
        { message: 'Réservation non trouvée' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Erreur PUT reservation:', error);
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
    
    const reservation = await Reservation.findByIdAndDelete(id);
    
    if (!reservation) {
      return NextResponse.json(
        { message: 'Réservation non trouvée' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Réservation supprimée avec succès' });
  } catch (error) {
    console.error('Erreur DELETE reservation:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression', error: error.message },
      { status: 500 }
    );
  }
}
