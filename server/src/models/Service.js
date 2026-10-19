import mongoose from 'mongoose';

export const SUBJECTS = ['Math', 'Science', 'English', 'Programming', 'Languages', 'Test Prep'];
export const LEVELS = ['High School', 'College', 'All Levels'];

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title can be at most 100 characters'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      enum: { values: SUBJECTS, message: `Subject must be one of: ${SUBJECTS.join(', ')}` },
    },
    level: {
      type: String,
      enum: { values: LEVELS, message: `Level must be one of: ${LEVELS.join(', ')}` },
      default: 'All Levels',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description can be at most 1000 characters'],
    },
    durationMinutes: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [15, 'Duration must be at least 15 minutes'],
      max: [240, 'Duration can be at most 240 minutes'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    tutorName: {
      type: String,
      required: [true, 'Tutor name is required'],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Service = mongoose.model('Service', serviceSchema);

export default Service;
