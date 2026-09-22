import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Sparkles, Send, Flame, X } from 'lucide-react-native';
import { UserProfile } from '../../types/profile.types';
import {
  Colors,
  Gradients,
  BorderRadius,
  Spacing,
  Typography,
  Shadows,
  HitSlop,
} from '../../theme';
import { CURRENT_USER } from '../../api/mock/mockData';
import { GradientButton } from '../../components/common/GradientButton';

interface MatchCelebrationModalProps {
  visible: boolean;
  partnerProfile: UserProfile | null;
  onSendMessage: (text: string) => void;
  onKeepSwiping: () => void;
}

export const MatchCelebrationModal: React.FC<MatchCelebrationModalProps> = ({
  visible,
  partnerProfile,
  onSendMessage,
  onKeepSwiping,
}) => {
  const [quickMessage, setQuickMessage] = useState('');

  const leftAvatarTranslate = useSharedValue(-220);
  const rightAvatarTranslate = useSharedValue(220);
  const heartScale = useSharedValue(0);
  const textScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (_) {}

      // Trigger avatar collision animation with spring dampening
      leftAvatarTranslate.value = withSpring(0, { damping: 12, stiffness: 90 });
      rightAvatarTranslate.value = withSpring(0, { damping: 12, stiffness: 90 });
      heartScale.value = withDelay(
        250,
        withSequence(
          withSpring(1.35, { damping: 8 }),
          withSpring(1, { damping: 10 })
        )
      );
      textScale.value = withDelay(350, withSpring(1, { damping: 10 }));
    } else {
      leftAvatarTranslate.value = -220;
      rightAvatarTranslate.value = 220;
      heartScale.value = 0;
      textScale.value = 0;
      setQuickMessage('');
    }
  }, [visible]);

  const leftAvatarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: leftAvatarTranslate.value }],
  }));

  const rightAvatarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: rightAvatarTranslate.value }],
  }));

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: textScale.value }],
    opacity: textScale.value,
  }));

  if (!partnerProfile) return null;

  const handleSend = () => {
    const textToSend =
      quickMessage.trim() ||
      `Hey ${partnerProfile.first_name}! Great to match with you 😊`;
    onSendMessage(textToSend);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <BlurView intensity={95} tint="dark" style={styles.blurBackdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.contentContainer}
          >
            {/* Close / Dismiss */}
            <TouchableOpacity
              onPress={onKeepSwiping}
              hitSlop={HitSlop.standard}
              style={styles.dismissButton}
              accessibilityLabel="Close match modal"
              accessibilityRole="button"
            >
              <X size={22} color={Colors.textSecondary} />
            </TouchableOpacity>

            {/* Sparkles / Match Emblem */}
            <View style={styles.matchIconBadge}>
              <Sparkles size={28} color={Colors.brandPrimary} />
            </View>

            {/* Title */}
            <Animated.View style={[styles.titleWrapper, textAnimatedStyle]}>
              <Text style={styles.matchTitle}>IT'S A MATCH!</Text>
              <Text style={styles.matchSubtitle}>
                You and{' '}
                <Text style={{ color: Colors.textPrimary, fontWeight: '700' }}>
                  {partnerProfile.first_name}
                </Text>{' '}
                liked each other.
              </Text>
            </Animated.View>

            {/* Dual Profile Collision Showcase */}
            <View style={styles.avatarShowcase}>
              {/* Left (My avatar) */}
              <Animated.View style={[styles.avatarCircle, styles.myAvatar, leftAvatarStyle]}>
                <Image
                  source={{ uri: CURRENT_USER.photos[0]?.media_url }}
                  style={styles.avatarImage}
                  contentFit="cover"
                  priority="high"
                />
              </Animated.View>

              {/* Heart Badge Center Overlap */}
              <Animated.View style={[styles.heartBadge, heartAnimatedStyle]}>
                <Flame size={26} color={Colors.textPrimary} fill={Colors.textPrimary} />
              </Animated.View>

              {/* Right (Partner avatar) */}
              <Animated.View
                style={[styles.avatarCircle, styles.partnerAvatar, rightAvatarStyle]}
              >
                <Image
                  source={{ uri: partnerProfile.photos[0]?.media_url }}
                  style={styles.avatarImage}
                  contentFit="cover"
                  priority="high"
                />
              </Animated.View>
            </View>

            {/* Quick Message Input Box */}
            <View style={styles.inputContainer}>
              <TextInput
                value={quickMessage}
                onChangeText={setQuickMessage}
                placeholder={`Say something nice to ${partnerProfile.first_name}...`}
                placeholderTextColor={Colors.textMuted}
                style={styles.quickInput}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSend}
                style={styles.sendIconBtn}
                accessibilityLabel="Send quick message"
                accessibilityRole="button"
              >
                <Send size={18} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <GradientButton
              title={`Chat with ${partnerProfile.first_name}`}
              onPress={handleSend}
              colors={Gradients.brand}
              style={styles.chatButton}
            />

            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={HitSlop.standard}
              onPress={onKeepSwiping}
              style={styles.keepSwipingButton}
            >
              <Text style={styles.keepSwipingText}>Keep Swiping</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: Colors.backgroundBackdrop,
  },
  blurBackdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  contentContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  dismissButton: {
    position: 'absolute',
    top: -40,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutralCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  matchIconBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.passBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.passGlow,
  },
  titleWrapper: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  matchTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 2.5,
    textAlign: 'center',
  },
  matchSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
  avatarShowcase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 140,
    width: '100%',
    marginBottom: Spacing.xxl,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: Colors.textPrimary,
    ...Shadows.glowPrimary,
  },
  myAvatar: {
    marginRight: -18,
    zIndex: 1,
  },
  partnerAvatar: {
    marginLeft: -18,
    zIndex: 1,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  heartBadge: {
    position: 'absolute',
    zIndex: 10,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.textPrimary,
    ...Shadows.glowPrimary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: Colors.neutralCard,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: Spacing.lg,
  },
  quickInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  sendIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButton: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  keepSwipingButton: {
    paddingVertical: 10,
  },
  keepSwipingText: {
    ...Typography.subtitle,
    color: Colors.textSecondary,
    fontSize: 15,
  },
});
