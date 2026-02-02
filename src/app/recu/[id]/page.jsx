'use client'

import { useState, useEffect, use, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function RecuPage({ params }) {
  const { id } = use(params)
  const router = useRouter()
  const printRef = useRef()

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
      
      // Fetch reservation
      const resResponse = await fetch(`/api/reservations/${id}`)
      
      if (!resResponse.ok) {
        throw new Error('Réservation non trouvée')
      }
      
      const resData = await resResponse.json()
      setReservation(resData)

      // Fetch payment
      try {
        const paiementResponse = await fetch(`/api/paiements?reservationId=${id}`)
        
        if (paiementResponse.ok) {
          const paiementData = await paiementResponse.json()
          setPaiement(paiementData)
        }
      } catch (err) {
        console.log('Pas de paiement trouvé:', err.message)
      }

    } catch (err) {
      console.error('Erreur:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleRetourAccueil = () => {
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du reçu...</p>
        </div>
      </div>
    )
  }

  if (error || !reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center max-w-md">
          <div className="text-5xl mb-4">❌</div>
          <p className="text-red-600 font-medium mb-6">{error || 'Réservation non trouvée'}</p>
          <Link 
            href="/" 
            className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Retour à laccueil
          </Link>
        </div>
      </div>
    )
  }

  const getStatutBadge = (statut) => {
    const badges = {
      'en_attente': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '⏳ En attente' },
      'confirmée': { bg: 'bg-green-100', text: 'text-green-800', label: '✅ Confirmée' },
      'payé': { bg: 'bg-green-100', text: 'text-green-800', label: '✅ Payé' },
      'annulée': { bg: 'bg-red-100', text: 'text-red-800', label: '❌ Annulée' }
    }
    return badges[statut] || badges['en_attente']
  }

  const getModePaiementLabel = (mode) => {
    const labels = {
      'orange_money': 'Orange Money',
      'mobile_money': 'Mobile Money',
      'cash': 'Espèces'
    }
    return labels[mode] || mode
  }

  const dureeJours = Math.ceil(
    (new Date(reservation.dateFin) - new Date(reservation.dateDebut)) / (1000 * 60 * 60 * 24)
  )

  return (
    <>
     

      {/* Reçu imprimable */}
      <div ref={printRef} className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-8 py-12">
          {/* En-tête avec logo */}
          <div className="border-b-4 border-yellow-600 pb-6 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">APPART</h1>
                <p className="text-gray-600">Location dappartements</p>
              </div>
              <div className="text-right">
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg inline-block">
                  <span className="text-2xl font-bold">✓</span>
                  <span className="ml-2 font-semibold">CONFIRMÉ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Titre du reçu */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Reçu de Réservation</h2>
            <p className="text-gray-600">
              N° {reservation._id}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Émis le {new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Informations client et appartement */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Client */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>👤</span> Client
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Nom complet</p>
                  <p className="font-semibold text-gray-800">
                    {reservation.utilisateur?.nom || 'Non spécifié'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-800">
                    {reservation.utilisateur?.email || 'Non spécifié'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Téléphone</p>
                  <p className="font-medium text-gray-800">
                    {reservation.utilisateur?.telephone || 'Non spécifié'}
                  </p>
                </div>
              </div>
            </div>

            {/* Appartement */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🏠</span> Appartement
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Titre</p>
                  <p className="font-semibold text-gray-800">
                    {reservation.appartement?.titre || 'Non spécifié'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Localisation</p>
                  <p className="font-medium text-gray-800">
                    {reservation.appartement?.ville || 'Non spécifié'}
                  </p>
                  {reservation.appartement?.adresse && (
                    <p className="text-sm text-gray-600">
                      {reservation.appartement.adresse}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Capacité</p>
                  <p className="font-medium text-gray-800">
                    {reservation.appartement?.nombrePersonnes || 'N/A'} personnes
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Détails de la réservation */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>📅</span> Détails du séjour
            </h3>
            
            <div className="grid grid-cols-3 gap-6 mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Date darrivée</p>
                <p className="text-lg font-bold text-gray-800">
                  {new Date(reservation.dateDebut).toLocaleDateString('fr-FR', {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Date de départ</p>
                <p className="text-lg font-bold text-gray-800">
                  {new Date(reservation.dateFin).toLocaleDateString('fr-FR', {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Durée du séjour</p>
                <p className="text-lg font-bold text-gray-800">
                  {dureeJours} jour{dureeJours > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-yellow-300">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">Statut de la réservation</span>
                <span className={`${getStatutBadge(reservation.statut).bg} ${getStatutBadge(reservation.statut).text} px-4 py-2 rounded-full font-semibold`}>
                  {getStatutBadge(reservation.statut).label}
                </span>
              </div>
            </div>
          </div>

          {/* Informations de paiement */}
          {paiement && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>💳</span> Informations de paiement
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Mode de paiement</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {getModePaiementLabel(paiement.modePaiement)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Date de paiement</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {new Date(paiement.datePaiement).toLocaleDateString('fr-FR')}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Statut du paiement</p>
                  <span className={`${getStatutBadge(paiement.statut).bg} ${getStatutBadge(paiement.statut).text} px-3 py-1 rounded-full font-medium inline-block`}>
                    {getStatutBadge(paiement.statut).label}
                  </span>
                </div>

                {paiement.numeroTransaction && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">N° de transaction</p>
                    <p className="text-lg font-mono font-semibold text-gray-800">
                      {paiement.numeroTransaction}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Récapitulatif financier */}
          <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>💰</span> Récapitulatif financier
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Prix par jour</span>
                <span className="font-semibold text-gray-800">
                  {reservation.appartement?.prix?.toLocaleString()} FCFA
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-700">Nombre de jours</span>
                <span className="font-semibold text-gray-800">× {dureeJours}</span>
              </div>

              <div className="border-t-2 border-gray-300 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">Montant total</span>
                  <span className="text-3xl font-bold text-yellow-600">
                    {reservation.prixTotal?.toLocaleString()} FCFA
                  </span>
                </div>
              </div>

              {paiement && paiement.statut === 'payé' && (
                <div className="bg-green-100 border border-green-300 rounded-lg p-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-green-800 font-semibold">Montant payé</span>
                    <span className="text-green-800 font-bold">
                      {reservation.prixTotal?.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Conditions et notes */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-3">📋 Conditions et informations importantes</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Larrivée s effectue à partir de 14h00 et le départ avant 11h00</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Une pièce d identité valide sera demandée lors de larrivée</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Annulation possible jusqu à 48h avant la date d arrivée</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>En cas de problème, contactez-nous immédiatement</span>
              </li>
              {paiement?.modePaiement === 'cash' && paiement?.statut === 'en_attente' && (
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span className="font-semibold text-yellow-800">
                    Paiement en espèces à effectuer lors de la remise des clés
                  </span>
                </li>
              )}
            </ul>
          </div>

          {/* Contact et signature */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-3">📞 Contact</h3>
              <div className="space-y-1 text-sm text-gray-700">
                <p>Email: contact@appart.com</p>
                <p>Tél: +237 XXX XXX XXX</p>
                <p>Site: www.appart.com</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-3">✍️ Signature</h3>
              <div className="border-b-2 border-gray-300 mt-8 mb-2"></div>
              <p className="text-xs text-gray-600 text-center">Signature du client</p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-6 border-t-2 border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              Merci d avoir choisi APPART pour votre séjour
            </p>
            <p className="text-xs text-gray-500">
              Ce document fait office de reçu officiel de réservation
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Imprimé le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
            </p>
          </div>
        </div>
      </div>
       {/* Boutons d'actions - non imprimables */}
      <div className="print:hidden bg-gray-100 py-4 sticky top-0 z-10 border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Reçu de réservation</h2>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition flex items-center gap-2"
            >
              <span>🖨️</span>
              Imprimer
            </button>
            <button
              onClick={handleRetourAccueil}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium transition flex items-center gap-2"
            >
              <span>🏠</span>
              Retour à laccueil
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
