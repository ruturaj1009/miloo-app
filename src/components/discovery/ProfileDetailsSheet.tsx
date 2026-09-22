import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  X,
  MapPin,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  Quote,
  Heart,
} from 'lucide-react-native';
import { UserProfile } from '../../types/profile.types';
import {
  Colors,
  Gradients,
  BorderRadius,
  Spacing,
  Typography,
  HitSlop,
  Metrics,
  Shadows,
} from '../../theme';
import { TagBadge } from '../common/TagBadge';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProfileDetailsSheetProps {
  profile: UserProfile | null;
  visible: boolean;
  onClose: () => void;
  onPass?: () => void;
  onLike?: () => void;
}

export const ProfileDetailsSheet: React.FC<ProfileDetailsSheetProps> = ({
  profile,
  visible,
  onClose,
  onPass,
  onLike,
}) => {
  if (!profile) return null;

  const handleAction = (fn?: () => void) => {
    if (fn) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } catch (_) {}
      fn();
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.sheetContainer}>
          <BlurView intensity={90} tint="dark" style={styles.blurWrapper}>
            {/* Header drag handle & close button */}
            <View style={styles.header}>
              <View style={styles.handle} />
              <TouchableOpacity
                onPress={onClose}
                hitSlop={HitSlop.standard}
                style={styles.closeButton}
                accessibilityLabel="Close profile details"
                accessibilityRole="button"
              >
                <X size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Photo Collage Preview */}
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={styles.photoScroll}
              >
                {profile.photos.map((photo, i) => (
                  <View key={photo.media_id || i} style={styles.photoContainer}>
                    <Image
                      source={{ uri: photo.media_url }}
                      style={styles.galleryImage}
                      contentFit="cover"
                      priority="high"
                      cachePolicy="memory-disk"
                    />
                    <LinearGradient
                      colors={Gradients.mediaBottomOverlay}
                      style={styles.photoBottomFade}
                    />
                    <View style={styles.photoIndexPill}>
                      <Text style={styles.photoIndexText}>
                        {i + 1}/{profile.photos.length}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>

              {/* Title & Age */}
              <View style={styles.infoSection}>
                <View style={styles.nameRow}>
                  <Text style={Typography.h1}>
                    {profile.first_name}, {profile.age || 24}
                  </Text>
                  {profile.is_verified && (
                    <CheckCircle2
                      size={24}
                      color={Colors.verifiedBadge}
                      style={styles.badge}
                    />
                  )}
                </View>

                {/* Location */}
                <View style={styles.metaRow}>
                  <MapPin size={16} color={Colors.brandPrimary} />
                  <Text style={styles.metaText}>
                    {profile.location.city || 'Tokyo, Japan'} • {profile.distance_km || 3} km away
                  </Text>
                </View>

                {/* Job & School */}
                {profile.job_title && (
                  <View style={styles.metaRow}>
                    <Briefcase size={16} color={Colors.textSecondary} />
                    <Text style={styles.metaText}>
                      {profile.job_title} {profile.company ? `at ${profile.company}` : ''}
                    </Text>
                  </View>
                )}
                {profile.school && (
                  <View style={styles.metaRow}>
                    <GraduationCap size={16} color={Colors.textSecondary} />
                    <Text style={styles.metaText}>{profile.school}</Text>
                  </View>
                )}

                {/* Bio Section */}
                <View style={styles.bioContainer}>
                  <Text style={styles.sectionHeader}>About Me</Text>
                  <Text style={styles.bioText}>{profile.bio}</Text>
                </View>

                {/* Integrated Dating Prompts per SKILL.md */}
                {profile.prompts && profile.prompts.length > 0 && (
                  <View style={styles.promptsContainer}>
                    <Text style={styles.sectionHeader}>Dating Prompts</Text>
                    {profile.prompts.map((prompt) => (
                      <View key={prompt.id} style={styles.promptCard}>
                        <View style={styles.promptHeader}>
                          <Quote size={16} color={Colors.brandSecondaryLight} />
                          <Text style={styles.promptQuestion}>{prompt.question}</Text>
                        </View>
                        <Text style={styles.promptAnswer}>{prompt.answer}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Segmented Tag Pills for Interest Badges per SKILL.md */}
                {profile.interest_tags && profile.interest_tags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    <Text style={styles.sectionHeader}>Passions & Lifestyle</Text>
                    <View style={styles.tagsGrid}>
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
                          selected={idx === 0}
                        />
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Floating In-Sheet Pass & Like Action Dock */}
            {(onPass || onLike) && (
              <View style={styles.sheetActionDock}>
                {onPass && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    hitSlop={HitSlop.standard}
                    onPress={() => handleAction(onPass)}
                    style={[styles.sheetActionBtn, styles.sheetPassBtn]}
                    accessibilityLabel="Pass"
                    accessibilityRole="button"
                  >
                    <X size={28} color={Colors.pass} strokeWidth={3} />
                  </TouchableOpacity>
                )}
                {onLike && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    hitSlop={HitSlop.standard}
                    onPress={() => handleAction(onLike)}
                    style={[styles.sheetActionBtn, styles.sheetLikeBtn]}
                    accessibilityLabel="Like"
                    accessibilityRole="button"
                  >
                    <Heart size={28} color={Colors.brandPrimary} fill={Colors.brandPrimary} />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </BlurView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: Colors.backgroundBackdrop,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    height: '86%',
    borderTopLeftRadius: BorderRadius.sheet,
    borderTopRightRadius: BorderRadius.sheet,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderColor: Colors.glassBorder,
    backgroundColor: Colors.backgroundPrimary,
  },
  blurWrapper: {
    flex: 1,
    backgroundColor: 'rgba(15, 17, 21, 0.94)',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 14,
    position: 'relative',
  },
  handle: {
    width: 48,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.neutralCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  photoScroll: {
    height: 340,
    width: '100%',
  },
  photoContainer: {
    width: SCREEN_WIDTH - 24,
    height: 340,
    marginHorizontal: 12,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  photoBottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  photoIndexPill: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  photoIndexText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  infoSection: {
    padding: Spacing.lg,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  badge: {
    marginLeft: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  metaText: {
    ...Typography.bodySecondary,
    color: Colors.textSecondary,
  },
  bioContainer: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  sectionHeader: {
    ...Typography.h3,
    fontSize: 18,
    marginBottom: Spacing.sm,
    color: Colors.textPrimary,
  },
  bioText: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  promptsContainer: {
    marginTop: Spacing.lg,
  },
  promptCard: {
    backgroundColor: Colors.promptBoxBackground,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.promptBoxBorder,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  promptQuestion: {
    ...Typography.subtitle,
    fontSize: 14,
    color: Colors.brandSecondaryLight,
    fontWeight: '700',
  },
  promptAnswer: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
  },
  tagsContainer: {
    marginTop: Spacing.lg,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.xs,
  },
  sheetActionDock: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 28,
  },
  sheetActionBtn: {
    width: Metrics.touchTargetMin + 8, // 64dp touch target
    height: Metrics.touchTargetMin + 8,
    borderRadius: (Metrics.touchTargetMin + 8) / 2,
    backgroundColor: Colors.glassBackgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    ...Shadows.medium,
  },
  sheetPassBtn: {
    borderColor: Colors.passGlow,
  },
  sheetLikeBtn: {
    borderColor: Colors.passGlow,
  },
});
