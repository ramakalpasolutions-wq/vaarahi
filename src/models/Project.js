import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  
  heroImage: { type: String, default: '' },
  description: { type: String, default: '' },
  about: { type: String, default: '' },
  video: { type: String, default: '' },
  ctaImage: { type: String, default: '' },
  brochurePdf: { type: String, default: '' },
  amenities: [{ 
    title: String, 
    description: String, 
    icon: String 
  }],
  highlights: [{ 
    title: String, 
    description: String, 
    icon: String 
  }],
  locationHighlights: [{ 
    name: String, 
    distance: String 
  }],
  images: [{ type: String }],
}, { timestamps: true });

if (mongoose.models.Project) {
  delete mongoose.models.Project;
}

export default mongoose.model('Project', ProjectSchema);