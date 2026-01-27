import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import paiementRoutes from './routes/paiement.js';
import reservationRoutes from './routes/reservation.js';

const app = express();

/* ===== MIDDLEWARES ===== */
app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json());

/* ===== ROUTES ===== */
app.use('/api/paiements', paiementRoutes);
app.use('/api/reservations', reservationRoutes);

/* ===== MONGODB ===== */
mongoose.connect('mongodb://localhost:27017/location_db')
  .then(() => console.log('MongoDB connecté ✅'))
  .catch(err => console.error('Erreur MongoDB ❌', err));

/* ===== SERVER ===== */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
