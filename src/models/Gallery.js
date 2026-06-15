import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  
  // ✅ Remove enum restriction - accept any category
  category: { type: String, default: 'project' },
  
  // ✅ YouTube support
  mediaType: { type: String, default: 'image' },
  youtubeUrl: { type: String, default: '' },
  youtubeId: { type: String, default: '' },
}, { timestamps: true });

// ✅ Force recompile model to apply schema changes
if (mongoose.models.Gallery) {
  delete mongoose.models.Gallery;
}

export default mongoose.model('Gallery', GallerySchema);