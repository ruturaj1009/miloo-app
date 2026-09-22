import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Edit3,
  CheckCircle2,
  MapPin,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Quote,
} from 'lucide-react-native';
import {
  Colors,
  Gradients,
  BorderRadius,
  Spacing,
  Typography,
  Shadows,
  HitSlop,
} from '../../theme';
import { TagBadge } from '../../components/common/TagBadge';
import { useProfileStore } from '../../store/useProfileStore';

interface ProfileViewScreenProps {
  navigation: any;
}

export const ProfileViewScreen: React.FC<ProfileViewScreenProps> = ({ navigation }) => {
  const { profile } = useProfileStore();
  const mainPhoto =
    profile.photos[0]?.media_url ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.backgroundPrimary} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Hero Photo Card with bottom 40% dark gradient underlay */}
        <View style={styles.heroCard}>
          <Image
            source={{ uri: mainPhoto }}
            style={styles.heroImage}
            contentFit="cover"
            priority="high"
          />

          <LinearGradient
            colors={Gradients.mediaBottomOverlay}
            style={styles.gradientOverlay}
          >
            <View style={styles.heroTextRow}>
              <View>
                <View style={styles.nameRow}>
                  <Text style={Typography.h1}>
                    {profile.first_name}, {profile.age || 26}
                  </Text>
                  {profile.is_verified && (
                    <CheckCircle2
                      size={24}
                      color={Colors.verifiedBadge}
                      style={{ marginLeft: 8 }}
                    />
                  )}
                </View>
                <View style={styles.locationRow}>
                  <MapPin size={14} color={Colors.brandPrimary} />
                  <Text style={styles.locationText}>
                    {profile.location.city || 'Tokyo, Japan'}
                  </Text>
                </View>
              </View>

              {/* Edit Profile Floating CTA */}
              <TouchableOpacity
                activeOpacity={0.8}
                hitSlop={HitSlop.standard}
                onPress={() => navigation.navigate('ProfileBuilder')}
                style={styles.editBtn}
                accessibilityLabel="Edit profile"
                accessibilityRole="button"
              >
                <Edit3 size={18} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Profile Strength Card with Gradient Bar */}
        <View style={styles.strengthCard}>
          <View style={styles.strengthHeader}>
            <ShieldCheck size={20} color={Colors.brandSecondaryLight} />
            <Text style={styles.strengthTitle}>Profile Strength: 90%</Text>
          </View>
          <View style={styles.strengthProgressBar}>
            <LinearGradient
              colors={Gradients.brand}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.strengthFill, { width: '90%' }]}
            />
          </View>
          <Text style={styles.strengthHint}>
            Great profile! Add 1 more photo to achieve maximum match potential.
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

        {/* Dating Prompts Section per SKILL.md */}
        {profile.prompts && profile.prompts.length > 0 && (
          <View style={styles.infoCard}>
            <Text style={styles.cardSectionHeader}>My Dating Prompts</Text>
            {profile.prompts.map((prompt) => (
              <View key={prompt.id} style={styles.promptCard}>
                <View style={styles.promptHeader}>
                  <Quote size={15} color={Colors.brandSecondaryLight} />
                  <Text style={styles.promptQuestion}>{prompt.question}</Text>
                </View>
                <Text style={styles.promptAnswer}>{prompt.answer}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Passions & Lifestyle */}
        <View style={styles.infoCard}>
          <Text style={styles.cardSectionHeader}>Passions & Lifestyle</Text>
          <View style={styles.tagsContainer}>
            {profile.interest_tags.map((tag, idx) => (
              <TagBadge
                key={idx}
                label={tag}
                category={
                  idx % 3 === 0
                    ? 'Hobbies'
                    : idx % 3 === 1
                    ? 'Music'
                    : 'Values'
                }
                selected={idx % 2 === 0}
              />
            ))}
          </View>
        </View>

        {/* Photo Gallery Grid */}
        <View style={styles.infoCard}>
          <View style={styles.galleryHeaderRow}>
            <Text style={styles.cardSectionHeader}>
              Media Gallery ({profile.photos.length})
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('ProfileBuilder')}
              hitSlop={HitSlop.small}
            >
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
                priority="high"
                cachePolicy="memory-disk"
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
    paddingBottom: 90,
  },
  heroCard: {
    width: '100%',
    height: 400,
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: Colors.neutralCardBorder,
    position: 'relative',
    marginBottom: Spacing.lg,
    backgroundColor: Colors.backgroundCard,
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
    height: '42%',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
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
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.glowPrimary,
  },
  strengthCard: {
    backgroundColor: Colors.glassBackground,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.3)',
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
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  strengthProgressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.neutralCard,
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
    backgroundColor: Colors.glassBackground,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardSectionHeader: {
    ...Typography.h3,
    fontSize: 16,
    color: Colors.textPrimary,
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
  promptCard: {
    backgroundColor: Colors.promptBoxBackground,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.promptBoxBorder,
    padding: Spacing.md,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  promptQuestion: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.brandSecondaryLight,
  },
  promptAnswer: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
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
    color: Colors.brandSecondaryLight,
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
