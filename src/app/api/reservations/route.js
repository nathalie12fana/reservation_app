import connectDB from '@/lib/mongodb'
import Reservation from '@/models/Reservation'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const utilisateurId = searchParams.get('utilisateurId');
    const id = searchParams.get('id');
    
    let filter = {};
    if (utilisateurId) filter.utilisateur = utilisateurId;
    if (id) filter._id = id;
    
    const reservations = await Reservation.find(filter)
      .populate('utilisateur', 'nom email telephone')
      .populate('appartement')
      .sort({ createdAt: -1 });
    
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Erreur GET reservations:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const reservation = await Reservation.create(body);
    
    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('utilisateur', 'nom email telephone')
      .populate('appartement');
    
    return NextResponse.json(populatedReservation, { status: 201 });
  } catch (error) {
    console.error('Erreur POST reservation:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la création', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { message: 'ID de réservation requis' },
        { status: 400 }
      );
    }
    
    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { statut: 'annulée' },
      { new: true }
    );
    
    if (!reservation) {
      return NextResponse.json(
        { message: 'Réservation non trouvée' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Réservation annulée avec succès', reservation });
  } catch (error) {
    console.error('Erreur DELETE reservation:', error);
    return NextResponse.json(
      { message: 'Erreur lors de l\'annulation', error: error.message },
      { status: 500 }
    );
  }
}