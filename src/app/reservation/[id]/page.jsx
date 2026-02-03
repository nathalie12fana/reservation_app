'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import Link from 'next/link'
import Image from 'next/image'

export default function ReservationPage({ params }) {
  const router = useRouter()
  const { id } = use(params)
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  
  const [apt, setApt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Form state
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')
  const [error, setError] = useState('')
  const [dateError, setDateError] = useState('')

  useEffect(() => {
    fetchAppartement()
  }, [id])

  useEffect(() => {
    validateDates()
  }, [dateDebut, dateFin])

  // Rediriger vers login si non authentifié
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=/reservation/${id}`)
    }
  }, [authLoading, isAuthenticated, id, router])

  async function fetchAppartement() {
    try {
      setLoading(true)
      const response = await fetch(`/api/appartements/${id}`)
      
      if (!response.ok) {
        throw new Error('Appartement non trouvé')
      }

      const data = await response.json()
      setApt(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function validateDates() {
    if (!dateDebut || !dateFin) {
      setDateError('')
      return
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const debut = new Date(dateDebut)
    const fin = new Date(dateFin)

    if (debut < today) {
      setDateError('La date de début ne peut pas être dans le passé')
      return
    }

    if (fin <= debut) {
      setDateError('La date de fin doit être après la date de début')
      return
    }

    setDateError('')
  }

  function calculatePrixTotal() {
    if (!dateDebut || !dateFin || !apt) return 0
    
    const debut = new Date(dateDebut)
    const fin = new Date(dateFin)
    const jours = Math.ceil((fin - debut) / (1000 * 60 * 60 * 24))
    const mois = jours / 30
    
    return Math.round(apt.prix * mois)
  }

  function calculateDuree() {
    if (!dateDebut || !dateFin) return 0
    
    const debut = new Date(dateDebut)
    const fin = new Date(dateFin)
    return Math.ceil((fin - debut) / (1000 * 60 * 60 * 24))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (dateError) return
    
    if (!isAuthenticated || !user) {
      setError('Vous devez être connecté pour réserver')
      router.push(`/login?redirect=/reservation/${id}`)
      return
    }

    try {
      setSubmitting(true)
      setError('')

      console.log('🔵 Création de la réservation...')
      console.log('👤 Utilisateur:', user)

      const reservationData = {
        appartement: id,
        utilisateur: user._id,
        dateDebut: new Date(dateDebut).toISOString(),
        dateFin: new Date(dateFin).toISOString(),
        prixTotal: calculatePrixTotal(),
        statut: 'en_attente'
      }

      console.log('📦 Données de réservation:', reservationData)

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData)
      })

      const result = await response.json()
      console.log('📡 Réponse API:', result)

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la réservation')
      }

      // L'API retourne directement l'objet de réservation, pas { reservation: {...} }
      const reservationId = result._id

      if (!reservationId) {
        console.error("❌ Structure de réponse inattendue:", result)
        throw new Error("ID de réservation manquant dans la réponse du serveur")
      }

      console.log('✅ Réservation créée avec succès, ID:', reservationId)
      console.log('🔄 Redirection vers la page de paiement...')
      
      // Redirection vers la page de paiement
      router.push(`/paiement/${reservationId}`)
      
    } catch (err) {
      console.error('💥 Erreur complète:', err)
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Afficher le chargement pendant l'authentification
  if (authLoading || loading) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-12 min-h-screen">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
        </div>
      </section>
    )
  }

  // Redirection en cours
  if (!isAuthenticated) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-12 min-h-screen">
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-600">Redirection vers la page de connexion...</p>
        </div>
      </section>
    )
  }

  if (error && !apt) {
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

  if (!apt) return null

  const dureeJours = calculateDuree()
  const prixTotal = calculatePrixTotal()

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-yellow-600 mb-8">Réserver votre appartement</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Détails de l'appartement */}
        <div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            {apt.images && apt.images.length > 0 ? (
              <div className="relative h-48 w-full">
                <Image src={apt.images[0]} alt={apt.titre} fill className="object-cover" />
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
                <span className="text-6xl">🏠</span>
              </div>
            )}
            
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{apt.titre}</h2>
              <p className="text-gray-600 mb-4">
                📍 {apt.ville}{apt.quartier && ` - ${apt.quartier}`}
              </p>
              
              <div className="space-y-2 text-sm text-gray-700">
                {apt.type && <p>🏘️ {apt.type}</p>}
                {apt.pieces && <p>🚪 {apt.pieces} pièces</p>}
                {apt.chambres && <p>🛏️ {apt.chambres} chambres</p>}
                {apt.surface && <p>📐 {apt.surface} m²</p>}
              </div>

              <div className="mt-4 pt-4 border-t">
                <p className="text-2xl font-bold text-yellow-600">
                  {apt.prix?.toLocaleString()} FCFA
                  <span className="text-sm text-gray-500 font-normal">/mois</span>
                </p>
              </div>
            </div>
          </div>

          {/* Info utilisateur connecté */}
          {user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                ℹ️ Connecté en tant que: <strong>{user.nom}</strong> ({user.email})
              </p>
            </div>
          )}
        </div>

        {/* Formulaire de réservation */}
        <div>
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Informations de réservation</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de début *</label>
              <input
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin *</label>
              <input
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                min={dateDebut || new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>

            {(dateError || error) && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{dateError || error}</p>
              </div>
            )}

            {dateDebut && dateFin && !dateError && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3">Résumé</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durée:</span>
                    <span className="font-medium">{dureeJours} jours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prix/mois:</span>
                    <span className="font-medium">{apt.prix.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-bold text-yellow-600 text-lg">
                      {prixTotal.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Link
                href={`/appartements/${id}`}
                className="flex-1 text-center border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={submitting || !!dateError || !dateDebut || !dateFin}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Envoi...' : 'Confirmer la réservation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
