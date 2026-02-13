'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, client, proprietaire, admin

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [usersRes, reservationsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/reservations'),
      ])
      
      const usersData = await usersRes.json()
      const reservationsData = await reservationsRes.json()
      
      setUsers(usersData)
      setReservations(reservationsData)
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-red-100 text-red-800',
      proprietaire: 'bg-blue-100 text-blue-800',
      client: 'bg-green-100 text-green-800',
    }
    
    const labels = {
      admin: '👑 Admin',
      proprietaire: '🏢 Propriétaire',
      client: '👤 Client',
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[role] || 'bg-gray-100 text-gray-800'}`}>
        {labels[role] || role}
      </span>
    )
  }

  const getUserReservations = (userId) => {
    return reservations.filter(r => r.utilisateur?._id === userId || r.utilisateur === userId)
  }

  const getUserPaymentStatus = (userId) => {
    const userReservations = getUserReservations(userId)
    const paidCount = userReservations.filter(r => r.isPaid).length
    const totalCount = userReservations.length
    
    if (totalCount === 0) {
      return { status: 'none', text: 'Aucune réservation', color: 'bg-gray-100 text-gray-800' }
    }
    
    if (paidCount === totalCount) {
      return { status: 'all', text: `${paidCount}/${totalCount} payées`, color: 'bg-green-100 text-green-800' }
    } else if (paidCount > 0) {
      return { status: 'partial', text: `${paidCount}/${totalCount} payées`, color: 'bg-orange-100 text-orange-800' }
    } else {
      return { status: 'none', text: `${paidCount}/${totalCount} payées`, color: 'bg-red-100 text-red-800' }
    }
  }

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true
    return user.role === filter
  })

  const stats = {
    total: users.length,
    clients: users.filter(u => u.role === 'client').length,
    proprietaires: users.filter(u => u.role === 'proprietaire').length,
    admins: users.filter(u => u.role === 'admin').length,
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
              Utilisateurs
            </h1>
            <p className="text-gray-600">
              Gérez tous les utilisateurs de la plateforme
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
          <div className="bg-green-50 rounded-lg shadow p-4">
            <p className="text-green-800 text-sm">Clients</p>
            <p className="text-2xl font-bold text-green-900">{stats.clients}</p>
          </div>
          <div className="bg-blue-50 rounded-lg shadow p-4">
            <p className="text-blue-800 text-sm">Propriétaires</p>
            <p className="text-2xl font-bold text-blue-900">{stats.proprietaires}</p>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-4">
            <p className="text-red-800 text-sm">Admins</p>
            <p className="text-2xl font-bold text-red-900">{stats.admins}</p>
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
            Tous ({stats.total})
          </button>
          <button
            onClick={() => setFilter('client')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'client'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Clients ({stats.clients})
          </button>
          <button
            onClick={() => setFilter('proprietaire')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'proprietaire'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Propriétaires ({stats.proprietaires})
          </button>
          <button
            onClick={() => setFilter('admin')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'admin'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Admins ({stats.admins})
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Téléphone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Réservations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut Paiement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inscrit le
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const userReservations = getUserReservations(user._id)
                  const paymentStatus = getUserPaymentStatus(user._id)
                  
                  return (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {user.nom?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.nom}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.telephone || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {userReservations.length} réservation{userReservations.length > 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentStatus.color}`}>
                          {paymentStatus.status === 'all' && '✅ '}
                          {paymentStatus.status === 'partial' && '⚠️ '}
                          {paymentStatus.status === 'none' && userReservations.length > 0 && '❌ '}
                          {paymentStatus.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">📊 Légende Statut Paiement:</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs text-blue-800">
          <div>✅ Toutes les réservations payées</div>
          <div>⚠️ Paiements partiels</div>
          <div>❌ Aucun paiement effectué</div>
          <div>⚪ Aucune réservation</div>
        </div>
      </div>
    </div>
  )
}
