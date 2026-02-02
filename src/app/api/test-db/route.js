import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appartement from "@/models/Appartement";

export async function GET() {
  try {
    // Test database connection
    await connectDB();

    // Count how many appartements exist
    const count = await Appartement.countDocuments();

    // Fetch the first 3 documents
    const sample = await Appartement.find().limit(3);

    return NextResponse.json({
      message: "MongoDB connection successful!",
      totalAppartements: count,
      sampleData: sample,
    });
  } catch (error) {
    console.error("DB Test Error:", error);
    return NextResponse.json(
      { message: "MongoDB connection failed", error: error.message },
      { status: 500 }
    );
  }
}
