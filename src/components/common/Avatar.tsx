import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients, Shadows } from '../../theme';
import { Check } from 'lucide-react-native';

interface AvatarProps {
  uri: string;
  size?: number;
  isOnline?: boolean;
  isVerified?: boolean;
  style?: ViewStyle;
  borderGlow?: boolean;
  gradientRing?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  size = 56,
  isOnline,
  isVerified,
  style,
  borderGlow = false,
  gradientRing = false,
}) => {
  const badgeSize = Math.max(14, Math.floor(size * 0.26));
  const ringPadding = gradientRing ? 2.5 : 0;
  const innerSize = size - ringPadding * 2;

  const content = (
    <View
      style={[
        styles.imageWrapper,
        { width: innerSize, height: innerSize, borderRadius: innerSize / 2 },
        borderGlow && styles.glow,
        gradientRing && styles.noBorder,
      ]}
    >
      <Image
        source={{ uri }}
        style={{ width: innerSize, height: innerSize, borderRadius: innerSize / 2 }}
        contentFit="cover"
        transition={250}
        priority="high"
        cachePolicy="memory-disk"
      />
    </View>
  );

  return (
    <View style={[{ width: size, height: size }, styles.container, style]}>
      {gradientRing ? (
        <LinearGradient
          colors={Gradients.brand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientRing, { width: size, height: size, borderRadius: size / 2 }]}
        >
          {content}
        </LinearGradient>
      ) : (
        content
      )}

      {isOnline !== undefined && (
        <View
          style={[
            styles.statusDot,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              backgroundColor: isOnline ? Colors.online : Colors.offline,
              bottom: 0,
              right: 0,
            },
          ]}
        />
      )}

      {isVerified && (
        <View
          style={[
            styles.verifiedBadge,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              top: 0,
              right: 0,
            },
          ]}
        >
          <Check size={badgeSize * 0.65} color={Colors.textPrimary} strokeWidth={3.5} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientRing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.glassBorder,
    backgroundColor: Colors.backgroundCard,
  },
  noBorder: {
    borderWidth: 0,
  },
  glow: {
    borderColor: Colors.brandPrimary,
    ...Shadows.glowPrimary,
  },
  statusDot: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: Colors.backgroundPrimary,
  },
  verifiedBadge: {
    position: 'absolute',
    backgroundColor: Colors.verifiedBadge,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.backgroundPrimary,
  },
});
