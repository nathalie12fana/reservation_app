'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, pending, confirmed, cancelled

  useEffect(() => {
    fetchReservations()
  }, [])

  async function fetchReservations() {
    try {
      const response = await fetch('/api/reservations')
      const data = await response.json()
      
      // Trier par date (plus récent en premier)
      const sorted = data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      )
      
      setReservations(sorted)
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    
    const labels = {
      pending: '⏳ En attente',
      confirmed: '✅ Confirmée',
      cancelled: '❌ Annulée',
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    )
  }

  const getPaymentBadge = (isPaid) => {
    return isPaid ? (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
        💰 Payé
      </span>
    ) : (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
        ⏰ Non payé
      </span>
    )
  }

  const filteredReservations = reservations.filter(reservation => {
    if (filter === 'all') return true
    return reservation.statut === filter
  })

  const stats = {
    total: reservations.length,
    pending: reservations.filter(r => r.statut === 'pending').length,
    confirmed: reservations.filter(r => r.statut === 'confirmed').length,
    paid: reservations.filter(r => r.isPaid).length,
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
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Réservations
            </h1>
            <p className="text-gray-600">
              Gérez toutes les réservations de la plateforme
            </p>
          </div>
          <Link
            href="/admin/dashboard"
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
          >
            ← Retour au dashboard
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Total</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-4">
            <p className="text-yellow-800 text-sm">En attente</p>
            <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4">
            <p className="text-green-800 text-sm">Confirmées</p>
            <p className="text-2xl font-bold text-green-900">{stats.confirmed}</p>
          </div>
          <div className="bg-blue-50 rounded-lg shadow p-4">
            <p className="text-blue-800 text-sm">Payées</p>
            <p className="text-2xl font-bold text-blue-900">{stats.paid}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Toutes ({stats.total})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            En attente ({stats.pending})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'confirmed'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Confirmées ({stats.confirmed})
          </button>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredReservations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucune réservation trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appartement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paiement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date réservation
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservations.map((reservation) => (
                  <tr key={reservation._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {reservation.utilisateur?.nom?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {reservation.utilisateur?.nom || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {reservation.utilisateur?.email || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {reservation.appartement?.titre || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reservation.appartement?.ville || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(reservation.dateDebut).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-sm text-gray-500">
                        au {new Date(reservation.dateFin).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {reservation.montantTotal?.toLocaleString('fr-FR')} FCFA
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(reservation.statut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPaymentBadge(reservation.isPaid)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
