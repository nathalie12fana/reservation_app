'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function ReservationPage({ params }) {
  const router = useRouter()
  const { id } = use(params)
  
  const [apt, setApt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Form state
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')
  const [utilisateurEmail, setUtilisateurEmail] = useState('')
  const [utilisateurNom, setUtilisateurNom] = useState('')
  const [error, setError] = useState('')
  const [dateError, setDateError] = useState('')

  useEffect(() => {
    fetchAppartement()
  }, [id])

  useEffect(() => {
    validateDates()
  }, [dateDebut, dateFin])

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
    if (!utilisateurEmail || !utilisateurNom) {
      setError('Veuillez remplir tous les champs')
      return
    }

    try {
      setSubmitting(true)
      setError('')

      // For now, we'll use a mock user ID
      // In production, you'd get this from auth (Clerk)
      const mockUserId = '507f1f77bcf86cd799439011' // Replace with real user ID from auth

      const reservationData = {
        appartement: id,
        utilisateur: mockUserId,
        dateDebut: new Date(dateDebut).toISOString(),
        dateFin: new Date(dateFin).toISOString(),
        prixTotal: calculatePrixTotal(),
        statut: 'en_attente'
      }

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la réservation')
      }

      // Redirect to payment page instead of confirmation
      router.push(`/paiement/${result.reservation._id}`)
      
    } catch (err) {
      console.error('Erreur:', err)
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

  if (!apt) {
    return null
  }

  const dureeJours = calculateDuree()
  const prixTotal = calculatePrixTotal()

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-yellow-600 mb-8">Réserver votre appartement</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Colonne gauche - Infos appartement */}
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
        </div>

        {/* Colonne droite - Formulaire */}
        <div>
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Informations de réservation</h3>

            {/* Nom */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet *
              </label>
              <input
                type="text"
                value={utilisateurNom}
                onChange={(e) => setUtilisateurNom(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Jean Dupont"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={utilisateurEmail}
                onChange={(e) => setUtilisateurEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="jean@example.com"
                required
              />
            </div>

            {/* Date début */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début *
              </label>
              <input
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>

            {/* Date fin */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin *
              </label>
              <input
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                min={dateDebut || new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>

            {/* Erreurs */}
            {dateError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{dateError}</p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Résumé */}
            {dateDebut && dateFin && !dateError && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3">Résumé</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durée:</span>
                    <span className="font-medium">{dureeJours} jours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prix par mois:</span>
                    <span className="font-medium">{apt.prix?.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-yellow-600 text-lg">
                      {prixTotal.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Boutons */}
            <div className="flex gap-3">
              <Link
                href={`/appartements/${id}`}
                className="flex-1 text-center border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={submitting || !!dateError || !dateDebut || !dateFin || !utilisateurEmail || !utilisateurNom}
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
