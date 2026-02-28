import express from 'express';
import auth from '../middleware/auth.js';
import Mood from '../models/Mood.js';

const router = express.Router();

// Log a mood entry
router.post('/log', auth, async (req, res) => {
  try {
    const { mood, intensity, activities, notes, triggers, sleepHours, exerciseMinutes, socialInteraction, date } = req.body;

    if (!mood || !intensity || !date) {
      return res.status(400).json({ error: 'Please provide mood, intensity, and date' });
    }

    const moodEntry = new Mood({
      userId: req.user.userId,
      mood,
      intensity,
      activities: activities || [],
      notes: notes || '',
      triggers: triggers || [],
      sleepHours: sleepHours || null,
      exerciseMinutes: exerciseMinutes || null,
      socialInteraction: socialInteraction || 'moderate',
      date: new Date(date),
    });

    await moodEntry.save();
    res.json({ message: 'Mood logged successfully', data: moodEntry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all mood entries for user
router.get('/entries', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = { userId: req.user.userId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const moods = await Mood.find(query).sort({ date: -1 });
    res.json(moods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get mood entry by ID
router.get('/entry/:id', auth, async (req, res) => {
  try {
    const mood = await Mood.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!mood) {
      return res.status(404).json({ error: 'Mood entry not found' });
    }
    res.json(mood);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update mood entry
router.put('/entry/:id', auth, async (req, res) => {
  try {
    const { mood, intensity, activities, notes, triggers, sleepHours, exerciseMinutes, socialInteraction } = req.body;

    let moodEntry = await Mood.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!moodEntry) {
      return res.status(404).json({ error: 'Mood entry not found' });
    }

    moodEntry.mood = mood || moodEntry.mood;
    moodEntry.intensity = intensity || moodEntry.intensity;
    moodEntry.activities = activities || moodEntry.activities;
    moodEntry.notes = notes || moodEntry.notes;
    moodEntry.triggers = triggers || moodEntry.triggers;
    moodEntry.sleepHours = sleepHours !== undefined ? sleepHours : moodEntry.sleepHours;
    moodEntry.exerciseMinutes = exerciseMinutes !== undefined ? exerciseMinutes : moodEntry.exerciseMinutes;
    moodEntry.socialInteraction = socialInteraction || moodEntry.socialInteraction;

    await moodEntry.save();
    res.json({ message: 'Mood updated successfully', data: moodEntry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete mood entry
router.delete('/entry/:id', auth, async (req, res) => {
  try {
    const mood = await Mood.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!mood) {
      return res.status(404).json({ error: 'Mood entry not found' });
    }
    res.json({ message: 'Mood entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
