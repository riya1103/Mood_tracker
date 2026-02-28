import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { moodAPI } from '../services/api';

const MOODS = ['terrible', 'bad', 'neutral', 'good', 'excellent'];
const MOOD_EMOJIS = {
  terrible: '😢',
  bad: '😞',
  neutral: '😐',
  good: '😊',
  excellent: '🤩',
};

const ACTIVITIES = ['Work', 'Exercise', 'Meditation', 'Social', 'Gaming', 'Reading', 'Cooking', 'Sleeping'];
const TRIGGERS = ['Work Stress', 'Family Issues', 'Health Concerns', 'Financial Worries', 'Sleep Deprivation', 'Social Anxiety', 'Loneliness', 'Other'];

export default function LogMoodScreen() {
  const [selectedMood, setSelectedMood] = useState('neutral');
  const [intensity, setIntensity] = useState(5);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [notes, setNotes] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [exerciseMinutes, setExerciseMinutes] = useState('');
  const [socialInteraction, setSocialInteraction] = useState('moderate');
  const [loading, setLoading] = useState(false);

  const toggleActivity = (activity) => {
    setSelectedActivities((prev) =>
      prev.includes(activity) ? prev.filter((a) => a !== activity) : [...prev, activity]
    );
  };

  const toggleTrigger = (trigger) => {
    setSelectedTriggers((prev) =>
      prev.includes(trigger) ? prev.filter((t) => t !== trigger) : [...prev, trigger]
    );
  };

  const handleLogMood = async () => {
    setLoading(true);
    try {
      const moodData = {
        mood: selectedMood,
        intensity: parseInt(intensity),
        activities: selectedActivities,
        notes,
        triggers: selectedTriggers,
        sleepHours: sleepHours ? parseFloat(sleepHours) : null,
        exerciseMinutes: exerciseMinutes ? parseFloat(exerciseMinutes) : null,
        socialInteraction,
        date: new Date(),
      };

      await moodAPI.logMood(moodData);
      Alert.alert('Success', 'Your mood has been logged!', [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setSelectedMood('neutral');
            setIntensity(5);
            setSelectedActivities([]);
            setSelectedTriggers([]);
            setNotes('');
            setSleepHours('');
            setExerciseMinutes('');
            setSocialInteraction('moderate');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to log mood. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>How are you feeling?</Text>
        </View>

        {/* Mood Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Mood</Text>
          <View style={styles.moodGrid}>
            {MOODS.map((mood) => (
              <TouchableOpacity
                key={mood}
                style={[styles.moodButton, selectedMood === mood && styles.moodButtonActive]}
                onPress={() => setSelectedMood(mood)}
              >
                <Text style={styles.moodEmoji}>{MOOD_EMOJIS[mood]}</Text>
                <Text style={[styles.moodLabel, selectedMood === mood && styles.moodLabelActive]}>
                  {mood}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Intensity Slider */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Intensity: {intensity}</Text>
          <View style={styles.sliderContainer}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <TouchableOpacity
                key={num}
                style={[styles.sliderButton, intensity === num && styles.sliderButtonActive]}
                onPress={() => setIntensity(num)}
              >
                <Text style={[styles.sliderText, intensity === num && styles.sliderTextActive]}>
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Activities</Text>
          <View style={styles.tagGrid}>
            {ACTIVITIES.map((activity) => (
              <TouchableOpacity
                key={activity}
                style={[styles.tag, selectedActivities.includes(activity) && styles.tagActive]}
                onPress={() => toggleActivity(activity)}
              >
                <Text style={[styles.tagText, selectedActivities.includes(activity) && styles.tagTextActive]}>
                  {activity}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Triggers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mood Triggers</Text>
          <View style={styles.tagGrid}>
            {TRIGGERS.map((trigger) => (
              <TouchableOpacity
                key={trigger}
                style={[styles.tag, selectedTriggers.includes(trigger) && styles.tagActive]}
                onPress={() => toggleTrigger(trigger)}
              >
                <Text style={[styles.tagText, selectedTriggers.includes(trigger) && styles.tagTextActive]}>
                  {trigger}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sleep Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sleep Last Night (hours)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 8"
            keyboardType="decimal-pad"
            value={sleepHours}
            onChangeText={setSleepHours}
          />
        </View>

        {/* Exercise Minutes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercise Today (minutes)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 30"
            keyboardType="number-pad"
            value={exerciseMinutes}
            onChangeText={setExerciseMinutes}
          />
        </View>

        {/* Social Interaction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Interaction</Text>
          <View style={styles.socialGrid}>
            {['none', 'minimal', 'moderate', 'extensive'].map((level) => (
              <TouchableOpacity
                key={level}
                style={[styles.socialButton, socialInteraction === level && styles.socialButtonActive]}
                onPress={() => setSocialInteraction(level)}
              >
                <Text style={[styles.socialText, socialInteraction === level && styles.socialTextActive]}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Write anything you'd like to remember..."
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleLogMood}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Log Mood</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginHorizontal: 20,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  moodGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    flex: 1,
    marginHorizontal: 4,
  },
  moodButtonActive: {
    backgroundColor: '#FFE6F0',
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  moodLabelActive: {
    color: '#FF6B9D',
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  sliderButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  sliderButtonActive: {
    backgroundColor: '#FF6B9D',
  },
  sliderText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  sliderTextActive: {
    color: '#fff',
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#eee',
  },
  tagActive: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  tagText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  tagTextActive: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  socialGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  socialButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  socialButtonActive: {
    backgroundColor: '#FF6B9D',
  },
  socialText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  socialTextActive: {
    color: '#fff',
  },
  submitButton: {
    marginHorizontal: 20,
    backgroundColor: '#FF6B9D',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
