'use client'

export default function Filters({ types, locations, onFilter }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-6">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <select
          onChange={(e) => onFilter({ type: e.target.value })}
          className="px-3 py-2 rounded border w-full sm:w-auto"
        >
          <option value="">Tous les types</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          onChange={(e) => onFilter({ localisation: e.target.value })}
          className="px-3 py-2 rounded border w-full sm:w-auto"
        >
          <option value="">Toutes les localisations</option>
          {locations.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      <div className="text-sm text-gray-600 mt-2 sm:mt-0">
        Filtrage instantané
      </div>
    </div>
  )
}
