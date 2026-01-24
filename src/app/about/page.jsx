import Image from "next/image";
import { FaEnvelope, FaPhone } from "react-icons/fa";

export default function AboutPage() {
  const team = [
    {
      nom: "Nathalie F.",
      poste: "Fondatrice",
      photo: "/nathalie.jpeg",
      email: "nathalie@monlogement.com",
      telephone: "+237 657 577 035",
    },
    {
      nom: "Christelle M.",
      poste: "Chargée clientèle",
      photo: "/christelle.jpeg",
      email: "christelle@monlogement.com",
      telephone: "+237 691 654 321",
    },
    {
      nom: "Paul A.",
      poste: "Agent immobilier",
      photo: "/alex.png",
      email: "paul@monlogement.com",
      telephone: "+237 699 987 654",
    },
  ];

  const avis = [
    {
      nom: "Marie Dupont",
      commentaire:
        "Service impeccable ! J’ai trouvé mon appartement en quelques jours seulement. L’équipe est très professionnelle.",
      photo: "/johan.png",
    },
    {
      nom: "Jean-Luc M.",
      commentaire:
        "Une expérience fluide et agréable. Les agents sont à l’écoute et les appartements sont bien présentés.",
      photo: "/jonas.png",
    },
    {
      nom: "Sophie K.",
      commentaire:
        "Je recommande vivement ! Nathalie et son équipe ont rendu la recherche d’appartement beaucoup plus simple.",
      photo: "/lucas.png",
    },
  ];

  return (
    <section className="px-8 py-12 space-y-16">
      {/* Titre principal */}
      <h2 className="text-3xl font-bold text-yellow-600 text-center">
        À propos de nous
      </h2>

      {/* Historique de l’entreprise */}
      <div className="max-w-3xl mx-auto text-center">
        <h3 className="text-2xl font-semibold mb-4">Notre histoire</h3>
        <p className="text-gray-700 leading-relaxed">
          Fondée en 2018, <span className="font-semibold text-yellow-600">MonLogement</span>{" "}
          a commencé avec une vision simple : rendre la location d’appartements plus
          transparente, rapide et accessible à tous. Grâce à notre passion et à notre
          approche humaine, nous avons accompagné des centaines de clients dans leur
          recherche du logement idéal.
        </p>
      </div>

      {/* Équipe */}
      <div>
        <h3 className="text-2xl font-semibold text-center mb-8">Notre équipe</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {team.map((t) => (
            <div
              key={t.nom}
              className="bg-white p-6 rounded-2xl shadow-md text-center transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl"
            >
              <div className="w-32 h-32 mx-auto mb-4 relative">
                <Image
                  src={t.photo}
                  alt={t.nom}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-yellow-600">{t.nom}</h3>
              <p className="text-gray-600 mb-3">{t.poste}</p>

              <div className="text-sm text-gray-600 space-y-1">
                <p className="flex items-center justify-center gap-2">
                  <FaEnvelope className="text-yellow-600" /> {t.email}
                </p>
                <p className="flex items-center justify-center gap-2">
                  <FaPhone className="text-yellow-600" /> {t.telephone}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Avis des clients */}
      <div>
        <h3 className="text-2xl font-semibold text-center mb-8">Avis de nos clients</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {avis.map((a) => (
            <div
              key={a.nom}
              className="bg-white rounded-2xl shadow-md p-6 text-center relative transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl"
            >
              {/* Photo du client au-dessus du cardre */}
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto -mt-14 border-4 border-white shadow-md relative">
                <Image
                  src={a.photo}
                  alt={a.nom}
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="mt-6 font-semibold text-yellow-600">{a.nom}</h4>
              <p className="text-gray-700 text-sm mt-2">{a.commentaire}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
