import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-this-in-production"
);

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Email ou mot de passe invalide" },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Email ou mot de passe invalide" },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      userName: user.userName,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    // Create response with user data (without password)
    const userResponse = {
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      email: user.email,
      role: user.role,
    };

    // Set cookie
    const response = NextResponse.json(
      { message: "Connexion réussie", user: userResponse },
      { status: 200 }
    );

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Erreur serveur", error: error.message },
      { status: 500 }
    );
  }
}
