import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { RotateCcw, X, Star, Heart, Zap } from 'lucide-react-native';
import { Colors, BorderRadius, Shadows, HitSlop, Metrics } from '../../theme';

interface ActionDockProps {
  onUndo: () => void;
  onPass: () => void;
  onSuperlike: () => void;
  onLike: () => void;
  onBoost: () => void;
  canUndo?: boolean;
}

export const ActionDock: React.FC<ActionDockProps> = ({
  onUndo,
  onPass,
  onSuperlike,
  onLike,
  onBoost,
  canUndo = true,
}) => {
  const triggerAction = (
    fn: () => void,
    feedback: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium
  ) => {
    try {
      Haptics.impactAsync(feedback);
    } catch (_) {}
    fn();
  };

  return (
    <View style={styles.outerContainer}>
      <BlurView intensity={70} tint="dark" style={styles.blurContainer}>
        {/* 1. Undo Button (56x56dp minimum touch target) */}
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={!canUndo}
          hitSlop={HitSlop.standard}
          accessibilityLabel="Undo last swipe"
          accessibilityRole="button"
          onPress={() => triggerAction(onUndo, Haptics.ImpactFeedbackStyle.Light)}
          style={[styles.smallButton, !canUndo && styles.disabledButton]}
        >
          <RotateCcw size={22} color={Colors.undo} strokeWidth={2.4} />
        </TouchableOpacity>

        {/* 2. Pass / Dislike Button (64x64dp) */}
        <TouchableOpacity
          activeOpacity={0.75}
          hitSlop={HitSlop.standard}
          accessibilityLabel="Pass on profile"
          accessibilityRole="button"
          onPress={() => triggerAction(onPass, Haptics.ImpactFeedbackStyle.Heavy)}
          style={[styles.mainButton, styles.passButton]}
        >
          <X size={32} color={Colors.pass} strokeWidth={3} />
        </TouchableOpacity>

        {/* 3. Superlike Button (56x56dp) */}
        <TouchableOpacity
          activeOpacity={0.75}
          hitSlop={HitSlop.standard}
          accessibilityLabel="Super like profile"
          accessibilityRole="button"
          onPress={() => triggerAction(onSuperlike, Haptics.ImpactFeedbackStyle.Heavy)}
          style={[styles.smallButton, styles.superlikeButton]}
        >
          <Star size={24} color={Colors.superlike} fill={Colors.superlike} strokeWidth={1} />
        </TouchableOpacity>

        {/* 4. Like Button (64x64dp) */}
        <TouchableOpacity
          activeOpacity={0.75}
          hitSlop={HitSlop.standard}
          accessibilityLabel="Like profile"
          accessibilityRole="button"
          onPress={() => triggerAction(onLike, Haptics.ImpactFeedbackStyle.Heavy)}
          style={[styles.mainButton, styles.likeButton]}
        >
          <Heart size={32} color={Colors.brandPrimary} fill={Colors.brandPrimary} strokeWidth={1} />
        </TouchableOpacity>

        {/* 5. Boost Button (56x56dp) */}
        <TouchableOpacity
          activeOpacity={0.7}
          hitSlop={HitSlop.standard}
          accessibilityLabel="Boost profile visibility"
          accessibilityRole="button"
          onPress={() => triggerAction(onBoost, Haptics.ImpactFeedbackStyle.Medium)}
          style={[styles.smallButton, styles.boostButton]}
        >
          <Zap size={22} color={Colors.boost} fill={Colors.boost} strokeWidth={1} />
        </TouchableOpacity>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
    width: '100%',
  },
  blurContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.glassBackground,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    width: '100%',
    maxWidth: 390,
    ...Shadows.medium,
  },
  smallButton: {
    width: Metrics.touchTargetMin, // 56dp per SKILL.md
    height: Metrics.touchTargetMin,
    borderRadius: Metrics.touchTargetMin / 2,
    backgroundColor: Colors.neutralCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  mainButton: {
    width: 64, // 64dp
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.neutralCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  passButton: {
    borderColor: Colors.passGlow,
    shadowColor: Colors.pass,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  likeButton: {
    borderColor: Colors.passGlow,
    shadowColor: Colors.brandPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  superlikeButton: {
    borderColor: Colors.superlikeGlow,
    shadowColor: Colors.superlike,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  boostButton: {
    borderColor: Colors.boostGlow,
  },
  disabledButton: {
    opacity: 0.35,
  },
});
