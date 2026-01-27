'use client'

import { useState, useEffect, use } from 'react'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ModifierAppartementPage({ params }) {
  const { id } = use(params)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [formData, setFormData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/mes-appartements')
    } else if (user) {
      fetchAppartement()
    }
  }, [user, authLoading])

  async function fetchAppartement() {
    try {
      setLoading(true)
      const response = await fetch(`/api/appartements/${id}`)
      
      if (!response.ok) {
        throw new Error('Appartement non trouvé')
      }

      const apt = await response.json()
      
      // Vérifier que c'est bien l'appartement de l'utilisateur
      if (apt.proprietaire && apt.proprietaire.toString() !== user._id) {
        alert('❌ Vous ne pouvez pas modifier cet appartement')
        router.push('/mes-appartements')
        return
      }

      // Préparer les données pour le formulaire
      setFormData({
        titre: apt.titre || '',
        description: apt.description || '',
        type: apt.type || 'Appartement',
        prix: apt.prix || '',
        ville: apt.ville || 'Douala',
        quartier: apt.quartier || '',
        adresse: apt.adresse || '',
        chambres: apt.chambres || '',
        pieces: apt.pieces || '',
        surface: apt.surface || '',
        disponible: apt.disponible !== false,
        equipements: apt.equipements ? apt.equipements.join(', ') : '',
        images: apt.images ? apt.images.join(', ') : ''
      })
    } catch (err) {
      console.error('Erreur:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.titre || !formData.prix) {
      setError('Le titre et le prix sont obligatoires')
      return
    }

    try {
      setSubmitting(true)

      // Préparer les données
      const appartementData = {
        ...formData,
        prix: parseInt(formData.prix),
        chambres: formData.chambres ? parseInt(formData.chambres) : undefined,
        pieces: formData.pieces ? parseInt(formData.pieces) : undefined,
        surface: formData.surface ? parseInt(formData.surface) : undefined,
        equipements: formData.equipements
          ? formData.equipements.split(',').map(e => e.trim()).filter(Boolean)
          : [],
        images: formData.images
          ? formData.images.split(',').map(i => i.trim()).filter(Boolean)
          : []
      }

      const response = await fetch(`/api/appartements/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appartementData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la modification')
      }

      // Succès !
      alert('✅ Appartement modifié avec succès !')
      router.push('/mes-appartements')

    } catch (err) {
      console.error('Erreur:', err)
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    )
  }

  if (!user || !formData) return null

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <Link
            href="/mes-appartements"
            className="text-yellow-600 hover:text-yellow-700 font-medium mb-4 inline-block"
          >
            ← Retour à mes appartements
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Modifier l'Appartement
          </h1>
          <p className="text-gray-600">
            Mettez à jour les informations de votre annonce
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          {/* Message d'erreur */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Titre */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de l'annonce *
            </label>
            <input
              type="text"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Ex: Appartement 2 chambres - Akwa"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Décrivez votre appartement..."
            />
          </div>

          {/* Type et Prix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              >
                <option value="Studio">Studio</option>
                <option value="Appartement">Appartement</option>
                <option value="Villa">Villa</option>
                <option value="Duplex">Duplex</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix mensuel (FCFA) *
              </label>
              <input
                type="number"
                name="prix"
                value={formData.prix}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Ex: 75000"
                required
              />
            </div>
          </div>

          {/* Localisation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville *
              </label>
              <select
                name="ville"
                value={formData.ville}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              >
                <option value="Douala">Douala</option>
                <option value="Yaoundé">Yaoundé</option>
                <option value="Bafoussam">Bafoussam</option>
                <option value="Garoua">Garoua</option>
                <option value="Bamenda">Bamenda</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quartier
              </label>
              <input
                type="text"
                name="quartier"
                value={formData.quartier}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Ex: Akwa"
              />
            </div>
          </div>

          {/* Adresse */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse complète
            </label>
            <input
              type="text"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Ex: Rue de la Liberté"
            />
          </div>

          {/* Caractéristiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chambres
              </label>
              <input
                type="number"
                name="chambres"
                value={formData.chambres}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Ex: 2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pièces
              </label>
              <input
                type="number"
                name="pieces"
                value={formData.pieces}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Ex: 4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surface (m²)
              </label>
              <input
                type="number"
                name="surface"
                value={formData.surface}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Ex: 65"
              />
            </div>
          </div>

          {/* Équipements */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Équipements
            </label>
            <input
              type="text"
              name="equipements"
              value={formData.equipements}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Séparés par des virgules: Cuisine équipée, Climatisation, Wi-Fi"
            />
            <p className="text-sm text-gray-500 mt-1">
              Séparez les équipements par des virgules
            </p>
          </div>

          {/* Images */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images (URLs)
            </label>
            <input
              type="text"
              name="images"
              value={formData.images}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="/images/appt1.jpg, /images/appt2.jpg"
            />
            <p className="text-sm text-gray-500 mt-1">
              Séparez les URLs par des virgules
            </p>
          </div>

          {/* Disponibilité */}
          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="disponible"
                checked={formData.disponible}
                onChange={handleChange}
                className="w-5 h-5 text-yellow-600 rounded focus:ring-2 focus:ring-yellow-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Appartement disponible à la location
              </span>
            </label>
          </div>

          {/* Boutons */}
          <div className="flex gap-4">
            <Link
              href="/mes-appartements"
              className="flex-1 text-center border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Annuler
            </Link>
            
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Enregistrement...' : '✅ Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
