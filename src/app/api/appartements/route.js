export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const loc = searchParams.get('localisation');
  let data = [{"id": 1, "nom": "R\u00e9sidence Soleil", "type": "Haut standing", "localisation": "Douala - Bonapriso", "pieces": 4, "prix": 250000, "description": "Bel appartement lumineux avec grande terrasse et vue.", "services": ["Wi-Fi", "Parking", "Piscine", "Salle de sport", "Concierge"], "image": "/images/app1.svg"}, {"id": 2, "nom": "Villa des Palmiers", "type": "Moyen standing", "localisation": "Yaound\u00e9 - Bastos", "pieces": 3, "prix": 150000, "description": "Confortable villa proche des commodit\u00e9s.", "services": ["Wi-Fi", "Parking", "Concierge"], "image": "/images/app2.svg"}, {"id": 3, "nom": "Les Terrasses Bleues", "type": "Haut standing", "localisation": "Douala - Akwa", "pieces": 5, "prix": 320000, "description": "Grand espace, piscine commune et salle de sport.", "services": ["Wi-Fi", "Parking", "Piscine", "Salle de sport"], "image": "/images/app3.svg"}];
  if (type) data = data.filter(a => a.type === type);
  if (loc) data = data.filter(a => a.localisation === loc);
  return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
