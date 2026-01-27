import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Paiement from "@/models/Paiement";
import Reservation from "@/models/Reservation";

/* ======================
   POST : Create a new payment
====================== */
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    console.log('Données de paiement reçues:', data);

    // Validate required fields
    if (!data.reservation || !data.modePaiement) {
      return NextResponse.json(
        { message: "La réservation et le mode de paiement sont requis" },
        { status: 400 }
      );
    }

    // Check if reservation exists
    const reservation = await Reservation.findById(data.reservation);
    if (!reservation) {
      return NextResponse.json(
        { message: "Réservation non trouvée" },
        { status: 404 }
      );
    }

    // Get the price from reservation
    const montant = reservation.prixTotal || 0;

    // Determine payment status based on payment method
    let statut = 'en_attente';
    if (data.modePaiement === 'orange_money' || data.modePaiement === 'mobile_money') {
      statut = 'payé'; // For mobile payments, we assume immediate payment
    } else if (data.modePaiement === 'cash') {
      statut = 'en_attente'; // Cash payment will be made later
    }

    // Create payment
    const paiement = await Paiement.create({
      reservation: data.reservation,
      montant: montant,
      modePaiement: data.modePaiement,
      statut: statut,
      datePaiement: new Date()
    });

    // Update reservation with payment reference and status
    await Reservation.findByIdAndUpdate(data.reservation, {
      paiement: paiement._id,
      statut: statut === 'payé' ? 'confirmée' : 'en_attente'
    });

    return NextResponse.json(
      { 
        message: "Paiement enregistré avec succès", 
        paiement: paiement 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { message: "Erreur lors du paiement", error: error.message },
      { status: 500 }
    );
  }
}

/* ======================
   GET : Get payment by reservation ID
====================== */
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const reservationId = searchParams.get("reservationId");

    if (!reservationId) {
      return NextResponse.json(
        { message: "ID de réservation requis" },
        { status: 400 }
      );
    }

    const paiement = await Paiement.findOne({ reservation: reservationId })
      .populate("reservation");

    if (!paiement) {
      return NextResponse.json(
        { message: "Paiement non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(paiement, { status: 200 });
  } catch (error) {
    console.error("Error fetching payment:", error);
    return NextResponse.json(
      { message: "Erreur serveur", error: error.message },
      { status: 500 }
    );
  }
}
