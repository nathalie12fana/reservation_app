'use client'

import { use } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import appartementsData from '../../../data/appartements'

export default function ConfirmationPage({ params }) {
  const resolvedParams = use(params)
  const { id } = resolvedParams

  const apt = appartementsData.find(a => a.id === parseInt(id))
  const searchParams = useSearchParams()

  const date = searchParams.get('date') || ''
  const heure = searchParams.get('heure') || ''

  if (!apt) return <div>Appartement non trouvé</div>

  const paiementLink = `/paiement/${apt.id}?date=${encodeURIComponent(date)}&heure=${encodeURIComponent(heure)}`

  return (
    <section className="max-w-2xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-yellow-600 mb-6">Confirmation de réservation</h2>

      <div className="bg-white shadow-md rounded-xl p-6 mb-6">
        <h3 className="text-2xl font-semibold text-yellow-600 mb-2">{apt.nom}</h3>
        <p className="text-gray-700"><strong>Type :</strong> {apt.type}</p>
        <p className="text-gray-700"><strong>Localisation :</strong> {apt.localisation}</p>
        <p className="text-gray-700"><strong>Pièces :</strong> {apt.pieces}</p>
        <p className="text-gray-700"><strong>Date :</strong> {date}</p>
        <p className="text-gray-700 mb-3"><strong>Heure :</strong> {heure}</p>
        <p className="text-gray-800 font-semibold"><strong>Prix :</strong> {apt.prix.toLocaleString()} FCFA</p>
      </div>

      <div className="flex gap-4">
        <Link
          href={`/reservation/${apt.id}?date=${encodeURIComponent(date)}&heure=${encodeURIComponent(heure)}`}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Modifier
        </Link>

        <Link
          href={paiementLink}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Payer maintenant
        </Link>
      </div>
    </section>
  )
}
