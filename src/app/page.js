
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
     <div className="max-w-6xl mx-auto py-12">
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">
            Bienvenue sur <span className="text-yellow-600">MonLogement</span>
          </h1>
          <p className="text-gray-700 mb-6">
            Trouvez l’appartement parfait pour vos séjours — studios, logements
            familiaux et plus.
          </p>
          <Link
            href="/appartements"
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md"
          >
            Voir les appartements
          </Link>
        </div>

        <div className="h-64 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
          <Image src="/img10.png" 
          alt="nathalie"
          width={450} 
          height={200} className="w-full h-full object-cover"/>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">Nos services</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">🧹 Nettoyage</div>
          <div className="bg-white rounded-lg p-6 shadow-sm">📞 Assistance 24/7</div>
          <div className="bg-white rounded-lg p-6 shadow-sm">🔁 Annulation flexible</div>
        </div>
      </section>
    </div>
    
  );
}

  
