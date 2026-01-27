// models/Paiement.js
import mongoose from 'mongoose';

const paiementSchema = new mongoose.Schema({
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    required: true
  },
  montant: {
    type: Number,
    required: true
  },
  modePaiement: {
    type: String,
    enum: ['orange_money', 'mobile_money', 'cash', 'card', 'paypal'],
    required: true
  },
  statut: {
    type: String,
    enum: ['en_attente', 'payé', 'échoué', 'pending', 'completed', 'failed'],
    default: 'en_attente'
  },
  datePaiement: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Paiement = mongoose.models.Paiement || mongoose.model('Paiement', paiementSchema);
export default Paiement;
