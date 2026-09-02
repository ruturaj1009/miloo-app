import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { RotateCcw, X, Star, Heart, Zap } from 'lucide-react-native';
import { Colors, BorderRadius, Shadows } from '../../theme';

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
  const triggerAction = (fn: () => void, feedback: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium) => {
    try {
      Haptics.impactAsync(feedback);
    } catch (_) {}
    fn();
  };

  return (
    <View style={styles.outerContainer}>
      <BlurView intensity={50} tint="dark" style={styles.blurContainer}>
        {/* 1. Undo Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={!canUndo}
          onPress={() => triggerAction(onUndo, Haptics.ImpactFeedbackStyle.Light)}
          style={[styles.smallButton, !canUndo && styles.disabledButton]}
        >
          <RotateCcw size={22} color={Colors.undo} strokeWidth={2.4} />
        </TouchableOpacity>

        {/* 2. Pass / Dislike (X) */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => triggerAction(onPass, Haptics.ImpactFeedbackStyle.Heavy)}
          style={[styles.mainButton, styles.passButton]}
        >
          <X size={32} color={Colors.pass} strokeWidth={2.8} />
        </TouchableOpacity>

        {/* 3. Superlike (Cyan Star) */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => triggerAction(onSuperlike, Haptics.ImpactFeedbackStyle.Heavy)}
          style={[styles.smallButton, styles.superlikeButton]}
        >
          <Star size={24} color={Colors.superlike} fill={Colors.superlike} strokeWidth={1} />
        </TouchableOpacity>

        {/* 4. Like (Emerald / Rose Heart) */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => triggerAction(onLike, Haptics.ImpactFeedbackStyle.Heavy)}
          style={[styles.mainButton, styles.likeButton]}
        >
          <Heart size={32} color={Colors.primary} fill={Colors.primary} strokeWidth={1} />
        </TouchableOpacity>

        {/* 5. Boost (Lightning) */}
        <TouchableOpacity
          activeOpacity={0.7}
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
    paddingHorizontal: 20,
    paddingBottom: 16,
    alignItems: 'center',
  },
  blurContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: BorderRadius.xxl,
    backgroundColor: 'rgba(20, 24, 35, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    width: '100%',
    maxWidth: 380,
    ...Shadows.medium,
  },
  smallButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  mainButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  passButton: {
    borderColor: 'rgba(239, 68, 68, 0.4)',
    shadowColor: Colors.pass,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  likeButton: {
    borderColor: 'rgba(255, 45, 85, 0.45)',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  superlikeButton: {
    borderColor: 'rgba(6, 182, 212, 0.4)',
    shadowColor: Colors.superlike,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  boostButton: {
    borderColor: 'rgba(168, 85, 247, 0.4)',
  },
  disabledButton: {
    opacity: 0.35,
  },
});
