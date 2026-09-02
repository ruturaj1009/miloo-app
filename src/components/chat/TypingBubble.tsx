import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Colors, BorderRadius, Spacing, Typography } from '../../theme';

interface TypingBubbleProps {
  partnerName?: string;
}

export const TypingBubble: React.FC<TypingBubbleProps> = ({ partnerName = 'Partner' }) => {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    dot1.value = withRepeat(withTiming(-5, { duration: 400, easing: Easing.ease }), -1, true);
    dot2.value = withDelay(150, withRepeat(withTiming(-5, { duration: 400, easing: Easing.ease }), -1, true));
    dot3.value = withDelay(300, withRepeat(withTiming(-5, { duration: 400, easing: Easing.ease }), -1, true));
  }, []);

  const dotStyle1 = useAnimatedStyle(() => ({ transform: [{ translateY: dot1.value }] }));
  const dotStyle2 = useAnimatedStyle(() => ({ transform: [{ translateY: dot2.value }] }));
  const dotStyle3 = useAnimatedStyle(() => ({ transform: [{ translateY: dot3.value }] }));

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Text style={styles.typingLabel}>{partnerName} is typing</Text>
        <View style={styles.dotsRow}>
          <Animated.View style={[styles.dot, dotStyle1]} />
          <Animated.View style={[styles.dot, dotStyle2]} />
          <Animated.View style={[styles.dot, dotStyle3]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    marginVertical: 4,
    flexDirection: 'row',
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(32, 39, 56, 0.8)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.xl,
    borderBottomLeftRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 8,
  },
  typingLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 13,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 2,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.secondary,
  },
});
