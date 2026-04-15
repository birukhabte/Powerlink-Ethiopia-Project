import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {
  CheckCircle,
  XCircle,
  FileText,
  User,
  Info,
  ChevronRight,
  Eye,
} from 'lucide-react-native';

const MOCK_DOCS = [
  { id: '1', customer: 'Yilkal G.', type: 'New Connection', docs: ['ID Copy', 'Site Plan'], status: 'pending', time: '1 hour ago' },
  { id: '2', customer: 'Dawit L.', type: 'Meter Separation', docs: ['Property Proof'], status: 'pending', time: '3 hours ago' },
];

export default function DocValidation() {
  const [selected, setSelected] = useState<any>(null);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} onPress={() => setSelected(item)}>
      <View style={styles.cardInfo}>
        <Text style={styles.custName}>{item.customer}</Text>
        <Text style={styles.reqType}>{item.type}</Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
      <View style={styles.docsCount}>
        <FileText size={16} color="#6b7280" />
        <Text style={styles.countText}>{item.docs.length} files</Text>
      </View>
      <ChevronRight size={20} color="#9ca3af" />
    </TouchableOpacity>
  );

  if (selected) {
    return (
      <ScrollView style={styles.detailContainer}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setSelected(null)}>
          <Text style={styles.backBtnText}>← Back to List</Text>
        </TouchableOpacity>

        <View style={styles.detailHeader}>
          <Text style={styles.detailTitle}>Validate Documents</Text>
          <Text style={styles.detailSub}>{selected.customer} - {selected.type}</Text>
        </View>

        <View style={styles.docList}>
          {selected.docs.map((doc: string, idx: number) => (
            <View key={idx} style={styles.docItem}>
              <View style={styles.docIcon}>
                <FileText size={24} color="#2563eb" />
              </View>
              <View style={styles.docInfo}>
                <Text style={styles.docName}>{doc}</Text>
                <Text style={styles.docMeta}>Image/JPEG • 1.2 MB</Text>
              </View>
              <TouchableOpacity style={styles.viewBtn}>
                <Eye size={20} color="#2563eb" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.guidelines}>
          <View style={styles.guideHeader}>
            <Info size={16} color="#1e40af" />
            <Text style={styles.guideTitle}>Validation Guidelines</Text>
          </View>
          <Text style={styles.guideText}>• Check expiry dates on all IDs.</Text>
          <Text style={styles.guideText}>• Ensure property deeds match the address.</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.rejectBtn}>
            <XCircle size={20} color="#fff" />
            <Text style={styles.btnText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.approveBtn}>
            <CheckCircle size={20} color="#fff" />
            <Text style={styles.btnText}>Approve</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_DOCS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.headerTitle}>Pending Validations</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  listContent: {
    padding: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  cardInfo: {
    flex: 1,
  },
  custName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  reqType: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  timeText: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 4,
  },
  docsCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 12,
  },
  countText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  detailContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  backBtn: {
    marginBottom: 20,
  },
  backBtnText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  detailHeader: {
    marginBottom: 24,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  detailSub: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  docList: {
    gap: 12,
    marginBottom: 32,
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  docIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  docInfo: {
    flex: 1,
  },
  docName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  docMeta: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  viewBtn: {
    padding: 8,
  },
  guidelines: {
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 32,
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  guideText: {
    fontSize: 13,
    color: '#1e40af',
    opacity: 0.8,
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  approveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
