import mongoose from 'mongoose';

const MoodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mood: {
    type: String,
    enum: ['terrible', 'bad', 'neutral', 'good', 'excellent'],
    required: true,
  },
  intensity: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },
  activities: {
    type: [String],
    default: [],
  },
  notes: {
    type: String,
    default: '',
  },
  triggers: {
    type: [String],
    default: [],
  },
  sleepHours: {
    type: Number,
    default: null,
  },
  exerciseMinutes: {
    type: Number,
    default: null,
  },
  socialInteraction: {
    type: String,
    enum: ['none', 'minimal', 'moderate', 'extensive'],
    default: 'moderate',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  date: {
    type: Date,
    required: true,
    index: true,
  },
});

export default mongoose.model('Mood', MoodSchema);
