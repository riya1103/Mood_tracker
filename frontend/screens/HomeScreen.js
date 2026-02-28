import React, { useState, useEffect, useFocusEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { insightsAPI, moodAPI } from '../services/api';

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [patterns, setPatterns] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const [recResponse, chartResponse, patternsResponse] = await Promise.all([
        insightsAPI.getRecommendations(30),
        insightsAPI.getChartData(),
        insightsAPI.getPatterns(30),
      ]);

      setRecommendations(recResponse.data.recommendations);
      setPatterns(patternsResponse.data);

      // Process chart data
      if (chartResponse.data && chartResponse.data.length > 0) {
        const dates = chartResponse.data.map((d) => new Date(d.date).getDate());
        const values = chartResponse.data.map((d) => d.value);
        setChartData({
          labels: dates,
          datasets: [{ data: values }],
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#FF6B9D" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Mood Dashboard</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
        </View>

        {/* Mood Trend Chart */}
        {chartData && chartData.datasets[0].data.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>30-Day Mood Trend</Text>
            <LineChart
              data={chartData}
              width={360}
              height={220}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#f9f9f9',
                backgroundGradientTo: '#fff',
                color: () => '#FF6B9D',
                strokeWidth: 2,
                useShadowColorFromDataset: false,
              }}
              bezier
              style={styles.chart}
            />
          </View>
        )}

        {/* Mood Statistics */}
        {patterns && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Average Intensity</Text>
                <Text style={styles.statValue}>{patterns.averageIntensity?.toFixed(1)}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Avg Sleep</Text>
                <Text style={styles.statValue}>{patterns.averageSleep}h</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Total Entries</Text>
                <Text style={styles.statValue}>{patterns.totalEntries}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Mood Trend</Text>
                <Text style={[styles.statValue, { color: patterns.trend === 'improving' ? '#4CAF50' : '#FF6B9D' }]}>
                  {patterns.trend}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Top Triggers */}
        {patterns?.topTriggers && patterns.topTriggers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Mood Triggers</Text>
            {patterns.topTriggers.map((trigger, index) => (
              <View key={index} style={styles.triggerItem}>
                <Text style={styles.triggerLabel}>{trigger[0]}</Text>
                <View style={styles.triggerBar}>
                  <View
                    style={[
                      styles.triggerFill,
                      { width: `${(trigger[1] / (patterns.topTriggers[0]?.[1] || 1)) * 100}%` },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            {recommendations.map((rec, index) => (
              <View key={index} style={styles.recommendationCard}>
                <Text style={styles.recommendationText}>{rec}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.logButton}
          onPress={() => navigation.navigate('LogMood')}
        >
          <Text style={styles.logButtonText}>+ Log Your Mood</Text>
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  date: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  section: {
    marginHorizontal: 20,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 8,
    alignSelf: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF6B9D',
  },
  triggerItem: {
    marginBottom: 12,
  },
  triggerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  triggerBar: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  triggerFill: {
    height: '100%',
    backgroundColor: '#FF6B9D',
  },
  recommendationCard: {
    backgroundColor: '#FFF5F7',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B9D',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  recommendationText: {
    fontSize: 14,
    color: '#333',
  },
  logButton: {
    marginHorizontal: 20,
    backgroundColor: '#FF6B9D',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
