import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, Gradients, BorderRadius, Typography, Metrics, Shadows } from '../../theme';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  colors?: readonly [string, string, ...string[]];
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  colors = Gradients.brand,
  style,
  textStyle,
  icon,
  disabled = false,
  loading = false,
}) => {
  const handlePress = () => {
    if (disabled || loading) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (_) {}
    onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[styles.container, style, disabled && styles.disabled]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color={Colors.textPrimary} size="small" />
        ) : (
          <>
            {icon}
            <Text style={[Typography.button, styles.text, textStyle]}>{title}</Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    minHeight: Metrics.touchTargetMin,
    ...Shadows.glowPrimary,
  },
  gradient: {
    minHeight: Metrics.touchTargetMin,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  text: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.45,
    shadowOpacity: 0,
  },
});
