import mongoose from 'mongoose';

const BrochureLeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    projectTitle: {
      type: String,
      default: '',
    },
    projectId: {
      type: String,
      default: '',
    },
    brochureUrl: {
      type: String,
      default: '',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.BrochureLead ||
  mongoose.model('BrochureLead', BrochureLeadSchema);