'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function AdminAppartementsPage() {
  const [appartements, setAppartements] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    fetchAppartements()
  }, [])

  async function fetchAppartements() {
    try {
      const response = await fetch('/api/appartements')
      const data = await response.json()
      setAppartements(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet appartement ?')) {
      return
    }

    try {
      const response = await fetch(`/api/appartements/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setAppartements(appartements.filter(a => a._id !== id))
        alert('Appartement supprimé avec succès')
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Erreur lors de la suppression')
    }
  }

  async function toggleDisponibilite(id, currentStatus) {
    try {
      const response = await fetch(`/api/appartements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disponible: !currentStatus }),
      })

      if (response.ok) {
        const updated = await response.json()
        setAppartements(
          appartements.map(a => a._id === id ? updated.appartement : a)
        )
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Gestion des appartements
          </h1>
          <p className="text-gray-600">
            {appartements.length} appartement{appartements.length > 1 ? 's' : ''} total
          </p>
        </div>
        <Link
          href="/admin/appartements/add"
          className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          <span>➕</span>
          <span>Ajouter appartement</span>
        </Link>
      </div>

      {/* Appartements Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Appartement
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Ville
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Prix
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Statut
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {appartements.map((apt) => (
                <tr key={apt._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {apt.images && apt.images[0] ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={apt.images[0]}
                            alt={apt.titre}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          🏠
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{apt.titre}</p>
                        <p className="text-sm text-gray-500">
                          {apt.pieces} pièces • {apt.chambres} chambres
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-800">{apt.ville}</p>
                    {apt.quartier && (
                      <p className="text-sm text-gray-500">{apt.quartier}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">
                      {apt.prix?.toLocaleString()} FCFA
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {apt.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleDisponibilite(apt._id, apt.disponible)}
                      className={`inline-block px-3 py-1 text-sm rounded-full transition ${
                        apt.disponible
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {apt.disponible ? '✓ Disponible' : '✗ Indisponible'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/appartements/${apt._id}`}
                        target="_blank"
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition"
                      >
                        👁️ Voir
                      </Link>
                      <Link
                        href={`/admin/appartements/edit/${apt._id}`}
                        className="px-3 py-1 text-sm text-yellow-600 hover:bg-yellow-50 rounded transition"
                      >
                        ✏️ Modifier
                      </Link>
                      <button
                        onClick={() => handleDelete(apt._id)}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition"
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {appartements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Aucun appartement trouvé</p>
            <Link
              href="/admin/appartements/add"
              className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg"
            >
              Ajouter le premier appartement
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
