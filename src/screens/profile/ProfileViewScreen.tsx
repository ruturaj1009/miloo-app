import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Edit3, CheckCircle2, MapPin, Briefcase, GraduationCap, ShieldCheck } from 'lucide-react-native';
import { Colors, BorderRadius, Spacing, Typography, Shadows } from '../../theme';
import { TagBadge } from '../../components/common/TagBadge';
import { useProfileStore } from '../../store/useProfileStore';

interface ProfileViewScreenProps {
  navigation: any;
}

export const ProfileViewScreen: React.FC<ProfileViewScreenProps> = ({ navigation }) => {
  const { profile } = useProfileStore();
  const mainPhoto = profile.photos[0]?.media_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Hero Photo Card */}
        <View style={styles.heroCard}>
          <Image source={{ uri: mainPhoto }} style={styles.heroImage} contentFit="cover" />

          {/* Gradient Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(10, 13, 20, 0.85)']}
            style={styles.gradientOverlay}
          >
            <View style={styles.heroTextRow}>
              <View>
                <View style={styles.nameRow}>
                  <Text style={Typography.h1}>
                    {profile.first_name}, {profile.age || 26}
                  </Text>
                  {profile.is_verified && (
                    <CheckCircle2 size={24} color={Colors.verifiedBadge} style={{ marginLeft: 8 }} />
                  )}
                </View>
                <View style={styles.locationRow}>
                  <MapPin size={14} color={Colors.primary} />
                  <Text style={styles.locationText}>
                    {profile.location.city || 'Tokyo, Japan'}
                  </Text>
                </View>
              </View>

              {/* Edit Profile Floating CTA */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('ProfileBuilder')}
                style={styles.editBtn}
              >
                <Edit3 size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Profile Strength Card */}
        <View style={styles.strengthCard}>
          <View style={styles.strengthHeader}>
            <ShieldCheck size={20} color={Colors.secondary} />
            <Text style={styles.strengthTitle}>Profile Strength: 85%</Text>
          </View>
          <View style={styles.strengthProgressBar}>
            <LinearGradient
              colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.strengthFill, { width: '85%' }]}
            />
          </View>
          <Text style={styles.strengthHint}>
            Add 2 more photos and verify your ID to boost match potential!
          </Text>
        </View>

        {/* Bio Card */}
        <View style={styles.infoCard}>
          <Text style={styles.cardSectionHeader}>About Me</Text>
          <Text style={styles.bioText}>{profile.bio}</Text>

          {profile.job_title && (
            <View style={styles.metaItem}>
              <Briefcase size={16} color={Colors.textSecondary} />
              <Text style={styles.metaItemText}>
                {profile.job_title} {profile.company ? `at ${profile.company}` : ''}
              </Text>
            </View>
          )}

          {profile.school && (
            <View style={styles.metaItem}>
              <GraduationCap size={16} color={Colors.textSecondary} />
              <Text style={styles.metaItemText}>{profile.school}</Text>
            </View>
          )}
        </View>

        {/* Passions & Tags */}
        <View style={styles.infoCard}>
          <Text style={styles.cardSectionHeader}>Passions & Interests</Text>
          <View style={styles.tagsContainer}>
            {profile.interest_tags.map((tag, idx) => (
              <TagBadge key={idx} label={tag} selected={idx % 2 === 0} />
            ))}
          </View>
        </View>

        {/* Photo Gallery Grid */}
        <View style={styles.infoCard}>
          <View style={styles.galleryHeaderRow}>
            <Text style={styles.cardSectionHeader}>Media Gallery ({profile.photos.length})</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ProfileBuilder')}>
              <Text style={styles.manageText}>Manage</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.photoGrid}>
            {profile.photos.map((p, i) => (
              <Image
                key={p.media_id || i}
                source={{ uri: p.media_url }}
                style={styles.gridThumb}
                contentFit="cover"
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  heroCard: {
    width: '100%',
    height: 380,
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    position: 'relative',
    marginBottom: Spacing.lg,
    ...Shadows.medium,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.xxl,
  },
  heroTextRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  locationText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  editBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.glowPrimary,
  },
  strengthCard: {
    backgroundColor: 'rgba(26, 31, 46, 0.75)',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  strengthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  strengthTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  strengthProgressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    marginBottom: 8,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 3,
  },
  strengthHint: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 12,
  },
  infoCard: {
    backgroundColor: 'rgba(26, 31, 46, 0.75)',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardSectionHeader: {
    ...Typography.h3,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: Spacing.xs,
  },
  bioText: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  metaItemText: {
    ...Typography.bodySecondary,
    color: Colors.textSecondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.xs,
  },
  galleryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  manageText: {
    ...Typography.caption,
    color: Colors.secondary,
    fontWeight: '700',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: Spacing.xs,
  },
  gridThumb: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: BorderRadius.md,
  },
});
