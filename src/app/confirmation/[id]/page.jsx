'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ConfirmationPage({ params }) {
  const { id } = use(params) // ID de la réservation
  const router = useRouter()

  const [reservation, setReservation] = useState(null)
  const [paiement, setPaiement] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [id])

  async function fetchData() {
    try {
      setLoading(true)
      
      console.log('🔍 Chargement de la réservation ID:', id)
      
      // Fetch reservation
      const resResponse = await fetch(`/api/reservations/${id}`)
      console.log('📡 Status réservation:', resResponse.status)
      
      if (!resResponse.ok) {
        const errorData = await resResponse.json()
        console.error('❌ Erreur API réservation:', errorData)
        throw new Error('Réservation non trouvée')
      }
      
      const resData = await resResponse.json()
      console.log('✅ Données réservation:', resData)
      setReservation(resData)

      // Fetch payment if exists
      try {
        console.log('🔍 Recherche du paiement...')
        const paiementResponse = await fetch(`/api/paiements?reservationId=${id}`)
        console.log('📡 Status paiement:', paiementResponse.status)
        
        if (paiementResponse.ok) {
          const paiementData = await paiementResponse.json()
          console.log('✅ Données paiement:', paiementData)
          setPaiement(paiementData)
        } else {
          console.log('ℹ️ Aucun paiement trouvé')
        }
      } catch (err) {
        console.log('ℹ️ Pas de paiement trouvé:', err.message)
      }

    } catch (err) {
      console.error('💥 Erreur complète:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-12 min-h-screen">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium mb-4">❌ {error}</p>
          <Link 
            href="/appartements" 
            className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
          >
            Retour aux appartements
          </Link>
        </div>
      </section>
    )
  }

  const getStatutBadge = (statut) => {
    const badges = {
      'en_attente': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '⏳ En attente' },
      'confirmée': { bg: 'bg-green-100', text: 'text-green-800', label: '✅ Confirmée' },
      'payé': { bg: 'bg-green-100', text: 'text-green-800', label: '✅ Payé' },
      'annulée': { bg: 'bg-red-100', text: 'text-red-800', label: '❌ Annulée' }
    }
    const badge = badges[statut] || badges['en_attente']
    return (
      <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-sm font-medium`}>
        {badge.label}
      </span>
    )
  }

  const getModePaiementLabel = (mode) => {
    const labels = {
      'orange_money': '🟠 Orange Money',
      'mobile_money': '📱 Mobile Money',
      'cash': '💵 Espèces'
    }
    return labels[mode] || mode
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      {/* En-tête de succès */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <span className="text-5xl">✓</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Réservation confirmée !
        </h1>
        <p className="text-gray-600">
          Merci pour votre réservation. Vous recevrez un email de confirmation.
        </p>
      </div>

      {/* Informations de la réservation */}
      {reservation && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          {/* En-tête avec appartement */}
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">
              {reservation.appartement?.titre || 'Appartement'}
            </h2>
            <p className="text-yellow-100">
              📍 {reservation.appartement?.ville || 'Non spécifié'}
              {reservation.appartement?.adresse && ` - ${reservation.appartement.adresse}`}
            </p>
          </div>

          {/* Détails de la réservation */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Détails de la réservation</h3>
              {getStatutBadge(reservation.statut)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Date de début</p>
                <p className="text-lg font-semibold text-gray-800">
                  📅 {new Date(reservation.dateDebut).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Date de fin</p>
                <p className="text-lg font-semibold text-gray-800">
                  📅 {new Date(reservation.dateFin).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Durée du séjour:</span>
                <span className="font-semibold text-gray-800">
                  {Math.ceil((new Date(reservation.dateFin) - new Date(reservation.dateDebut)) / (1000 * 60 * 60 * 24))} jours
                </span>
              </div>
            </div>

            <div className="border-t-2 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-gray-800">Montant total:</span>
                <span className="text-3xl font-bold text-yellow-600">
                  {reservation.prixTotal?.toLocaleString()} FCFA
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Informations de paiement */}
      {paiement && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">💳 Informations de paiement</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Mode de paiement:</span>
              <span className="font-semibold">{getModePaiementLabel(paiement.modePaiement)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Statut du paiement:</span>
              {getStatutBadge(paiement.statut)}
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Date de paiement:</span>
              <span className="font-semibold">
                {new Date(paiement.datePaiement).toLocaleDateString('fr-FR')}
              </span>
            </div>

            {paiement.modePaiement === 'cash' && paiement.statut === 'en_attente' && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  ℹ️ N'oubliez pas d'effectuer le paiement en espèces lors de la remise des clés.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Numéro de réservation */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <p className="text-sm text-gray-600 mb-1">Numéro de réservation</p>
        <p className="text-lg font-mono font-semibold text-gray-800">#{id}</p>
        <p className="text-sm text-gray-600 mt-2">
          Conservez ce numéro pour toute correspondance future.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/appartements"
          className="flex-1 text-center border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          Retour aux appartements
        </Link>

        <Link
          href="/mes-reservations"
          className="flex-1 text-center bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Voir mes réservations
        </Link>
      </div>

      {/* Informations supplémentaires */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3">📧 Et maintenant ?</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>✓ Vous allez recevoir un email de confirmation</li>
          <li>✓ Le propriétaire vous contactera sous 24h</li>
          <li>✓ Vous pourrez suivre votre réservation dans "Mes réservations"</li>
          {paiement?.modePaiement === 'cash' && (
            <li>✓ N'oubliez pas d'apporter le montant en espèces</li>
          )}
        </ul>
      </div>
    </section>
  )
}
