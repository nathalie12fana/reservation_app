'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddAppartementPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type: 'Appartement',
    prix: '',
    ville: '',
    quartier: '',
    adresse: '',
    pieces: '',
    chambres: '',
    sallesDeBain: '',
    surface: '',
    meuble: false,
    disponible: true,
    images: '',
    services: '',
  })

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Process images and services
      const images = formData.images
        .split(',')
        .map(img => img.trim())
        .filter(img => img)

      const services = formData.services
        .split(',')
        .map(s => s.trim())
        .filter(s => s)

      const dataToSend = {
        ...formData,
        prix: Number(formData.prix),
        pieces: formData.pieces ? Number(formData.pieces) : undefined,
        chambres: formData.chambres ? Number(formData.chambres) : undefined,
        sallesDeBain: formData.sallesDeBain ? Number(formData.sallesDeBain) : undefined,
        surface: formData.surface ? Number(formData.surface) : undefined,
        images,
        services,
      }

      const response = await fetch('/api/appartements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la création')
      }

      alert('Appartement créé avec succès !')
      router.push('/admin/appartements')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Ajouter un appartement
        </h1>
        <p className="text-gray-600">Créez une nouvelle annonce</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-6">
        {/* Informations de base */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Informations de base
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Titre */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre *
              </label>
              <input
                type="text"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="Appartement T3 moderne..."
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="Décrivez l'appartement..."
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                required
              >
                <option value="Studio">Studio</option>
                <option value="Appartement">Appartement</option>
                <option value="Villa">Villa</option>
                <option value="Duplex">Duplex</option>
                <option value="Chambre">Chambre</option>
              </select>
            </div>

            {/* Prix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix (FCFA/mois) *
              </label>
              <input
                type="number"
                name="prix"
                value={formData.prix}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="150000"
                required
              />
            </div>
          </div>
        </div>

        {/* Localisation */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Localisation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ville */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville *
              </label>
              <input
                type="text"
                name="ville"
                value={formData.ville}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="Yaoundé"
                required
              />
            </div>

            {/* Quartier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quartier
              </label>
              <input
                type="text"
                name="quartier"
                value={formData.quartier}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="Bastos"
              />
            </div>

            {/* Adresse */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse complète
              </label>
              <input
                type="text"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="Rue 1234, Avenue..."
              />
            </div>
          </div>
        </div>

        {/* Caractéristiques */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Caractéristiques
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Pièces */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pièces
              </label>
              <input
                type="number"
                name="pieces"
                value={formData.pieces}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="3"
              />
            </div>

            {/* Chambres */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chambres
              </label>
              <input
                type="number"
                name="chambres"
                value={formData.chambres}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="2"
              />
            </div>

            {/* Salles de bain */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salles de bain
              </label>
              <input
                type="number"
                name="sallesDeBain"
                value={formData.sallesDeBain}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="1"
              />
            </div>

            {/* Surface */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surface (m²)
              </label>
              <input
                type="number"
                name="surface"
                value={formData.surface}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="85"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6 mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="meuble"
                checked={formData.meuble}
                onChange={handleChange}
                className="w-4 h-4 text-yellow-600"
              />
              <span className="text-sm text-gray-700">Meublé</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="disponible"
                checked={formData.disponible}
                onChange={handleChange}
                className="w-4 h-4 text-yellow-600"
              />
              <span className="text-sm text-gray-700">Disponible</span>
            </label>
          </div>
        </div>

        {/* Services et Images */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Services et Images
          </h2>
          
          <div className="space-y-4">
            {/* Services */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Services (séparés par des virgules)
              </label>
              <input
                type="text"
                name="services"
                value={formData.services}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="WiFi, Parking, Piscine, Climatisation"
              />
              <p className="text-xs text-gray-500 mt-1">
                Exemple: WiFi, Parking, Piscine
              </p>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images (URLs séparées par des virgules)
              </label>
              <input
                type="text"
                name="images"
                value={formData.images}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="/images/app1.svg, /images/app2.svg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Exemple: /images/app1.svg, /images/app2.svg
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Création...' : 'Créer l\'appartement'}
          </button>
        </div>
      </form>
    </div>
  )
}
