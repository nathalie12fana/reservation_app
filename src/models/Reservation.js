import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appartement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appartement',
    required: true
  },
  dateDebut: {
    type: Date,
    required: true
  },
  dateFin: {
    type: Date,
    required: true
  },
  prixTotal: {
    type: Number,
    required: true
  },
  statut: {
    type: String,
    enum: ['en_attente', 'confirmée', 'annulée', 'terminée'],
    default: 'en_attente'
  },
  paiement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paiement'
  }
}, {
  timestamps: true
});

const Reservation = mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);
export default Reservation;
