'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import appartementsData from '../../../data/appartements'

export default function ReservationPage({ params, searchParams }) {
  const resolvedParams = use(params)
  const resolvedSearchParams = use(searchParams)

  const { id } = resolvedParams
  const apt = appartementsData.find(a => a.id === parseInt(id))

  const [date, setDate] = useState(resolvedSearchParams?.date || '')
  const [heure, setHeure] = useState(resolvedSearchParams?.heure || '')
  const [error, setError] = useState('')

  useEffect(() => {
    if (date) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const selected = new Date(date)
      setError(selected < today ? 'La date ne peut pas être passée' : '')
    } else {
      setError('')
    }
  }, [date])

  if (!apt) return <div>Appartement non trouvé</div>

  const confirmationLink = `/confirmation/${apt.id}?date=${encodeURIComponent(date)}&heure=${encodeURIComponent(heure)}`

  return (
    <section className="max-w-2xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-yellow-600 mb-6">Réserver : {apt.nom}</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Date</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Heure</label>
        <input
          type="time"
          value={heure}
          onChange={e => setHeure(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <Link
        href={confirmationLink}
        className={`bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded ${
          !date || !heure || error ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        Confirmer la réservation
      </Link>
    </section>
  )
}
