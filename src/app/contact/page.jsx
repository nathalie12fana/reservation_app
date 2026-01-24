"use client"; // Permet d'utiliser useState

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message envoyé (simulation)");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Contactez-nous</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-sm space-y-4"
      >
        <div>
          <label className="block text-sm mb-1">Nom</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Message</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            rows={5}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}
