'use client'

import { useRouter } from 'next/navigation'

export default function SuccessPage() {
  const router = useRouter()

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Paiement enregistré avec succès !
        </h2>
        <p className="text-gray-700 mb-6">
          Merci pour votre réservation. Votre paiement a bien été pris en compte.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 shadow-inner">
          <p className="mb-2"><strong>Nom :</strong> Appartement Réservé</p>
          <p className="mb-2"><strong>Date :</strong> 12/12/2025</p>
          <p className="mb-2"><strong>Heure :</strong> 14:00</p>
          <p className="mb-0 font-semibold"><strong>Montant :</strong> 500 000 FCFA</p>
        </div>

        <button
          onClick={() => router.push('/')}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded"
        >
          Retour à l'accueil
        </button>
      </div>
    </section>
  )
}
