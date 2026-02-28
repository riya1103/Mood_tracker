import React, { useState, useEffect, useFocusEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { insightsAPI } from '../services/api';

const screenWidth = Dimensions.get('window').width;

export default function InsightsScreen() {
  const [loading, setLoading] = useState(true);
  const [patterns, setPatterns] = useState(null);
  const [period, setPeriod] = useState(30);

  useFocusEffect(
    React.useCallback(() => {
      loadPatterns();
    }, [period])
  );

  const loadPatterns = async () => {
    setLoading(true);
    try {
      const response = await insightsAPI.getPatterns(period);
      setPatterns(response.data);
    } catch (error) {
      console.error('Error loading patterns:', error);
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

  const chartData = patterns?.moodDistribution
    ? {
        labels: Object.keys(patterns.moodDistribution).map((m) => m.charAt(0).toUpperCase()),
        datasets: [
          {
            data: Object.values(patterns.moodDistribution),
          },
        ],
      }
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Insights & Patterns</Text>
        </View>

        {/* Period Selection */}
        <View style={styles.periodSelector}>
          {[7, 30, 90].map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodButton, period === p && styles.periodButtonActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
                {p}d
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {patterns && (
          <>
            {/* Mood Distribution Chart */}
            {chartData && chartData.datasets[0].data.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mood Distribution</Text>
                <BarChart
                  data={chartData}
                  width={screenWidth - 40}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#f9f9f9',
                    backgroundGradientTo: '#fff',
                    color: () => '#FF6B9D',
                    barPercentage: 0.8,
                  }}
                  style={styles.chart}
                />
              </View>
            )}

            {/* Key Metrics */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Metrics</Text>
              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Average Intensity</Text>
                  <Text style={styles.metricValue}>{patterns.averageIntensity?.toFixed(1)}</Text>
                  <Text style={styles.metricDesc}>out of 10</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Average Sleep</Text>
                  <Text style={styles.metricValue}>{patterns.averageSleep}</Text>
                  <Text style={styles.metricDesc}>hours/night</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Avg Exercise</Text>
                  <Text style={styles.metricValue}>{patterns.averageExercise}</Text>
                  <Text style={styles.metricDesc}>minutes/day</Text>
                </View>
              </View>
            </View>

            {/* Mood Trend */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Overall Trend</Text>
              <View style={styles.trendCard}>
                <Text style={[styles.trendValue, { color: patterns.trend === 'improving' ? '#4CAF50' : patterns.trend === 'declining' ? '#FF6B9D' : '#999' }]}>
                  {patterns.trend?.charAt(0).toUpperCase() + patterns.trend?.slice(1)}
                </Text>
                <Text style={styles.trendLabel}>
                  {patterns.trend === 'improving'
                    ? '📈 Your mood has been getting better'
                    : patterns.trend === 'declining'
                    ? '📉 Your mood has been declining'
                    : '→ Your mood is stable'}
                </Text>
              </View>
            </View>

            {/* Top Activities */}
            {patterns.topActivities && patterns.topActivities.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Top Activities</Text>
                {patterns.topActivities.map((activity, index) => (
                  <View key={index} style={styles.itemRow}>
                    <Text style={styles.itemRank}>{index + 1}</Text>
                    <Text style={styles.itemName}>{activity[0]}</Text>
                    <Text style={styles.itemCount}>{activity[1]} times</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Top Triggers */}
            {patterns.topTriggers && patterns.topTriggers.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Top Mood Triggers</Text>
                {patterns.topTriggers.map((trigger, index) => (
                  <View key={index} style={styles.itemRow}>
                    <Text style={styles.itemRank}>⚠️</Text>
                    <Text style={styles.itemName}>{trigger[0]}</Text>
                    <Text style={styles.itemCount}>{trigger[1]} times</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Summary</Text>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryText}>
                  Based on <Text style={styles.strongText}>{patterns.totalEntries}</Text> mood entries in the last <Text style={styles.strongText}>{period} days</Text>, you've been
                  experiencing <Text style={styles.strongText}>{patterns.trend}</Text> mood patterns.
                </Text>
                {patterns.topTriggers?.length > 0 && (
                  <Text style={styles.summaryText}>
                    <Text style={styles.strongText}>{patterns.topTriggers[0][0]}</Text> is your primary mood trigger. Consider developing strategies to manage this.
                  </Text>
                )}
              </View>
            </View>
          </>
        )}

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
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginHorizontal: 20,
    marginVertical: 12,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  periodButtonActive: {
    backgroundColor: '#FF6B9D',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  periodTextActive: {
    color: '#fff',
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
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B9D',
  },
  metricDesc: {
    fontSize: 10,
    color: '#ccc',
    marginTop: 2,
  },
  trendCard: {
    backgroundColor: '#FFF5F7',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  trendValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  trendLabel: {
    fontSize: 14,
    color: '#666',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemRank: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B9D',
    marginRight: 12,
    minWidth: 20,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  itemCount: {
    fontSize: 12,
    color: '#999',
  },
  summaryCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  summaryText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  strongText: {
    fontWeight: '600',
    color: '#FF6B9D',
  },
});
