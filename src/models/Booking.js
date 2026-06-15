import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  project: { type: String, required: true },
  plotSize: { type: String },
  message: { type: String },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'confirmed', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);