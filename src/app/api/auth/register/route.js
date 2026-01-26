import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectDB();

    const { fullName, userName, email, password, role } = await request.json();

    // Validate input
    if (!fullName || !userName || !email || !password) {
      return NextResponse.json(
        { message: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { userName }],
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Cet email ou nom d'utilisateur existe déjà" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      fullName,
      userName,
      email,
      passwordHash,
      role: role || "locataire", // Default to locataire if not specified
    });

    // Return user without password
    const userResponse = {
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      email: user.email,
      role: user.role,
    };

    return NextResponse.json(
      { message: "Compte créé avec succès", user: userResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Erreur lors de la création du compte", error: error.message },
      { status: 500 }
    );
  }
}
