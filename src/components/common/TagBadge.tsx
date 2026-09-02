import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Spacing, Typography } from '../../theme';

interface TagBadgeProps {
  label: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const TagBadge: React.FC<TagBadgeProps> = ({
  label,
  icon,
  selected = false,
  onPress,
  style,
}) => {
  const Container = onPress ? TouchableOpacity : TouchableOpacity;

  return (
    <Container
      activeOpacity={0.75}
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.badge,
        selected ? styles.badgeSelected : styles.badgeDefault,
        style,
      ]}
    >
      {icon}
      <Text
        style={[
          Typography.tag,
          selected ? styles.textSelected : styles.textDefault,
        ]}
      >
        {label}
      </Text>
    </Container>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    gap: 6,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  badgeDefault: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  badgeSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.25)',
    borderWidth: 1.5,
    borderColor: Colors.secondary,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  textDefault: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  textSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
