import mongoose from 'mongoose';

const HeroSlideSchema = new mongoose.Schema({
  mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  mediaUrl: { type: String, required: true },
  subtitle: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  ctaText: { type: String, default: '' },
  ctaLink: { type: String, default: '' },
  secondaryCTA: { type: String, default: '' },
  secondaryCTALink: { type: String, default: '' },
}, { _id: false });

const HeroSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true,
    enum: ['home', 'about', 'projects', 'gallery', 'contact'],
    unique: true,
  },
  slides: { type: [HeroSlideSchema], default: [] },
  autoScrollSeconds: { type: Number, default: 5 },
}, { timestamps: true });

if (mongoose.models.Hero) {
  delete mongoose.models.Hero;
}

export default mongoose.model('Hero', HeroSchema);