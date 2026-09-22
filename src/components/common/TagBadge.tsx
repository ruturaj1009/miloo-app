import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Spacing, Typography, HitSlop, Shadows } from '../../theme';

interface TagBadgeProps {
  label: string;
  category?: 'Hobbies' | 'Zodiac' | 'Music' | 'Values' | 'Lifestyle';
  icon?: React.ReactNode;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const TagBadge: React.FC<TagBadgeProps> = ({
  label,
  category,
  icon,
  selected = false,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={!onPress}
      hitSlop={onPress ? HitSlop.small : undefined}
      style={[
        styles.badge,
        selected ? styles.badgeSelected : styles.badgeDefault,
        style,
      ]}
    >
      {icon}
      {category && (
        <Text style={[styles.categoryLabel, selected && styles.categorySelected]}>
          {category}:
        </Text>
      )}
      <Text
        style={[
          Typography.tag,
          selected ? styles.textSelected : styles.textDefault,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.full,
    gap: 6,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  badgeDefault: {
    backgroundColor: Colors.neutralCard,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  badgeSelected: {
    backgroundColor: 'rgba(124, 58, 237, 0.22)',
    borderWidth: 1.5,
    borderColor: Colors.brandSecondary,
    ...Shadows.glowSecondary,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categorySelected: {
    color: Colors.brandSecondaryLight,
  },
  textDefault: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  textSelected: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
});
