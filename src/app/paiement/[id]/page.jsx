'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PaiementPage({ params }) {
  const { id } = use(params) // id de la réservation
  const router = useRouter()

  const [reservation, setReservation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modePaiement, setModePaiement] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchReservation()
  }, [id])

  async function fetchReservation() {
    try {
      setLoading(true)
      const response = await fetch(`/api/reservations/${id}`)
      
      if (!response.ok) {
        throw new Error('Réservation non trouvée')
      }

      const data = await response.json()
      setReservation(data)
    } catch (err) {
      console.error('Erreur:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handlePaiement() {
    if (!modePaiement) {
      setError('Veuillez choisir un mode de paiement')
      return
    }

    try {
      setSubmitting(true)
      setError('')

      console.log('💳 Envoi du paiement pour réservation:', id)
      console.log('💳 Mode de paiement:', modePaiement)

      const response = await fetch('/api/paiements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservation: id,
          modePaiement,
        }),
      })

      const result = await response.json()
      console.log('📡 Réponse API paiement:', result)

      if (!response.ok) {
        console.error('❌ Erreur API:', result)
        throw new Error(result.message || 'Erreur de paiement')
      }

      console.log('✅ Paiement réussi, redirection vers la page de succès')
      // Redirection vers la page de succès avec les infos
      router.push(`/success?reservationId=${id}&mode=${modePaiement}`)
    } catch (err) {
      console.error('💥 Erreur paiement complète:', err)
      setError(err.message)
    } finally {
      setSubmitting(false)
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

  if (error && !reservation) {
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

  return (
    <section className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-yellow-600 mb-8 text-center">
        💳 Paiement de la réservation
      </h1>

      {/* Résumé de la réservation */}
      {reservation && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">📋 Résumé</h2>
          
          <div className="space-y-3">
            {reservation.appartement && (
              <div className="flex justify-between">
                <span className="text-gray-600">Appartement:</span>
                <span className="font-medium">{reservation.appartement.titre || 'Non spécifié'}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-gray-600">Date de début:</span>
              <span className="font-medium">
                {new Date(reservation.dateDebut).toLocaleDateString('fr-FR')}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Date de fin:</span>
              <span className="font-medium">
                {new Date(reservation.dateFin).toLocaleDateString('fr-FR')}
              </span>
            </div>
            
            <div className="flex justify-between pt-3 border-t-2">
              <span className="text-lg font-semibold">Montant total:</span>
              <span className="text-2xl font-bold text-yellow-600">
                {reservation.prixTotal?.toLocaleString()} FCFA
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="text-red-600">⚠️ {error}</p>
        </div>
      )}

      {/* Choix du mode de paiement */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Choisissez votre mode de paiement</h3>

        <div className="space-y-3">
          {/* Orange Money */}
          <div
            onClick={() => setModePaiement('orange_money')}
            className={`cursor-pointer border-2 rounded-lg p-4 flex items-center justify-between transition
              ${modePaiement === 'orange_money' 
                ? 'border-yellow-600 bg-yellow-50' 
                : 'border-gray-300 hover:border-yellow-400'}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🟠</span>
              <div>
                <p className="font-semibold">Orange Money</p>
                <p className="text-sm text-gray-600">Paiement instantané</p>
              </div>
            </div>
            <input 
              type="radio" 
              name="paiement" 
              checked={modePaiement === 'orange_money'} 
              onChange={() => {}}
              className="w-5 h-5"
            />
          </div>

          {/* Mobile Money */}
          <div
            onClick={() => setModePaiement('mobile_money')}
            className={`cursor-pointer border-2 rounded-lg p-4 flex items-center justify-between transition
              ${modePaiement === 'mobile_money' 
                ? 'border-yellow-600 bg-yellow-50' 
                : 'border-gray-300 hover:border-yellow-400'}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📱</span>
              <div>
                <p className="font-semibold">Mobile Money (MTN)</p>
                <p className="text-sm text-gray-600">Paiement instantané</p>
              </div>
            </div>
            <input 
              type="radio" 
              name="paiement" 
              checked={modePaiement === 'mobile_money'} 
              onChange={() => {}}
              className="w-5 h-5"
            />
          </div>

          {/* Cash */}
          <div
            onClick={() => setModePaiement('cash')}
            className={`cursor-pointer border-2 rounded-lg p-4 flex items-center justify-between transition
              ${modePaiement === 'cash' 
                ? 'border-yellow-600 bg-yellow-50' 
                : 'border-gray-300 hover:border-yellow-400'}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">💵</span>
              <div>
                <p className="font-semibold">Paiement en espèces</p>
                <p className="text-sm text-gray-600">Paiement à l'arrivée ou au bureau</p>
              </div>
            </div>
            <input 
              type="radio" 
              name="paiement" 
              checked={modePaiement === 'cash'} 
              onChange={() => {}}
              className="w-5 h-5"
            />
          </div>
        </div>
      </div>

      {/* Information supplémentaire */}
      {modePaiement === 'cash' && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            ℹ️ <strong>Note:</strong> Le paiement en espèces sera effectué lors de la remise des clés 
            ou directement à notre bureau. Vous recevrez un reçu officiel.
          </p>
        </div>
      )}

      {(modePaiement === 'orange_money' || modePaiement === 'mobile_money') && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm">
            ✅ <strong>Paiement sécurisé:</strong> Vous serez redirigé vers la plateforme de paiement 
            pour finaliser la transaction en toute sécurité.
          </p>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="flex gap-4">
        <Link
          href="/appartements"
          className="flex-1 text-center border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          Annuler
        </Link>

        <button
          onClick={handlePaiement}
          disabled={submitting || !modePaiement}
          className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? '⏳ Traitement...' : '✓ Confirmer le paiement'}
        </button>
      </div>
    </section>
  )
}
