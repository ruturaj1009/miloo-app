import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Colors, Spacing, Typography, Shadows } from '../../theme';
import { Image } from 'expo-image';
import { CURRENT_USER } from '../../api/mock/mockData';

export const RadarScanner: React.FC = () => {
  const pulse1 = useSharedValue(0);
  const pulse2 = useSharedValue(0);
  const pulse3 = useSharedValue(0);

  useEffect(() => {
    pulse1.value = withRepeat(
      withTiming(1, { duration: 2400, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );

    setTimeout(() => {
      pulse2.value = withRepeat(
        withTiming(1, { duration: 2400, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );
    }, 800);

    setTimeout(() => {
      pulse3.value = withRepeat(
        withTiming(1, { duration: 2400, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );
    }, 1600);
  }, []);

  const ringStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulse1.value, [0, 1], [0.8, 2.8]) }],
    opacity: interpolate(pulse1.value, [0, 0.5, 1], [0.8, 0.4, 0]),
  }));

  const ringStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulse2.value, [0, 1], [0.8, 2.8]) }],
    opacity: interpolate(pulse2.value, [0, 0.5, 1], [0.8, 0.4, 0]),
  }));

  const ringStyle3 = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulse3.value, [0, 1], [0.8, 2.8]) }],
    opacity: interpolate(pulse3.value, [0, 0.5, 1], [0.8, 0.4, 0]),
  }));

  return (
    <View style={styles.container}>
      <View style={styles.radarWrapper}>
        <Animated.View style={[styles.pulseRing, ringStyle1]} />
        <Animated.View style={[styles.pulseRing, ringStyle2]} />
        <Animated.View style={[styles.pulseRing, ringStyle3]} />

        <View style={styles.centerAvatar}>
          <Image
            source={{ uri: CURRENT_USER.photos[0]?.media_url }}
            style={styles.avatarImage}
            contentFit="cover"
            priority="high"
            cachePolicy="memory-disk"
          />
        </View>
      </View>

      <Text style={[Typography.h3, styles.title]}>Finding people nearby...</Text>
      <Text style={[Typography.bodySecondary, styles.subtitle]}>
        Adjust your distance filters or check back in a few minutes
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  radarWrapper: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
  },
  pulseRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: Colors.brandPrimary,
    backgroundColor: Colors.passBackground,
  },
  centerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: Colors.brandPrimary,
    ...Shadows.glowPrimary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.xs,
    color: Colors.textPrimary,
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 280,
    color: Colors.textSecondary,
  },
});
