export async function GET(request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  const data = [
    {
      id: 1,
      nom: "Résidence Soleil",
      type: "Haut standing",
      localisation: "Douala - Bonapriso",
      pieces: 4,
      prix: 250000,
      description: "Bel appartement lumineux avec grande terrasse et vue.",
      services: ["Wi-Fi", "Parking", "Piscine", "Salle de sport", "Concierge"],
      image: "/images/app1.svg"
    },
    {
      id: 2,
      nom: "Villa des Palmiers",
      type: "Moyen standing",
      localisation: "Yaoundé - Bastos",
      pieces: 3,
      prix: 150000,
      description: "Confortable villa proche des commodités.",
      services: ["Wi-Fi", "Parking", "Concierge"],
      image: "/images/app2.svg"
    },
    {
      id: 3,
      nom: "Les Terrasses Bleues",
      type: "Haut standing",
      localisation: "Douala - Akwa",
      pieces: 5,
      prix: 320000,
      description: "Grand espace, piscine commune et salle de sport.",
      services: ["Wi-Fi", "Parking", "Piscine", "Salle de sport"],
      image: "/images/app3.svg"
    }
  ];
  const apt = data.find(a => String(a.id) === String(id));
  if (!apt) return new Response(JSON.stringify({ message: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  return new Response(JSON.stringify(apt), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
