import express from 'express';
import auth from '../middleware/auth.js';
import Mood from '../models/Mood.js';

const router = express.Router();

// Get mood statistics and patterns
router.get('/patterns', auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const moods = await Mood.find({
      userId: req.user.userId,
      date: { $gte: startDate },
    }).sort({ date: -1 });

    if (moods.length === 0) {
      return res.json({ message: 'No mood data available', patterns: {} });
    }

    // Calculate statistics
    const moodCounts = {};
    const moodValues = {
      terrible: 1,
      bad: 2,
      neutral: 3,
      good: 4,
      excellent: 5,
    };
    let totalIntensity = 0;
    let activitiesCount = {};
    let triggersCount = {};
    let averageSleep = 0;
    let averageExercise = 0;

    moods.forEach((m) => {
      moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
      totalIntensity += m.intensity;

      m.activities.forEach((activity) => {
        activitiesCount[activity] = (activitiesCount[activity] || 0) + 1;
      });

      m.triggers.forEach((trigger) => {
        triggersCount[trigger] = (triggersCount[trigger] || 0) + 1;
      });

      if (m.sleepHours) averageSleep += m.sleepHours;
      if (m.exerciseMinutes) averageExercise += m.exerciseMinutes;
    });

    const averageIntensity = totalIntensity / moods.length;
    const avgSleep = moods.filter((m) => m.sleepHours).length > 0 ? averageSleep / moods.filter((m) => m.sleepHours).length : 0;
    const avgExercise = moods.filter((m) => m.exerciseMinutes).length > 0 ? averageExercise / moods.filter((m) => m.exerciseMinutes).length : 0;

    // Calculate mood trend
    const firstHalf = moods.slice(Math.ceil(moods.length / 2));
    const secondHalf = moods.slice(0, Math.ceil(moods.length / 2));

    const firstHalfAvg = firstHalf.reduce((sum, m) => sum + moodValues[m.mood], 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, m) => sum + moodValues[m.mood], 0) / secondHalf.length;
    const trend = secondHalfAvg > firstHalfAvg ? 'improving' : secondHalfAvg < firstHalfAvg ? 'declining' : 'stable';

    res.json({
      period: days,
      moodDistribution: moodCounts,
      averageIntensity,
      averageSleep: avgSleep.toFixed(1),
      averageExercise: avgExercise.toFixed(0),
      topActivities: Object.entries(activitiesCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
      topTriggers: Object.entries(triggersCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
      trend,
      totalEntries: moods.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get personalized recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const moods = await Mood.find({
      userId: req.user.userId,
      date: { $gte: startDate },
    }).sort({ date: -1 });

    const recommendations = [];

    if (moods.length === 0) {
      recommendations.push('Start tracking your moods to get personalized insights');
      return res.json({ recommendations });
    }

    // Analyze sleep patterns
    const sleepEntries = moods.filter((m) => m.sleepHours);
    if (sleepEntries.length > 0) {
      const averageSleep = sleepEntries.reduce((sum, m) => sum + m.sleepHours, 0) / sleepEntries.length;
      if (averageSleep < 7) {
        recommendations.push('💤 Try to get more sleep. Research shows 7-9 hours improves mood significantly.');
      }
      if (averageSleep > 9) {
        recommendations.push('🌅 Consider reducing sleep duration. Over-sleeping may contribute to mood swings.');
      }
    }

    // Analyze exercise patterns
    const exerciseEntries = moods.filter((m) => m.exerciseMinutes && m.exerciseMinutes > 0);
    if (exerciseEntries.length < moods.length * 0.3) {
      recommendations.push('🏃 Increase physical activity. Exercise releases endorphins and boosts mood.');
    }

    // Analyze triggers
    const triggersCount = {};
    moods.forEach((m) => {
      m.triggers.forEach((trigger) => {
        triggersCount[trigger] = (triggersCount[trigger] || 0) + 1;
      });
    });

    const topTriggers = Object.entries(triggersCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    if (topTriggers.length > 0) {
      recommendations.push(`⚠️ Your top trigger is "${topTriggers[0][0]}". Consider stress management techniques.`);
    }

    // Analyze mood trend
    const moodValues = {
      terrible: 1,
      bad: 2,
      neutral: 3,
      good: 4,
      excellent: 5,
    };

    const recentMoods = moods.slice(0, 7);
    if (recentMoods.length >= 3) {
      const recentAvg = recentMoods.reduce((sum, m) => sum + moodValues[m.mood], 0) / recentMoods.length;
      const olderMoods = moods.slice(7, 14);
      if (olderMoods.length >= 3) {
        const olderAvg = olderMoods.reduce((sum, m) => sum + moodValues[m.mood], 0) / olderMoods.length;
        if (recentAvg < olderAvg - 1) {
          recommendations.push('📉 Your mood has been declining recently. Consider reaching out to a friend or mental health professional.');
        }
      }
    }

    // Analyze social interaction
    const noSocialDays = moods.filter((m) => m.socialInteraction === 'none').length;
    if (noSocialDays > moods.length * 0.5) {
      recommendations.push('👥 You\'ve been isolated lately. Social connection boosts mental health. Consider reaching out!');
    }

    // Analyze positive activities
    const activitiesCount = {};
    moods.forEach((m) => {
      m.activities.forEach((activity) => {
        activitiesCount[activity] = (activitiesCount[activity] || 0) + 1;
      });
    });

    const goodMoodActivities = [];
    moods
      .filter((m) => moodValues[m.mood] >= 4)
      .forEach((m) => {
        m.activities.forEach((activity) => {
          goodMoodActivities.push(activity);
        });
      });

    if (goodMoodActivities.length > 0) {
      const mostPositiveActivity = goodMoodActivities.reduce((acc, activity) => {
        acc[activity] = (acc[activity] || 0) + 1;
        return acc;
      }, {});
      const topActivity = Object.entries(mostPositiveActivity).sort((a, b) => b[1] - a[1])[0];
      if (topActivity) {
        recommendations.push(`✨ You feel great when doing "${topActivity[0]}". Make time for more of this!`);
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ Great job tracking your moods! Keep maintaining healthy habits.');
    }

    res.json({ recommendations, generatedAt: new Date() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get mood data for visualization (last 30 days)
router.get('/chart-data', auth, async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const moods = await Mood.find({
      userId: req.user.userId,
      date: { $gte: startDate },
    }).sort({ date: 1 });

    const moodValues = {
      terrible: 1,
      bad: 2,
      neutral: 3,
      good: 4,
      excellent: 5,
    };

    const chartData = moods.map((m) => ({
      date: m.date.toISOString().split('T')[0],
      value: moodValues[m.mood],
      mood: m.mood,
      intensity: m.intensity,
    }));

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
