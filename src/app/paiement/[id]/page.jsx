'use client'

import { use } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import appartementsData from '../../../data/appartements'

export default function PaiementPage({ params }) {
  const resolvedParams = use(params)
  const { id } = resolvedParams

  const apt = appartementsData.find(a => a.id === parseInt(id))
  const searchParams = useSearchParams()
  const date = searchParams.get('date') || ''
  const heure = searchParams.get('heure') || ''

  const router = useRouter()

  if (!apt) return <div>Appartement non trouvé</div>

  const handlePaiement = () => {
    // Simulation paiement
    router.push('/success')
  }

  return (
    <section className="max-w-2xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-green-600 mb-6">Paiement</h2>

      <p className="mb-4">Appartement : {apt.nom}</p>
      <p className="mb-4">Date : {date}</p>
      <p className="mb-4">Heure : {heure}</p>
      <p className="mb-4 font-semibold">Prix : {apt.prix.toLocaleString()} FCFA</p>

      <button
        onClick={handlePaiement}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
      >
        Payer maintenant
      </button>
    </section>
  )
}
