import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { BarChart3, Download, PieChart, FileText, Calendar, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function AdminReport() {
  const StatRow = ({ label, value, color }: any) => (
    <View style={styles.statRow}>
      <View style={styles.statLabelBox}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>System Analytics</Text>
        <TouchableOpacity style={styles.datePicker}>
          <Calendar size={16} color="#4b5563" />
          <Text style={styles.dateText}>Last 30 Days</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.chartPlaceholder}>
          <BarChart3 size={48} color="#2563eb" opacity={0.5} />
          <Text style={styles.chartTitle}>Monthly Performance Trend</Text>
          <Text style={styles.chartSub}>Average response time: 42 mins</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.statsCard}>
          <StatRow label="Resolution Rate" value="94.2%" color="#10b981" />
          <StatRow label="Average Restore Time" value="1.4h" color="#2563eb" />
          <StatRow label="System Uptime" value="99.9%" color="#10b981" />
          <StatRow label="Customer Satisfaction" value="4.8/5" color="#f59e0b" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Export Options</Text>
        <View style={styles.exportGrid}>
          <TouchableOpacity style={styles.exportCard}>
            <View style={[styles.exportIcon, { backgroundColor: '#fee2e2' }]}>
              <BarChart3 size={24} color="#ef4444" />
            </View>
            <Text style={styles.exportTitle}>PDF Report</Text>
            <Download size={16} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.exportCard}>
            <View style={[styles.exportIcon, { backgroundColor: '#eff6ff' }]}>
              <FileText size={24} color="#2563eb" />
            </View>
            <Text style={styles.exportTitle}>CSV Data</Text>
            <Download size={16} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: '#f9fafb',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  chartSub: {
    fontSize: 12,
    color: '#6b7280',
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f2f2f2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
  },
  statLabelBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  exportGrid: {
    gap: 12,
  },
  exportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 16,
  },
  exportIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#374151',
  },
});
