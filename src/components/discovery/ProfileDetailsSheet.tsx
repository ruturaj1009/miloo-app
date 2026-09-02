import React from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { X, MapPin, Briefcase, GraduationCap, CheckCircle2 } from 'lucide-react-native';
import { UserProfile } from '../../types/profile.types';
import { Colors, BorderRadius, Spacing, Typography } from '../../theme';
import { TagBadge } from '../common/TagBadge';

interface ProfileDetailsSheetProps {
  profile: UserProfile | null;
  visible: boolean;
  onClose: () => void;
}

export const ProfileDetailsSheet: React.FC<ProfileDetailsSheetProps> = ({
  profile,
  visible,
  onClose,
}) => {
  if (!profile) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.sheetContainer}>
          <BlurView intensity={80} tint="dark" style={styles.blurWrapper}>
            {/* Header / Close button */}
            <View style={styles.header}>
              <View style={styles.handle} />
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={22} color={Colors.textSecondary} />
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
                  <Image
                    key={photo.media_id || i}
                    source={{ uri: photo.media_url }}
                    style={styles.galleryImage}
                    contentFit="cover"
                  />
                ))}
              </ScrollView>

              {/* Title & Age */}
              <View style={styles.infoSection}>
                <View style={styles.nameRow}>
                  <Text style={Typography.h1}>
                    {profile.first_name}, {profile.age || 24}
                  </Text>
                  {profile.is_verified && (
                    <CheckCircle2 size={24} color={Colors.verifiedBadge} style={styles.badge} />
                  )}
                </View>

                {/* Location */}
                <View style={styles.metaRow}>
                  <MapPin size={16} color={Colors.primary} />
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

                {/* Bio */}
                <View style={styles.bioContainer}>
                  <Text style={styles.sectionHeader}>About Me</Text>
                  <Text style={styles.bioText}>{profile.bio}</Text>
                </View>

                {/* Interest Tags */}
                {profile.interest_tags && profile.interest_tags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    <Text style={styles.sectionHeader}>Passions & Interests</Text>
                    <View style={styles.tagsGrid}>
                      {profile.interest_tags.map((tag, idx) => (
                        <TagBadge key={idx} label={tag} selected={idx % 2 === 0} />
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          </BlurView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    height: '85%',
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  blurWrapper: {
    flex: 1,
    backgroundColor: 'rgba(10, 13, 20, 0.95)',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  handle: {
    width: 44,
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
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  photoScroll: {
    height: 320,
    width: '100%',
  },
  galleryImage: {
    width: 380,
    height: 320,
    marginRight: 10,
    borderRadius: BorderRadius.lg,
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
  tagsContainer: {
    marginTop: Spacing.lg,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.xs,
  },
});
