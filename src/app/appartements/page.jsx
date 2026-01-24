'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Filters from '../../components/Filters'
import appartementsData from '../../data/appartements'

export default function AppartementsPage() {
  const [data, setData] = useState([])
  const [filtered, setFiltered] = useState([])
  const [types, setTypes] = useState([])
  const [locations, setLocations] = useState([])

  useEffect(() => {
    setData(appartementsData)
    setFiltered(appartementsData)
    setTypes([...new Set(appartementsData.map(i => i.type))])
    setLocations([...new Set(appartementsData.map(i => i.localisation))])
  }, [])

  function handleFilter(changes) {
    const t = changes.type || null
    const l = changes.localisation || null
    let result = data
    if (t) result = result.filter(r => r.type === t)
    if (l) result = result.filter(r => r.localisation === l)
    setFiltered(result)
  }

  return (
    <section className="px-4 sm:px-8 py-12">
      <h2 className="text-3xl font-bold text-yellow-600 mb-4 text-center">Nos Appartements</h2>
      <div className="max-w-4xl mx-auto">
        <Filters types={types} locations={locations} onFilter={handleFilter} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 sm:px-4">
        {filtered.map(apt => (
          <article key={apt.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
            {apt.image ? (
              <div className="relative h-48 sm:h-56 md:h-60 w-full bg-gray-100">
                <Image src={apt.image} alt={apt.nom} fill className="object-cover" />
              </div>
            ) : (
              <div className="h-48 sm:h-56 md:h-60 w-full bg-gray-200 flex items-center justify-center text-gray-500">
                Pas d'image
              </div>
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold text-yellow-600">{apt.nom}</h3>
              <p className="text-gray-600">{apt.localisation}</p>
              <p className="text-gray-800 font-medium mt-2">{apt.type} – {apt.pieces} pièces</p>
              <ul className="mt-3 text-sm text-gray-700">
                {apt.services.map((s,i) => <li key={i}>• {s}</li>)}
              </ul>
              <div className="mt-4 flex items-center justify-between">
  <Link href={`/appartements/${apt.id}`} className="text-sm font-medium text-yellow-600">
    Voir le détail →
  </Link>
  <div className="flex items-center gap-2">
    <div className="text-sm text-gray-700 font-semibold">{apt.prix.toLocaleString()} FCFA</div>
    <Link 
      href={`/reservation/${apt.id}`}
      className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm px-3 py-1 rounded"
    >
      Réserver
    </Link>
  </div>
  </div>
  </div>
  </article>
     ))}
      </div>
    </section>
  )
}
