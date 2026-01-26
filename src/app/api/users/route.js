import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

/* ======================
   GET : tous les users
====================== */
export async function GET() {
  try {
    await connectDB();
    const users = await User.find().select("-passwordHash"); // Don't return passwords
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Erreur serveur", error: error.message },
      { status: 500 }
    );
  }
}

/* ======================
   POST : créer un user
====================== */
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: data.email }, { userName: data.userName }]
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Un utilisateur avec cet email ou nom d'utilisateur existe déjà" },
        { status: 400 }
      );
    }

    const user = await User.create(data);

    // Don't return password
    const userToReturn = user.toObject();
    delete userToReturn.passwordHash;

    return NextResponse.json(
      { message: "Utilisateur créé", user: userToReturn },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Erreur lors de la création", error: error.message },
      { status: 400 }
    );
  }
}
