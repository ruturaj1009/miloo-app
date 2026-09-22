import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { CheckCircle2, MapPin, Info, Star } from 'lucide-react-native';
import { UserProfile } from '../../types/profile.types';
import { Colors, Gradients, BorderRadius, Spacing, Typography, Shadows, HitSlop } from '../../theme';
import { TagBadge } from '../common/TagBadge';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.35;
const UP_SWIPE_THRESHOLD = -SCREEN_HEIGHT * 0.18;

interface SwipeableCardProps {
  profile: UserProfile;
  index: number;
  isFirst: boolean;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp: () => void;
  onOpenDetails: (profile: UserProfile) => void;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  profile,
  index,
  isFirst,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onOpenDetails,
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const photos =
    profile.photos && profile.photos.length > 0
      ? profile.photos
      : [
          {
            media_id: '1',
            user_id: profile.user_id,
            r2_object_key: '',
            media_url:
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
            display_order: 0,
            created_at: '',
          },
        ];

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const hasTriggeredThresholdHaptic = useSharedValue(false);

  const triggerHaptic = (style: Haptics.ImpactFeedbackStyle) => {
    try {
      Haptics.impactAsync(style);
    } catch (_) {}
  };

  const handleNextPhoto = () => {
    if (activePhotoIndex < photos.length - 1) {
      triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
      setActivePhotoIndex(activePhotoIndex + 1);
    }
  };

  const handlePrevPhoto = () => {
    if (activePhotoIndex > 0) {
      triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
      setActivePhotoIndex(activePhotoIndex - 1);
    }
  };

  const panGesture = Gesture.Pan()
    .enabled(isFirst)
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;

