import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appartement from "@/models/Appartement";
import User from "@/models/User";

/* ======================
   GET : Get single appartement by ID
====================== */
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const appartement = await Appartement.findById(id).populate(
      "proprietaire",
      "fullName email userName"
    );

    if (!appartement) {
      return NextResponse.json(
        { message: "Appartement non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(appartement, { status: 200 });
  } catch (error) {
    console.error("Error fetching appartement:", error);
    return NextResponse.json(
      { message: "Erreur serveur", error: error.message },
      { status: 500 }
    );
  }
}

/* ======================
   PUT : Update a specific appartement
====================== */
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const data = await request.json();

    const appartement = await Appartement.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!appartement) {
      return NextResponse.json(
        { message: "Appartement non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Appartement mis à jour", appartement },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating appartement:", error);
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour", error: error.message },
      { status: 400 }
    );
  }
}

/* ======================
   DELETE : Delete a specific appartement
====================== */
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const appartement = await Appartement.findByIdAndDelete(id);

    if (!appartement) {
      return NextResponse.json(
        { message: "Appartement non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Appartement supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting appartement:", error);
    return NextResponse.json(
      { message: "Erreur lors de la suppression", error: error.message },
      { status: 400 }
    );
  }
}
