import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appartement from "@/models/Appartement";
import User from "@/models/User";

/* ======================
   GET : Get all appartements with optional filters
====================== */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const ville = searchParams.get("ville");
    const localisation = searchParams.get("localisation");
    const disponible = searchParams.get("disponible");
    const minPrix = searchParams.get("minPrix");
    const maxPrix = searchParams.get("maxPrix");

    // Build filter object
    const filter = {};

    if (type) filter.type = type;
    if (ville) filter.ville = ville;
    if (localisation) filter.localisation = localisation;
    if (disponible !== null) filter.disponible = disponible === "true";
    
    // Price range filter
    if (minPrix || maxPrix) {
      filter.prix = {};
      if (minPrix) filter.prix.$gte = Number(minPrix);
      if (maxPrix) filter.prix.$lte = Number(maxPrix);
    }

    const appartements = await Appartement.find(filter)
      .populate("proprietaire", "fullName email userName")
      .sort({ createdAt: -1 });

    return NextResponse.json(appartements, { status: 200 });
  } catch (error) {
    console.error("Error fetching appartements:", error);
    return NextResponse.json(
      { message: "Erreur serveur", error: error.message },
      { status: 500 }
    );
  }
}

/* ======================
   POST : Create a new appartement
====================== */
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    // Validate required fields
    if (!data.titre || !data.prix || !data.ville) {
      return NextResponse.json(
        { message: "Les champs titre, prix et ville sont requis" },
        { status: 400 }
      );
    }

    const appartement = await Appartement.create(data);

    return NextResponse.json(
      { message: "Appartement créé avec succès", appartement },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating appartement:", error);
    return NextResponse.json(
      { message: "Erreur lors de la création", error: error.message },
      { status: 400 }
    );
  }
}

/* ======================
   PUT : Update an appartement
====================== */
export async function PUT(request) {
  try {
    await connectDB();
    const data = await request.json();
    const { _id, ...updateData } = data;

    if (!_id) {
      return NextResponse.json(
        { message: "ID de l'appartement requis" },
        { status: 400 }
      );
    }

    const appartement = await Appartement.findByIdAndUpdate(_id, updateData, {
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
   DELETE : Delete an appartement
====================== */
export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID de l'appartement requis" },
        { status: 400 }
      );
    }

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
