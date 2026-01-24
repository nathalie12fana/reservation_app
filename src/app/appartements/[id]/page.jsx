"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import appartementsData from "../../../data/appartements";

export default function AppartementDetail({ params }) {
  // On "unwrap" la Promise params avec React.use()
  const { id } = use(params);
  const apt = appartementsData.find((a) => a.id === parseInt(id));

  if (!apt) {
    return (
      <div className="px-8 py-12 text-center text-red-600">
        Appartement non trouvé
        <div className="mt-4">
          <Link href="/appartements" className="text-yellow-600 font-medium">
            ← Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  // 🔍 Préparer l'URL Google Maps à partir du champ localisation
  const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    apt.localisation
  )}&output=embed`;

  return (
    <section className="px-8 py-12 max-w-4xl mx-auto">
      {/* Nom */}
      <h2 className="text-3xl font-bold text-yellow-600 mb-6">{apt.nom}</h2>

      {/* Image principale */}
      {apt.image && (
        <div className="relative h-72 w-full mb-6 rounded-xl overflow-hidden shadow-md">
          <Image
            src={apt.image}
            alt={apt.nom}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}

      {/* Informations générales */}
      <div className="space-y-2 bg-white p-4 rounded-xl shadow-sm">
        <p>
          <strong>Type :</strong> {apt.type}
        </p>
        <p>
          <strong>Localisation :</strong> {apt.localisation}
        </p>
        <p>
          <strong>Pièces :</strong> {apt.pieces}
        </p>
        <p>
          <strong>Prix :</strong>{" "}
          <span className="text-yellow-600 font-semibold">
            {apt.prix.toLocaleString()} FCFA
          </span>
        </p>
      </div>

      {/* Services */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2 text-yellow-600">Services inclus :</h3>
        <ul className="list-disc list-inside text-gray-700">
          {apt.services.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      {/* 📍 Google Maps */}
      <div className="mt-8">
        <h3 className="font-semibold mb-3 text-yellow-600">Localisation sur carte :</h3>
        <div className="w-full h-80 rounded-xl overflow-hidden shadow-md">
          <iframe
            src={mapsUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* Retour */}
      <div className="mt-8 flex justify-between items-center">
        <Link href="/appartements" className="text-yellow-600 font-medium">
          ← Retour à la liste
        </Link>
        <Link
          href={`/reservation/${apt.id}`}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-semibold"
        >
          Réserver
        </Link>
      </div>
    </section>
  );
}
