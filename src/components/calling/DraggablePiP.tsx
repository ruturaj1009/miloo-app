import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { BorderRadius, Colors, Shadows } from '../../theme';
import { VideoOff } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PIP_WIDTH = 105;
const PIP_HEIGHT = 150;
const PADDING = 16;

interface DraggablePiPProps {
  avatarUri: string;
  isVideoMuted?: boolean;
}

export const DraggablePiP: React.FC<DraggablePiPProps> = ({
  avatarUri,
  isVideoMuted = false,
}) => {
  const translateX = useSharedValue(SCREEN_WIDTH - PIP_WIDTH - PADDING);
  const translateY = useSharedValue(80);

  const contextX = useSharedValue(0);
  const contextY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      contextX.value = translateX.value;
      contextY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateX.value = contextX.value + e.translationX;
      translateY.value = contextY.value + e.translationY;
    })
    .onEnd(() => {
      // Snap to nearest horizontal edge (left or right)
      const snapX =
        translateX.value < (SCREEN_WIDTH - PIP_WIDTH) / 2
          ? PADDING
          : SCREEN_WIDTH - PIP_WIDTH - PADDING;

      // Bound within vertical screen height
      const boundedY = Math.min(
        Math.max(translateY.value, 70),
        SCREEN_HEIGHT - PIP_HEIGHT - 130
      );

      translateX.value = withSpring(snapX, { damping: 14 });
      translateY.value = withSpring(boundedY, { damping: 14 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.pipContainer, animatedStyle]}>
        {isVideoMuted ? (
          <View style={styles.mutedPlaceholder}>
            <VideoOff size={24} color={Colors.textMuted} />
          </View>
        ) : (
          <Image
            source={{ uri: avatarUri }}
            style={styles.pipImage}
            contentFit="cover"
            priority="high"
            cachePolicy="memory-disk"
          />
        )}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  pipContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: PIP_WIDTH,
    height: PIP_HEIGHT,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.glassBorderStrong,
    backgroundColor: Colors.backgroundCard,
    zIndex: 100,
    ...Shadows.medium,
  },
  pipImage: {
    width: '100%',
    height: '100%',
  },
  mutedPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
