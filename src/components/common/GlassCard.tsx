import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, BorderRadius, Shadows } from '../../theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  tint?: 'dark' | 'light' | 'default';
  glowBorder?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity = 60,
  tint = 'dark',
  glowBorder = false,
}) => {
  return (
    <View style={[styles.outerContainer, glowBorder && styles.glowBorder, style]}>
      <BlurView intensity={intensity} tint={tint} style={styles.blurContainer}>
        <View style={styles.content}>{children}</View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    backgroundColor: Colors.glassBackground,
  },
  glowBorder: {
    borderColor: Colors.glassBorderGlow,
    ...Shadows.glowPrimary,
  },
  blurContainer: {
    width: '100%',
  },
  content: {
    padding: 16,
  },
});
