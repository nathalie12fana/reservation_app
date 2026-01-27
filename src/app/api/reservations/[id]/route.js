import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Reservation from "@/models/Reservation";

/* ======================
   GET : Get a single reservation by ID
====================== */
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "ID de réservation requis" },
        { status: 400 }
      );
    }

    const reservation = await Reservation.findById(id)
      .populate("appartement", "titre ville adresse prix images")
      .populate("utilisateur", "fullName email userName");

    if (!reservation) {
      return NextResponse.json(
        { message: "Réservation non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(reservation, { status: 200 });
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return NextResponse.json(
      { message: "Erreur serveur", error: error.message },
      { status: 500 }
    );
  }
}