      // Haptic threshold crossing
      const absX = Math.abs(e.translationX);
      if (absX > SWIPE_THRESHOLD * 0.5 && !hasTriggeredThresholdHaptic.value) {
        hasTriggeredThresholdHaptic.value = true;
        runOnJS(triggerHaptic)(Haptics.ImpactFeedbackStyle.Light);
      } else if (absX <= SWIPE_THRESHOLD * 0.5 && hasTriggeredThresholdHaptic.value) {
        hasTriggeredThresholdHaptic.value = false;
      }
    })
    .onEnd((e) => {
      hasTriggeredThresholdHaptic.value = false;

      if (e.translationX > SWIPE_THRESHOLD) {
        runOnJS(triggerHaptic)(Haptics.ImpactFeedbackStyle.Medium);
        translateX.value = withSpring(SCREEN_WIDTH * 1.5, { velocity: e.velocityX });
        runOnJS(onSwipeRight)();
      } else if (e.translationX < -SWIPE_THRESHOLD) {
        runOnJS(triggerHaptic)(Haptics.ImpactFeedbackStyle.Medium);
        translateX.value = withSpring(-SCREEN_WIDTH * 1.5, { velocity: e.velocityX });
        runOnJS(onSwipeLeft)();
      } else if (e.translationY < UP_SWIPE_THRESHOLD) {
        runOnJS(triggerHaptic)(Haptics.ImpactFeedbackStyle.Heavy);
        translateY.value = withSpring(-SCREEN_HEIGHT * 1.5, { velocity: e.velocityY });
        runOnJS(onSwipeUp)();
      } else {
        // Spring physics damping: 15, stiffness: 120 per SKILL.md
        translateX.value = withSpring(0, { damping: 15, stiffness: 120 });
        translateY.value = withSpring(0, { damping: 15, stiffness: 120 });
      }
    });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    if (!isFirst) {
      const scale = interpolate(index, [1, 2], [0.94, 0.88]);
      const translateYOffset = interpolate(index, [1, 2], [14, 28]);
      return {
        transform: [{ scale }, { translateY: translateYOffset }],
        opacity: interpolate(index, [1, 2], [0.85, 0.6]),
      };
    }

    // Card Rotation Formula per SKILL.md:
    // Translation: [-width, 0, width] -> Rotation: [-12deg, 0deg, 12deg]
    const rotateZ = `${interpolate(
      translateX.value,
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      [-12, 0, 12]
    )}deg`;

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: rotateZ },
      ],
    };
  });

  // Dynamic stamp styles per SKILL.md
  const likeStampStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [20, SWIPE_THRESHOLD], [0, 1]),
    transform: [
      { scale: interpolate(translateX.value, [20, SWIPE_THRESHOLD], [0.8, 1.1]) },
      { rotate: '-14deg' },
    ],
  }));

  const nopeStampStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-20, -SWIPE_THRESHOLD], [0, 1]),
    transform: [
      { scale: interpolate(translateX.value, [-20, -SWIPE_THRESHOLD], [0.8, 1.1]) },
      { rotate: '14deg' },
    ],
  }));

  const superlikeStampStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [-20, UP_SWIPE_THRESHOLD], [0, 1]),
    transform: [
      { scale: interpolate(translateY.value, [-20, UP_SWIPE_THRESHOLD], [0.8, 1.2]) },
    ],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.cardContainer, cardAnimatedStyle]}>
        {/* Profile Image with high priority and memory-disk cache */}
        <Image
          source={{ uri: photos[activePhotoIndex].media_url }}
          style={styles.cardImage}
          contentFit="cover"
          transition={250}
          priority="high"
          cachePolicy="memory-disk"
        />

        {/* Photo Story Segment Bars (Instagram Story Style) */}
        {photos.length > 1 && (
          <View style={styles.segmentContainer}>
            {photos.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.segmentBar,
                  i === activePhotoIndex ? styles.segmentBarActive : styles.segmentBarInactive,
                ]}
              />
            ))}
          </View>
        )}

        {/* Left (35%) / Right (65%) Tap Zones for Photo Cycling */}
        <View style={styles.tapZonesContainer}>
          <Pressable style={styles.leftTapZone} onPress={handlePrevPhoto} />
          <Pressable style={styles.rightTapZone} onPress={handleNextPhoto} />
        </View>

        {/* Dynamic Stamp Overlays */}
        <Animated.View style={[styles.stamp, styles.likeStamp, likeStampStyle]}>
          <Text style={styles.likeStampText}>LIKE</Text>
        </Animated.View>

        <Animated.View style={[styles.stamp, styles.nopeStamp, nopeStampStyle]}>
          <Text style={styles.nopeStampText}>NOPE</Text>
        </Animated.View>

        <Animated.View style={[styles.stamp, styles.superlikeStamp, superlikeStampStyle]}>
          <Star size={24} color={Colors.textPrimary} fill={Colors.textPrimary} style={{ marginRight: 6 }} />
          <Text style={styles.superlikeStampText}>SUPER LIKE</Text>
        </Animated.View>

        {/* Bottom 40% Dark Gradient Overlay for WCAG AA text legibility */}
        <LinearGradient
          colors={Gradients.mediaBottomOverlay}
          locations={[0, 1]}
          style={styles.cardInfoGradient}
        >
          {/* Header Row: Name, Age, Verified, Info Button */}
          <View style={styles.nameRow}>
            <View style={styles.nameWrapper}>
              <Text style={Typography.h1}>
                {profile.first_name}{' '}
                <Text style={styles.ageText}>{profile.age || 24}</Text>
              </Text>
              {profile.is_verified && (
                <CheckCircle2 size={22} color={Colors.verifiedBadge} style={styles.verifiedIcon} />
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={HitSlop.standard}
              onPress={() => onOpenDetails(profile)}
              style={styles.infoButton}
            >
              <Info size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Location Badge */}
          <View style={styles.locationPill}>
            <MapPin size={14} color={Colors.brandPrimary} />
            <Text style={styles.locationText}>
              {profile.location.city || 'Tokyo'} • {profile.distance_km || 3} km away
            </Text>
          </View>

          {/* Bio Snippet */}
          <Text style={styles.bioSnippet} numberOfLines={2}>
            {profile.bio}
          </Text>

          {/* Interest Tags */}
          {profile.interest_tags && (
            <View style={styles.tagsRow}>
              {profile.interest_tags.slice(0, 4).map((tag, idx) => (
                <TagBadge key={idx} label={tag} />
              ))}
            </View>
          )}
        </LinearGradient>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH - 20,
    height: SCREEN_HEIGHT * 0.77, // ~77% viewport height per SKILL.md
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: Colors.neutralCardBorder,
    backgroundColor: Colors.backgroundCard,
    ...Shadows.medium,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  segmentContainer: {
    position: 'absolute',
    top: 14,
    left: 12,
    right: 12,
    flexDirection: 'row',
    gap: 6,
    zIndex: 10,
  },
  segmentBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  segmentBarActive: {
    backgroundColor: Colors.textPrimary,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  segmentBarInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  tapZonesContainer: {
    position: 'absolute',
    top: 30,
    bottom: 180,
    left: 0,
    right: 0,
    flexDirection: 'row',
    zIndex: 5,
  },
  leftTapZone: {
    flex: 0.35,
  },
  rightTapZone: {
    flex: 0.65,
  },
  stamp: {
    position: 'absolute',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.md,
    borderWidth: 3,
    zIndex: 20,
  },
  likeStamp: {
    top: 40,
    left: 24,
    borderColor: Colors.like,
    backgroundColor: Colors.likeBackground,
  },
  likeStampText: {
    color: Colors.like,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
  },
  nopeStamp: {
    top: 40,
    right: 24,
    borderColor: Colors.pass,
    backgroundColor: Colors.passBackground,
  },
  nopeStampText: {
    color: Colors.pass,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
  },
  superlikeStamp: {
    bottom: 220,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.superlike,
    backgroundColor: Colors.superlikeBackground,
  },
  superlikeStampText: {
    color: Colors.superlike,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
  },
  cardInfoGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '42%',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    zIndex: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nameWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ageText: {
    fontWeight: '400',
    fontSize: 28,
    color: Colors.textPrimary,
  },
  verifiedIcon: {
    marginLeft: 8,
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutralCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(15, 17, 21, 0.75)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.glassBorderSubtle,
    marginTop: 4,
    marginBottom: 8,
    gap: 6,
  },
  locationText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  bioSnippet: {
    ...Typography.bodySecondary,
    color: '#E2E8F0',
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
  },
});
