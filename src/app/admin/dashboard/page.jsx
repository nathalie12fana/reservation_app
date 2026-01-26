'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalAppartements: 0,
    disponibles: 0,
    totalReservations: 0,
    totalUsers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const [appartementsRes, reservationsRes, usersRes] = await Promise.all([
        fetch('/api/appartements'),
        fetch('/api/reservations'),
        fetch('/api/users'),
      ])

      const appartements = await appartementsRes.json()
      const reservations = await reservationsRes.json()
      const users = await usersRes.json()

      setStats({
        totalAppartements: appartements.length || 0,
        disponibles: appartements.filter(a => a.disponible).length || 0,
        totalReservations: reservations.length || 0,
        totalUsers: users.length || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Appartements',
      value: stats.totalAppartements,
      icon: '🏠',
      color: 'bg-blue-500',
      link: '/admin/appartements',
    },
    {
      title: 'Disponibles',
      value: stats.disponibles,
      icon: '✅',
      color: 'bg-green-500',
    },
    {
      title: 'Réservations',
      value: stats.totalReservations,
      icon: '📅',
      color: 'bg-purple-500',
      link: '/admin/reservations',
    },
    {
      title: 'Utilisateurs',
      value: stats.totalUsers,
      icon: '👥',
      color: 'bg-orange-500',
      link: '/admin/users',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Vue d'ensemble de votre plateforme
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
            <h3 className="text-gray-600 font-medium mb-2">{stat.title}</h3>
            {stat.link && (
              <Link
                href={stat.link}
                className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
              >
                Voir tout →
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/appartements/add"
            className="flex items-center gap-3 p-4 border-2 border-yellow-600 rounded-lg hover:bg-yellow-50 transition"
          >
            <span className="text-2xl">➕</span>
            <div>
              <p className="font-semibold text-gray-800">Ajouter appartement</p>
              <p className="text-sm text-gray-600">Créer une nouvelle annonce</p>
            </div>
          </Link>

          <Link
            href="/admin/appartements"
            className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <span className="text-2xl">📝</span>
            <div>
              <p className="font-semibold text-gray-800">Gérer appartements</p>
              <p className="text-sm text-gray-600">Modifier ou supprimer</p>
            </div>
          </Link>

          <Link
            href="/admin/reservations"
            className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <span className="text-2xl">📋</span>
            <div>
              <p className="font-semibold text-gray-800">Voir réservations</p>
              <p className="text-sm text-gray-600">Gérer les demandes</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Activité récente</h2>
        <div className="text-center py-8 text-gray-500">
          <p>Aucune activité récente</p>
          <p className="text-sm mt-2">Les nouvelles réservations apparaîtront ici</p>
        </div>
      </div>
    </div>
  )
}
