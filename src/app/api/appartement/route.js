import { connectDB } from "@/lib/mongodb";
import Appartement from "@/models/Appartement";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const appartement = await Appartement.find();
    return NextResponse.json(appartement, {status:200});
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur serveur", error },
      { status: 500 }
    );
  }
}
