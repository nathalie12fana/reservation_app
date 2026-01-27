import express from 'express';
import Reservation from '../src/models/Reservation.js';
;

const router = express.Router();

// créer une réservation
router.post('/', async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    console.error('Erreur exacte :', err);
    res.status(500).json({ message: 'Erreur réservation', erreur: err.message });
  }
});

export default router;
