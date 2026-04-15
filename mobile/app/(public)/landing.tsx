import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {
  Zap,
  Shield,
  Clock,
  ChevronRight,
  Bell,
  ArrowRight,
  Monitor,
  Phone,
  Headphones,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function LandingPage() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <LinearGradient
          colors={['#0802A3', '#004aad']}
          style={styles.heroGradient}
        >
          <View style={styles.heroContent}>
            <Zap size={48} color="#00B7B5" style={styles.heroIcon} />
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.brandTitle}>PowerLink Ethiopia</Text>
            <Text style={styles.tagline}>
              Powering homes, businesses, and communities for a brighter Ethiopia.
            </Text>

            <View style={styles.heroButtons}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.push('/(auth)/login' as any)}
              >
                <Text style={styles.primaryButtonText}>Sign In</Text>
                <ArrowRight size={18} color="#0802A3" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => router.push('/(auth)/register' as any)}
              >
                <Text style={styles.secondaryButtonText}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Announcements Preview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.titleRow}>
            <Bell size={20} color="#0802A3" />
            <Text style={styles.sectionTitle}>Announcements</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.viewMore}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.announcementCard}>
          <Text style={styles.announcementLabel}>NOTICE</Text>
          <Text style={styles.announcementTitle}>Planned Maintenance: Addis Ababa</Text>
          <Text style={styles.announcementDate}>April 10, 2026</Text>
          <Text style={styles.announcementText}>
            Scheduled maintenance will occur in Bole and Casanchis areas between 9:00 AM and 1:00 PM.
          </Text>
        </View>
      </View>

      {/* Services Section */}
      <View style={[styles.section, styles.greyBg]}>
        <Text style={styles.sectionTitleCenter}>Our Services</Text>
        <Text style={styles.sectionSubCenter}>Innovative solutions for your energy needs.</Text>
        
        <View style={styles.featuresGrid}>
          <View style={styles.featureItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#eff6ff' }]}>
              <Monitor size={24} color="#2563eb" />
            </View>
            <Text style={styles.featureTitle}>Reporting</Text>
            <Text style={styles.featureBody}>Easy outage and damage reporting in seconds.</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#f5f3ff' }]}>
              <Clock size={24} color="#7c3aed" />
            </View>
            <Text style={styles.featureTitle}>Real-time Tracking</Text>
            <Text style={styles.featureBody}>Follow repair progress live from your phone.</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#ecfdf5' }]}>
              <Shield size={24} color="#059669" />
            </View>
            <Text style={styles.featureTitle}>Secure Payments</Text>
            <Text style={styles.featureBody}>Pay bills and manage subscriptions safely.</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#fff7ed' }]}>
              <Headphones size={24} color="#ea580c" />
            </View>
            <Text style={styles.featureTitle}>24/7 Support</Text>
            <Text style={styles.featureBody}>Round-the-clock assistance for all issues.</Text>
          </View>
        </View>
      </View>

      {/* About Brief */}
      <View style={styles.section}>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>Why PowerLink?</Text>
          <Text style={styles.aboutText}>
            We bridge the gap between power providers and consumers, ensuring 
            transparency and efficient service delivery for every citizen.
          </Text>
          <TouchableOpacity style={styles.textButton}>
            <Text style={styles.textButtonLabel}>Learn more about our mission</Text>
            <ChevronRight size={16} color="#0802A3" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerBrand}>PowerLink Ethiopia</Text>
        <Text style={styles.footerTagline}>Building a brighter future together.</Text>
        <View style={styles.divider} />
        <Text style={styles.copyright}>© 2026 PowerLink Ethiopia • All rights reserved</Text>
        <Text style={styles.supportEmail}>support@powerlink.et</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroSection: {
    height: 440,
  },
  heroGradient: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  heroContent: {
    alignItems: 'center',
    textAlign: 'center',
  },
  heroIcon: {
    marginBottom: 20,
  },
  welcomeText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  brandTitle: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '900',
    marginTop: 8,
  },
  tagline: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
    maxWidth: 300,
  },
  heroButtons: {
    flexDirection: 'row',
    marginTop: 40,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#0802A3',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    padding: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  sectionTitleCenter: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  sectionSubCenter: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  viewMore: {
    color: '#0802A3',
    fontWeight: '600',
  },
  announcementCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  announcementLabel: {
    color: '#ef4444',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
  },
  announcementDate: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  announcementText: {
    fontSize: 14,
    color: '#475569',
    marginTop: 12,
    lineHeight: 20,
  },
  greyBg: {
    backgroundColor: '#f8fafc',
    paddingVertical: 40,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  featureItem: {
    width: (width - 64) / 2,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  featureBody: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    lineHeight: 18,
  },
  aboutCard: {
    backgroundColor: '#0802A3',
    borderRadius: 30,
    padding: 30,
  },
  aboutTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  aboutText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    marginTop: 12,
    lineHeight: 22,
  },
  textButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  textButtonLabel: {
    color: '#0802A3',
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 4,
  },
  footer: {
    backgroundColor: '#111827',
    padding: 40,
    alignItems: 'center',
  },
  footerBrand: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  footerTagline: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#1f2937',
    width: '100%',
    marginVertical: 24,
  },
  copyright: {
    color: '#4b5563',
    fontSize: 12,
  },
  supportEmail: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 4,
  },
});
