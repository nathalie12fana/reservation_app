// routes/paiement.js
import express from 'express';
import Paiement from '../src/models/Paiement.js';
import Reservation from '../src/models/Reservation.js';

const router = express.Router();

// Créer un paiement et lier à une réservation
router.post('/', async (req, res) => {
  try {
    const { reservationId, montant, modePaiement } = req.body;

    // Vérifier si la réservation existe
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation introuvable' });
    }

    // Créer le paiement
    const paiement = new Paiement({
      reservation: reservationId,
      montant,
      modePaiement,
      status: 'completed' // ou gérer via un service de paiement réel
    });
    await paiement.save();

    // Lier le paiement à la réservation
    reservation.paiement = paiement._id;
    reservation.status = 'confirmed'; // confirmer la réservation après paiement
    await reservation.save();

    res.status(201).json({ message: 'Paiement effectué avec succès', paiement });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer tous les paiements
router.get('/', async (req, res) => {
  try {
    const paiements = await Paiement.find().populate('reservation');
    res.json(paiements);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
