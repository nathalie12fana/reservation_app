import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";

export const POST = async (request) => {
  try {
    // Check if API key is valid
    const apiKey = request.headers.get("x-api-key");
    console.log("API KEY Received:", apiKey);

    if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
      return NextResponse.json(
        { message: "Unauthorized Request" },
        { status: 401 }
      );
    }

    await connectDB();

    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Email ou mot de passe invalide" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Email ou mot de passe invalide" },
        { status: 401 }
      );
    }

    const userToReturn = user.toObject();
    delete userToReturn.passwordHash;

    return NextResponse.json(userToReturn, { status: 200 });
  } catch (error) {
    console.error("Error in authentication:", error);
    return NextResponse.json(
      { message: "Erreur d'authentification", error: error.message },
      { status: 500 }
    );
  }
};
