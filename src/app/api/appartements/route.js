import connectDB from '@/lib/mongodb'
import Appartement from '@/models/Appartement'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const ville = searchParams.get('ville');
    const minPrix = searchParams.get('minPrix');
    const maxPrix = searchParams.get('maxPrix');
    const nombrePersonnes = searchParams.get('nombrePersonnes');
    
    let filter = {};
    
    if (ville) filter.ville = { $regex: ville, $options: 'i' };
    if (minPrix || maxPrix) {
      filter.prix = {};
      if (minPrix) filter.prix.$gte = Number(minPrix);
      if (maxPrix) filter.prix.$lte = Number(maxPrix);
    }
    if (nombrePersonnes) filter.nombrePersonnes = { $gte: Number(nombrePersonnes) };
    
    const appartements = await Appartement.find(filter).sort({ createdAt: -1 });
    
    return NextResponse.json(appartements);
  } catch (error) {
    console.error('Erreur GET appartements:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const appartement = await Appartement.create(body);
    
    return NextResponse.json(appartement, { status: 201 });
  } catch (error) {
    console.error('Erreur POST appartement:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la création', error: error.message },
      { status: 500 }
    );
  }
}