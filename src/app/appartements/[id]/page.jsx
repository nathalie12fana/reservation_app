"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AppartementDetail({ params }) {
  const { id } = use(params);
  const [apt, setApt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppartement();
  }, [id]);

  async function fetchAppartement() {
    try {
      setLoading(true);
      const response = await fetch(`/api/appartements/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Appartement non trouvé");
        }
        throw new Error("Erreur lors du chargement");
      }

      const data = await response.json();
      setApt(data);
    } catch (err) {
      console.error("Erreur:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="px-8 py-12 min-h-screen">
        <div className="max-w-4xl mx-auto flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !apt) {
    return (
      <div className="px-8 py-12 text-center min-h-screen">
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-8">
          <p className="text-red-600 font-semibold text-xl mb-2">
            ❌ {error || "Appartement non trouvé"}
          </p>
          <p className="text-gray-600 mb-6">
            L'appartement que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Link 
            href="/appartements" 
            className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            ← Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  // Préparer l'URL Google Maps
  const locationString = apt.quartier 
    ? `${apt.quartier}, ${apt.ville}` 
    : apt.ville || apt.localisation || "";
  const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(locationString)}&output=embed`;

  return (
    <section className="px-4 sm:px-8 py-12 max-w-5xl mx-auto">
      {/* Titre */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-yellow-600 mb-2">
          {apt.titre}
        </h1>
        <div className="flex items-center gap-2 text-gray-600">
          <span>📍 {apt.ville}{apt.quartier && ` - ${apt.quartier}`}</span>
          {apt.disponible ? (
            <span className="ml-4 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
              ✓ Disponible
            </span>
          ) : (
            <span className="ml-4 px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
              Non disponible
            </span>
          )}
        </div>
      </div>

      {/* Images */}
      {apt.images && apt.images.length > 0 ? (
        <div className="mb-8">
          <div className="relative h-96 w-full mb-4 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={apt.images[0]}
              alt={apt.titre}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {apt.images.length > 1 && (
            <div className="grid grid-cols-3 gap-4">
              {apt.images.slice(1, 4).map((img, i) => (
                <div key={i} className="relative h-32 rounded-lg overflow-hidden shadow-md">
                  <Image src={img} alt={`${apt.titre} - ${i + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mb-8 h-96 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-8xl">🏠</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {apt.description && (
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-yellow-600 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{apt.description}</p>
            </div>
          )}

          {/* Caractéristiques */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-yellow-600 mb-4">Caractéristiques</h2>
            <div className="grid grid-cols-2 gap-4">
              {apt.type && (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏘️</span>
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="font-medium">{apt.type}</p>
                  </div>
                </div>
              )}
              {apt.pieces && (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚪</span>
                  <div>
                    <p className="text-xs text-gray-500">Pièces</p>
                    <p className="font-medium">{apt.pieces}</p>
                  </div>
                </div>
              )}
              {apt.chambres && (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🛏️</span>
                  <div>
                    <p className="text-xs text-gray-500">Chambres</p>
                    <p className="font-medium">{apt.chambres}</p>
                  </div>
                </div>
              )}
              {apt.sallesDeBain && (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚿</span>
                  <div>
                    <p className="text-xs text-gray-500">Salles de bain</p>
                    <p className="font-medium">{apt.sallesDeBain}</p>
                  </div>
                </div>
              )}
              {apt.surface && (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📐</span>
                  <div>
                    <p className="text-xs text-gray-500">Surface</p>
                    <p className="font-medium">{apt.surface} m²</p>
                  </div>
                </div>
              )}
              {apt.meuble !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🪑</span>
                  <div>
                    <p className="text-xs text-gray-500">Meublé</p>
                    <p className="font-medium">{apt.meuble ? "Oui" : "Non"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Services */}
          {apt.services && apt.services.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-yellow-600 mb-4">Services inclus</h2>
              <div className="grid grid-cols-2 gap-3">
                {apt.services.map((service, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Localisation */}
          {locationString && (
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-yellow-600 mb-4">Localisation</h2>
              {apt.adresse && (
                <p className="text-gray-700 mb-4">📍 {apt.adresse}</p>
              )}
              <div className="w-full h-80 rounded-lg overflow-hidden">
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
          )}
        </div>

        {/* Sidebar - Prix et réservation */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg sticky top-4">
            <div className="text-center mb-6">
              <p className="text-gray-600 text-sm mb-2">Prix par mois</p>
              <p className="text-4xl font-bold text-yellow-600">
                {apt.prix?.toLocaleString()}
              </p>
              <p className="text-gray-500 text-sm">FCFA</p>
            </div>

            {apt.disponible ? (
              <Link
                href={`/reservation/${apt._id}`}
                className="block w-full bg-yellow-600 hover:bg-yellow-700 text-white text-center px-6 py-3 rounded-lg font-semibold transition mb-4"
              >
                Réserver maintenant
              </Link>
            ) : (
              <button
                disabled
                className="block w-full bg-gray-300 text-gray-500 text-center px-6 py-3 rounded-lg font-semibold cursor-not-allowed mb-4"
              >
                Non disponible
              </button>
            )}

            <Link
              href="/contact"
              className="block w-full border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-50 text-center px-6 py-3 rounded-lg font-semibold transition"
            >
              Contacter le propriétaire
            </Link>

            {/* Propriétaire info */}
            {apt.proprietaire && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-500 mb-2">Propriétaire</p>
                <p className="font-medium">{apt.proprietaire.fullName || apt.proprietaire.userName}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-12 pt-6 border-t">
        <Link 
          href="/appartements" 
          className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-medium"
        >
          <span>←</span>
          <span>Retour à la liste</span>
        </Link>
      </div>
    </section>
  );
}
