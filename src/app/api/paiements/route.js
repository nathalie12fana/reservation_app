import connectDB from '@/lib/mongodb'
import Paiement from '@/models/Paiement'
import Reservation from '@/models/Reservation'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const reservationId = searchParams.get('reservationId');
    
    let filter = {};
    if (reservationId) filter.reservation = reservationId;
    
    const paiement = await Paiement.findOne(filter)
      .populate('reservation')
      .populate('utilisateur', 'nom email telephone');
    
    if (!paiement) {
      return NextResponse.json(
        { message: 'Paiement non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(paiement);
  } catch (error) {
    console.error('Erreur GET paiement:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    console.log('🔵 Début de la création du paiement');
    await connectDB();
    
    const body = await request.json();
    console.log('📦 Body reçu:', body);
    
    // Accepter les deux formats: reservation ou reservationId
    const reservationId = body.reservation || body.reservationId;
    const { modePaiement, montant, utilisateurId } = body;
    
    if (!reservationId) {
      console.error('❌ Aucun ID de réservation fourni');
      return NextResponse.json(
        { success: false, message: 'L\'ID de réservation est requis' },
        { status: 400 }
      );
    }

    if (!modePaiement) {
      console.error('❌ Aucun mode de paiement fourni');
      return NextResponse.json(
        { success: false, message: 'Le mode de paiement est requis' },
        { status: 400 }
      );
    }

    // Récupérer la réservation pour obtenir le montant et l'utilisateur
    const reservation = await Reservation.findById(reservationId)
      .populate('appartement')
      .populate('utilisateur');

    if (!reservation) {
      console.error('❌ Réservation non trouvée:', reservationId);
      return NextResponse.json(
        { success: false, message: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    console.log('✅ Réservation trouvée:', {
      id: reservation._id,
      montant: reservation.prixTotal,
      utilisateur: reservation.utilisateur?._id
    });

    // Utiliser le montant de la réservation si non fourni
    const montantFinal = montant || reservation.prixTotal;
    const utilisateurFinal = utilisateurId || reservation.utilisateur?._id;

    // Vérifier si un paiement existe déjà pour cette réservation
    const paiementExistant = await Paiement.findOne({ reservation: reservationId });
    if (paiementExistant) {
      console.log('⚠️ Paiement déjà existant pour cette réservation');
      return NextResponse.json(
        { 
          success: false, 
          message: 'Un paiement existe déjà pour cette réservation',
          paiement: paiementExistant
        },
        { status: 400 }
      );
    }

    // Créer le paiement
    console.log('💳 Création du paiement avec:', {
      reservation: reservationId,
      utilisateur: utilisateurFinal,
      modePaiement,
      montant: montantFinal
    });

    const paiementData = {
      reservation: reservationId,
      modePaiement,
      montant: montantFinal,
      statut: modePaiement === 'cash' ? 'en_attente' : 'payé',
      datePaiement: new Date()
    };

    // Ajouter l'utilisateur seulement s'il existe
    if (utilisateurFinal) {
      paiementData.utilisateur = utilisateurFinal;
    }

    const paiement = await Paiement.create(paiementData);
    
    console.log('✅ Paiement créé:', paiement._id);

    // Mettre à jour le statut de la réservation
    const newStatus = modePaiement === 'cash' ? 'confirmée' : 'payée';
    await Reservation.findByIdAndUpdate(
      reservationId,
      { statut: newStatus }
    );
    
    console.log('✅ Statut de la réservation mis à jour:', newStatus);

    const populatedPaiement = await Paiement.findById(paiement._id)
      .populate('reservation')
      .populate('utilisateur', 'nom email telephone');
    
    console.log('✅ Paiement finalisé et populé');
    return NextResponse.json({ 
      success: true, 
      message: 'Paiement créé avec succès',
      paiement: populatedPaiement 
    }, { status: 201 });
  } catch (error) {
    console.error('💥 Erreur POST paiement complète:', error);
    console.error('Stack:', error.stack);
    
    // Envoyer un message d'erreur plus détaillé
    let errorMessage = 'Erreur lors de la création du paiement';
    if (error.name === 'ValidationError') {
      errorMessage = 'Données de paiement invalides';
    } else if (error.name === 'CastError') {
      errorMessage = 'ID de réservation invalide';
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage, 
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
