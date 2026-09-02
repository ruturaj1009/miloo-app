import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Colors, BorderRadius } from '../../theme';
import { Check } from 'lucide-react-native';

interface AvatarProps {
  uri: string;
  size?: number;
  isOnline?: boolean;
  isVerified?: boolean;
  style?: ViewStyle;
  borderGlow?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  size = 56,
  isOnline,
  isVerified,
  style,
  borderGlow = false,
}) => {
  const badgeSize = Math.max(14, Math.floor(size * 0.26));

  return (
    <View style={[{ width: size, height: size }, styles.container, style]}>
      <View
        style={[
          styles.imageWrapper,
          { width: size, height: size, borderRadius: size / 2 },
          borderGlow && styles.glow,
        ]}
      >
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          contentFit="cover"
          transition={300}
        />
      </View>

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
          <Check size={badgeSize * 0.65} color="#FFFFFF" strokeWidth={3.5} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  imageWrapper: {
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.glassBorder,
    backgroundColor: Colors.backgroundCard,
  },
  glow: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
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
