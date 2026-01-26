'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Filters from '../../components/Filters'

export default function AppartementsPage() {
  const [data, setData] = useState([])
  const [filtered, setFiltered] = useState([])
  const [types, setTypes] = useState([])
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAppartements()
  }, [])

  async function fetchAppartements() {
    try {
      setLoading(true)
      const response = await fetch('/api/appartements')
      if (!response.ok) throw new Error('Erreur lors du chargement des appartements')
      const appartements = await response.json()
      setData(appartements)
      setFiltered(appartements)
      setTypes([...new Set(appartements.map(a => a.type).filter(Boolean))])
      setLocations([...new Set(appartements.map(a => a.ville || a.localisation).filter(Boolean))])
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleFilter(changes) {
    let result = data
    if (changes.type) result = result.filter(r => r.type === changes.type)
    if (changes.localisation) result = result.filter(r => r.ville === changes.localisation || r.localisation === changes.localisation)
    setFiltered(result)
  }

  if (loading) return (
    <section className="px-4 sm:px-8 py-12 min-h-screen flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
    </section>
  )

  if (error) return (
    <section className="px-4 sm:px-8 py-12 min-h-screen flex justify-center items-center">
      <div className="max-w-lg text-center bg-red-50 border border-red-200 p-6 rounded-lg">
        <p className="text-red-600 font-medium mb-2">❌ {error}</p>
        <button onClick={fetchAppartements} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded">Réessayer</button>
      </div>
    </section>
  )

  return (
    <section className="px-4 sm:px-8 py-12">
      <h2 className="text-3xl font-bold text-yellow-600 mb-6 text-center">Nos Appartements</h2>

      {/* Filters */}
      <div className="max-w-4xl mx-auto mb-8">
        <Filters types={types} locations={locations} onFilter={handleFilter} />
      </div>

      {/* No results */}
      {filtered.length === 0 && (
        <div className="max-w-2xl mx-auto bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 text-lg">Aucun appartement trouvé</p>
          <button onClick={() => setFiltered(data)} className="mt-4 text-yellow-600 hover:underline">Réinitialiser les filtres</button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(apt => (
          <article key={apt._id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden">
            {apt.images && apt.images.length > 0 ? (
              <div className="relative h-48 w-full">
                <Image src={apt.images[0]} alt={apt.titre} fill className="object-cover" />
              </div>
            ) : (
              <div className="h-48 w-full bg-yellow-100 flex items-center justify-center text-yellow-600 text-4xl">🏠</div>
            )}

            <div className="p-4">
              <h3 className="text-xl font-semibold text-yellow-600 mb-1">{apt.titre}</h3>
              <p className="text-gray-600 text-sm mb-2">📍 {apt.ville}{apt.quartier ? ` - ${apt.quartier}` : ''}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-2xl font-bold text-gray-800">{apt.prix?.toLocaleString()} FCFA</span>
                <div className="flex gap-2">
                  <Link href={`/appartements/${apt._id}`} className="text-sm font-medium text-yellow-600 hover:underline">Voir détails</Link>
                  <Link href={`/reservation/${apt._id}`} className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm px-3 py-2 rounded transition">Réserver</Link>
                </div>
              </div>
              {!apt.disponible && <div className="mt-3 bg-red-50 text-red-600 text-xs text-center py-2 rounded">Non disponible</div>}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
