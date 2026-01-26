'use client'

import { useAuth } from '@/lib/auth'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'

export default function AdminLayout({ children }) {
  const { user, loading, logout, isAdmin } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/login')
    }
  }, [user, loading, isAdmin, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  const navigation = [
    { name: 'Tableau de bord', href: '/admin/dashboard', icon: '📊' },
    { name: 'Appartements', href: '/admin/appartements', icon: '🏠' },
    { name: 'Ajouter appartement', href: '/admin/appartements/add', icon: '➕' },
    { name: 'Réservations', href: '/admin/reservations', icon: '📅' },
    { name: 'Utilisateurs', href: '/admin/users', icon: '👥' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-yellow-500">Admin Panel</h1>
          <p className="text-sm text-gray-400 mt-1">Gestion des appartements</p>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-600 flex items-center justify-center font-bold">
              {user.fullName?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="font-medium">{user.fullName}</p>
              <p className="text-xs text-gray-400">{user.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-yellow-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 space-y-2">
          <Link
            href="/"
            className="block w-full text-center px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition"
          >
            🏠 Voir le site
          </Link>
          <button
            onClick={logout}
            className="w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
          >
            🚪 Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
