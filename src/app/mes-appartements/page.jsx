'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function MesAppartementsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [appartements, setAppartements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/mes-appartements')
    } else if (user) {
      fetchMesAppartements()
    }
  }, [user, authLoading, router])

  async function fetchMesAppartements() {
    try {
      setLoading(true)
      const response = await fetch('/api/appartements')
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement')
      }

      const data = await response.json()
      
      // Filtrer les appartements de l'utilisateur connecté
      const mesApparts = data.filter(apt => 
        apt.proprietaire && apt.proprietaire.toString() === user._id
      )
      
      setAppartements(mesApparts)
    } catch (err) {
      console.error('Erreur:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id, titre) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${titre}" ?`)) {
      return
    }

    try {
      setDeleteLoading(id)
      const response = await fetch(`/api/appartements/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }

      // Retirer de la liste
      setAppartements(appartements.filter(apt => apt._id !== id))
      
      // Message de succès
      alert('Appartement supprimé avec succès !')
    } catch (err) {
      console.error('Erreur:', err)
      alert('Erreur lors de la suppression : ' + err.message)
    } finally {
      setDeleteLoading(null)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Mes Appartements
            </h1>
            <p className="text-gray-600">
              Gérez vos annonces d'appartements
            </p>
          </div>
          
          <Link
            href="/mes-appartements/ajouter"
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Ajouter un appartement
          </Link>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Liste des appartements */}
        {appartements.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🏠</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Aucun appartement
            </h2>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas encore ajouté d'appartement.
            </p>
            <Link
              href="/mes-appartements/ajouter"
              className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Ajouter mon premier appartement
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appartements.map((apt) => (
              <div
                key={apt._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-yellow-100 to-yellow-200">
                  {apt.images && apt.images.length > 0 ? (
                    <Image
                      src={apt.images[0]}
                      alt={apt.titre}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-6xl">
                      🏠
                    </div>
                  )}
                  
                  {/* Badge de statut */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        apt.disponible
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {apt.disponible ? 'Disponible' : 'Loué'}
                    </span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
                    {apt.titre}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3">
                    📍 {apt.ville}
                    {apt.quartier && ` - ${apt.quartier}`}
                  </p>

                  <p className="text-2xl font-bold text-yellow-600 mb-4">
                    {apt.prix?.toLocaleString()} FCFA
                    <span className="text-sm text-gray-500 font-normal">/mois</span>
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/mes-appartements/modifier/${apt._id}`}
                      className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
                    >
                      ✏️ Modifier
                    </Link>
                    
                    <button
                      onClick={() => handleDelete(apt._id, apt.titre)}
                      disabled={deleteLoading === apt._id}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
                    >
                      {deleteLoading === apt._id ? '...' : '🗑️ Supprimer'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistiques */}
        {appartements.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📊 Statistiques
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-yellow-600">
                  {appartements.length}
                </p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">
                  {appartements.filter(a => a.disponible).length}
                </p>
                <p className="text-sm text-gray-600">Disponibles</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-red-600">
                  {appartements.filter(a => !a.disponible).length}
                </p>
                <p className="text-sm text-gray-600">Loués</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">
                  {Math.round(
                    appartements.reduce((sum, a) => sum + (a.prix || 0), 0) /
                    appartements.length
                  ).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Prix moyen</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
