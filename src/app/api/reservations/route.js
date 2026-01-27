import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Reservation from "@/models/Reservation";
import Appartement from "@/models/Appartement";
import User from "@/models/User";  // ← AJOUTE CETTE LIGNE

/* ======================
   GET : Get all reservations with filters
====================== */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const utilisateurId = searchParams.get("utilisateurId");
    const appartementId = searchParams.get("appartementId");
    const statut = searchParams.get("statut");

    // Build filter
    const filter = {};
    if (utilisateurId) filter.utilisateur = utilisateurId;
    if (appartementId) filter.appartement = appartementId;
    if (statut) filter.statut = statut;

    const reservations = await Reservation.find(filter)
      .populate("appartement", "titre ville adresse prix images")
      .populate("utilisateur", "fullName email userName")
      .sort({ createdAt: -1 });

    return NextResponse.json(reservations, { status: 200 });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json(
      { message: "Erreur serveur", error: error.message },
      { status: 500 }
    );
  }
}

/* ======================
   POST : Create a new reservation
====================== */
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    // Validate required fields
    if (!data.appartement || !data.utilisateur || !data.dateDebut || !data.dateFin || !data.prixTotal) {
      return NextResponse.json(
        { message: "Tous les champs requis doivent être fournis" },
        { status: 400 }
      );
    }

    // Check if appartement exists and is available
    const appartement = await Appartement.findById(data.appartement);
    if (!appartement) {
      return NextResponse.json(
        { message: "Appartement non trouvé" },
        { status: 404 }
      );
    }

    if (!appartement.disponible) {
      return NextResponse.json(
        { message: "Cet appartement n'est pas disponible" },
        { status: 400 }
      );
    }

    // Check for overlapping reservations
    const overlappingReservation = await Reservation.findOne({
      appartement: data.appartement,
      statut: { $ne: "annulée" },
      $or: [
        {
          dateDebut: { $lte: new Date(data.dateFin) },
          dateFin: { $gte: new Date(data.dateDebut) },
        },
      ],
    });

    if (overlappingReservation) {
      return NextResponse.json(
        { message: "Cet appartement est déjà réservé pour ces dates" },
        { status: 400 }
      );
    }

    const reservation = await Reservation.create(data);

    // Populate the created reservation
    const populatedReservation = await Reservation.findById(reservation._id)
      .populate("appartement", "titre ville adresse prix images")
      .populate("utilisateur", "fullName email userName");

    return NextResponse.json(
      { message: "Réservation créée avec succès", reservation: populatedReservation },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      { message: "Erreur lors de la création", error: error.message },
      { status: 400 }
    );
  }
}

/* ======================
   PUT : Update a reservation
====================== */
export async function PUT(request) {
  try {
    await connectDB();
    const data = await request.json();
    const { _id, ...updateData } = data;

    if (!_id) {
      return NextResponse.json(
        { message: "ID de la réservation requis" },
        { status: 400 }
      );
    }

    const reservation = await Reservation.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("appartement", "titre ville adresse prix images")
      .populate("utilisateur", "fullName email userName");

    if (!reservation) {
      return NextResponse.json(
        { message: "Réservation non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Réservation mise à jour", reservation },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating reservation:", error);
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour", error: error.message },
      { status: 400 }
    );
  }
}

/* ======================
   DELETE : Cancel/Delete a reservation
====================== */
export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID de la réservation requis" },
        { status: 400 }
      );
    }

    // Instead of deleting, we can update status to "annulée"
    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { statut: "annulée" },
      { new: true }
    );

    if (!reservation) {
      return NextResponse.json(
        { message: "Réservation non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Réservation annulée avec succès", reservation },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error canceling reservation:", error);
    return NextResponse.json(
      { message: "Erreur lors de l'annulation", error: error.message },
      { status: 400 }
    );
  }
}
