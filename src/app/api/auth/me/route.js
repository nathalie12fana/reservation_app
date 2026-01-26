import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-this-in-production"
);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token");

    if (!token) {
      return NextResponse.json(
        { message: "Non authentifié" },
        { status: 401 }
      );
    }

    // Verify token
    const { payload } = await jwtVerify(token.value, JWT_SECRET);

    return NextResponse.json(
      { user: payload },
      { status: 200 }
    );
  } catch (error) {
    console.error("Me error:", error);
    return NextResponse.json(
      { message: "Token invalide" },
      { status: 401 }
    );
  }
}
