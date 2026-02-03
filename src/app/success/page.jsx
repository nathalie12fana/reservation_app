'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

// Component that uses useSearchParams
function SuccessContent() {
  const searchParams = useSearchParams()
  const reservationId = searchParams.get('reservationId')
  const mode = searchParams.get('mode')

  const getModePaiementLabel = (mode) => {
    const labels = {
      'orange_money': '🟠 Orange Money',
      'mobile_money': '📱 Mobile Money',
      'cash': '💵 Espèces'
    }
    return labels[mode] || 'Paiement'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Success card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Green header with success icon */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 animate-bounce">
              <span className="text-5xl">✓</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Paiement confirmé !
            </h1>
            <p className="text-green-100 text-lg">
              Votre réservation a été enregistrée avec succès
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Information */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <span className="text-2xl">📧</span>
                <div>
                  <p className="font-semibold text-gray-800">Email de confirmation</p>
                  <p className="text-sm text-gray-600">
                    Un email de confirmation vous sera envoyé sous peu avec tous les détails de votre réservation.
                  </p>
                </div>
              </div>

              {mode && (
                <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                  <span className="text-2xl">💳</span>
                  <div>
                    <p className="font-semibold text-gray-800">Mode de paiement</p>
                    <p className="text-sm text-gray-600">
                      {getModePaiementLabel(mode)}
                    </p>
                  </div>
                </div>
              )}

              {reservationId && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl">🔢</span>
                  <div>
                    <p className="font-semibold text-gray-800">Numéro de réservation</p>
                    <p className="text-sm text-gray-600 font-mono">
                      #{reservationId}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Conservez ce numéro pour toute correspondance
                    </p>
                  </div>
                </div>
              )}

              {mode === 'cash' && (
                <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="font-semibold text-orange-800">Rappel - Paiement en espèces</p>
                    <p className="text-sm text-orange-700">
                      N'oubliez pas d'apporter le montant en espèces lors de la remise des clés.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Next steps */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
              <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>📋</span>
                Et maintenant ?
              </h2>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">1.</span>
                  <span>Vous recevrez un email de confirmation avec tous les détails</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">2.</span>
                  <span>Le propriétaire vous contactera dans les 24 heures</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">3.</span>
                  <span>Préparez vos documents d'identité pour la signature du contrat</span>
                </li>
                {mode === 'cash' && (
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">4.</span>
                    <span>Préparez le montant en espèces pour le jour de la remise des clés</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/"
                className="flex-1 text-center bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition transform hover:scale-105"
              >
                🏠 Retour à l'accueil
              </Link>
              
              <Link
                href="/appartements"
                className="flex-1 text-center border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition"
              >
                Voir d'autres appartements
              </Link>
            </div>
          </div>
        </div>

        {/* Encouragement message */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            🎉 Merci d'avoir choisi notre plateforme !
          </p>
        </div>
      </div>
    </div>
  )
}

// Loading fallback component
function SuccessLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement...</p>
      </div>
    </div>
  )
}

// Main component - wraps SuccessContent in Suspense
export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessLoading />}>
      <SuccessContent />
    </Suspense>
  )
}
