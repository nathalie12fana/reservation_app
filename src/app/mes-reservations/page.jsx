'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function MesReservationsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelLoading, setCancelLoading] = useState(null)

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/mes-reservations')
      } else {
        fetchMesReservations()
      }
    }
  }, [user, authLoading, router])

  async function fetchMesReservations() {
    try {
      setLoading(true)
      setError('')
      
      if (!user || !user._id) {
        console.error('❌ Utilisateur non défini:', user)
        setError('Utilisateur non connecté')
        return
      }

      console.log('🔍 Chargement des réservations pour l\'utilisateur:', user._id)
      
      const url = `/api/reservations?utilisateurId=${user._id}`
      console.log('📡 URL de la requête:', url)
      
      const response = await fetch(url)
      
      console.log('📡 Status de la réponse:', response.status)
      console.log('📡 Headers:', response.headers)
      
      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch (e) {
          errorData = { message: `Erreur HTTP ${response.status}` }
        }
        console.error('❌ Erreur API:', errorData)
        throw new Error(errorData.message || `Erreur lors du chargement (${response.status})`)
      }

      const data = await response.json()
      console.log('✅ Réservations chargées:', data)
      console.log('📊 Nombre de réservations:', data.length)
      
      setReservations(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('💥 Erreur complète:', err)
      setError(err.message || 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel(id, titre) {
    if (!confirm(`Êtes-vous sûr de vouloir annuler la réservation pour "${titre}" ?`)) {
      return
    }

    try {
      setCancelLoading(id)
      const response = await fetch(`/api/reservations?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Erreur lors de l\'annulation')
      }

      // Mettre à jour la liste
      setReservations(reservations.map(res => 
        res._id === id ? { ...res, statut: 'annulée' } : res
      ))
      
      alert('Réservation annulée avec succès !')
    } catch (err) {
      console.error('Erreur:', err)
      alert('Erreur lors de l\'annulation : ' + err.message)
    } finally {
      setCancelLoading(null)
    }
  }

  const getStatutBadge = (statut) => {
    const badges = {
      'en_attente': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '⏳ En attente', icon: '⏳' },
      'confirmée': { bg: 'bg-green-100', text: 'text-green-800', label: '✅ Confirmée', icon: '✅' },
      'payé': { bg: 'bg-green-100', text: 'text-green-800', label: '✅ Payée', icon: '💳' },
      'annulée': { bg: 'bg-red-100', text: 'text-red-800', label: '❌ Annulée', icon: '❌' }
    }
    const badge = badges[statut] || badges['en_attente']
    return (
      <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1`}>
        <span>{badge.icon}</span>
        {badge.label}
      </span>
    )
  }

  const getStatutColor = (statut) => {
    const colors = {
      'en_attente': 'border-yellow-200 bg-yellow-50',
      'confirmée': 'border-green-200 bg-green-50',
      'payé': 'border-green-200 bg-green-50',
      'annulée': 'border-red-200 bg-red-50'
    }
    return colors[statut] || colors['en_attente']
  }

  if (authLoading || (loading && !error)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos réservations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Link 
              href="/"
              className="text-gray-500 hover:text-gray-700 transition"
            >
              🏠 Accueil
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700 font-medium">Mes réservations</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📅 Mes Réservations
          </h1>
          <p className="text-gray-600">
            Retrouvez toutes vos réservations d appartements
          </p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">❌</span>
              <div className="flex-1">
                <p className="text-red-800 font-semibold mb-2">Erreur lors du chargement</p>
                <p className="text-red-600 text-sm mb-4">{error}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setError('')
                      fetchMesReservations()
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    🔄 Réessayer
                  </button>
                  <Link
                    href="/appartements"
                    className="border border-red-600 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Voir les appartements
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Liste des réservations */}
        {!error && reservations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Aucune réservation
            </h2>
            <p className="text-gray-600 mb-6">
              Vous navez pas encore effectué de réservation.
            </p>
            <Link
              href="/appartements"
              className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Découvrir les appartements
            </Link>
          </div>
        ) : !error && (
          <div className="space-y-6">
            {reservations.map((reservation) => (
              <div
                key={reservation._id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 ${getStatutColor(reservation.statut)} hover:shadow-xl transition`}
              >
                <div className="md:flex">
                  {/* Image de l'appartement */}
                  <div className="md:w-1/3 relative h-64 md:h-auto bg-gradient-to-br from-yellow-100 to-yellow-200">
                    {reservation.appartement?.images && reservation.appartement.images.length > 0 ? (
                      <Image
                        src={reservation.appartement.images[0]}
                        alt={reservation.appartement?.titre || 'Appartement'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-6xl">
                        🏠
                      </div>
                    )}
                    
                    {/* Badge statut */}
                    <div className="absolute top-4 left-4">
                      {getStatutBadge(reservation.statut)}
                    </div>
                  </div>

                  {/* Détails de la réservation */}
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                          {reservation.appartement?.titre || 'Appartement'}
                        </h3>
                        <p className="text-gray-600 flex items-center gap-2">
                          📍 {reservation.appartement?.ville || 'Non spécifié'}
                          {reservation.appartement?.adresse && ` - ${reservation.appartement.adresse}`}
                        </p>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">📅 Arrivée</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(reservation.dateDebut).toLocaleDateString('fr-FR', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">📅 Départ</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(reservation.dateFin).toLocaleDateString('fr-FR', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Prix et durée */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Durée du séjour</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {Math.ceil((new Date(reservation.dateFin) - new Date(reservation.dateDebut)) / (1000 * 60 * 60 * 24))} jours
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Prix total</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {reservation.prixTotal?.toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>

                    {/* Numéro de réservation */}
                    <div className="bg-gray-100 p-3 rounded-lg mb-4">
                      <p className="text-xs text-gray-600">Numéro de réservation</p>
                      <p className="text-sm font-mono font-semibold text-gray-800">
                        #{reservation._id}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/confirmation/${reservation._id}`}
                        className="flex-1 min-w-[200px] text-center bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg font-medium transition"
                      >
                        📄 Voir les détails
                      </Link>
                      
                      {reservation.statut !== 'annulée' && (
                        <button
                          onClick={() => handleCancel(reservation._id, reservation.appartement?.titre)}
                          disabled={cancelLoading === reservation._id}
                          className="flex-1 min-w-[200px] border-2 border-red-600 text-red-600 hover:bg-red-50 py-2 px-4 rounded-lg font-medium transition disabled:opacity-50"
                        >
                          {cancelLoading === reservation._id ? '⏳ Annulation...' : '❌ Annuler'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistiques */}
        {!error && reservations.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📊 Résumé de vos réservations
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-yellow-600">
                  {reservations.length}
                </p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-yellow-600">
                  {reservations.filter(r => r.statut === 'en_attente').length}
                </p>
                <p className="text-sm text-gray-600">En attente</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">
                  {reservations.filter(r => ['confirmée', 'payé'].includes(r.statut)).length}
                </p>
                <p className="text-sm text-gray-600">Confirmées</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-red-600">
                  {reservations.filter(r => r.statut === 'annulée').length}
                </p>
                <p className="text-sm text-gray-600">Annulées</p>
              </div>
            </div>
          </div>
        )}

        {/* Informations utiles */}
        {!error && reservations.length > 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-3">💡 Informations utiles</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>✓ Vous pouvez annuler une réservation jusqua 48h avant la date darrivée</li>
              <li>✓ En cas de problème, contactez le propriétaire directement</li>
              <li>✓ Conservez votre numéro de réservation pour toute correspondance</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
