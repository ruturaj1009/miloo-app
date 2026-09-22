import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Mic, MicOff, Video, VideoOff, SwitchCamera, Volume2, PhoneOff } from 'lucide-react-native';
import { Colors, BorderRadius, Shadows, Metrics, HitSlop } from '../../theme';

interface CallControlBarProps {
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  isSpeakerOn: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onFlipCamera: () => void;
  onToggleSpeaker: () => void;
  onEndCall: () => void;
}

export const CallControlBar: React.FC<CallControlBarProps> = ({
  isAudioMuted,
  isVideoMuted,
  isSpeakerOn,
  onToggleAudio,
  onToggleVideo,
  onFlipCamera,
  onToggleSpeaker,
  onEndCall,
}) => {
  const trigger = (fn: () => void) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (_) {}
    fn();
  };

  return (
    <View style={styles.container}>
      <BlurView intensity={80} tint="dark" style={styles.blurBar}>
        {/* Mic Toggle (56x56dp) */}
        <TouchableOpacity
          activeOpacity={0.75}
          hitSlop={HitSlop.small}
          onPress={() => trigger(onToggleAudio)}
          style={[styles.button, isAudioMuted && styles.buttonActive]}
          accessibilityLabel={isAudioMuted ? 'Unmute microphone' : 'Mute microphone'}
          accessibilityRole="button"
        >
          {isAudioMuted ? (
            <MicOff size={22} color={Colors.pass} />
          ) : (
            <Mic size={22} color={Colors.textPrimary} />
          )}
        </TouchableOpacity>

        {/* Video Toggle (56x56dp) */}
        <TouchableOpacity
          activeOpacity={0.75}
          hitSlop={HitSlop.small}
          onPress={() => trigger(onToggleVideo)}
          style={[styles.button, isVideoMuted && styles.buttonActive]}
          accessibilityLabel={isVideoMuted ? 'Turn on camera' : 'Turn off camera'}
          accessibilityRole="button"
        >
          {isVideoMuted ? (
            <VideoOff size={22} color={Colors.pass} />
          ) : (
            <Video size={22} color={Colors.textPrimary} />
          )}
        </TouchableOpacity>

        {/* Flip Camera (56x56dp) */}
        <TouchableOpacity
          activeOpacity={0.75}
          hitSlop={HitSlop.small}
          onPress={() => trigger(onFlipCamera)}
          style={styles.button}
          accessibilityLabel="Flip camera"
          accessibilityRole="button"
        >
          <SwitchCamera size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        {/* Speaker Toggle (56x56dp) */}
        <TouchableOpacity
          activeOpacity={0.75}
          hitSlop={HitSlop.small}
          onPress={() => trigger(onToggleSpeaker)}
          style={[styles.button, isSpeakerOn && styles.buttonSpeakerActive]}
          accessibilityLabel={isSpeakerOn ? 'Turn off speaker' : 'Turn on speaker'}
          accessibilityRole="button"
        >
          <Volume2 size={22} color={isSpeakerOn ? Colors.brandPrimary : Colors.textPrimary} />
        </TouchableOpacity>

        {/* End Call (Red, 60x60dp) */}
        <TouchableOpacity
          activeOpacity={0.75}
          hitSlop={HitSlop.small}
          onPress={() => trigger(onEndCall)}
          style={[styles.button, styles.endCallButton]}
          accessibilityLabel="End call"
          accessibilityRole="button"
        >
          <PhoneOff size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 28,
    alignItems: 'center',
    width: '100%',
  },
  blurBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.glassBackgroundDark,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    width: '100%',
    maxWidth: 400,
    ...Shadows.medium,
  },
  button: {
    width: Metrics.touchTargetMin, // 56dp per SKILL.md
    height: Metrics.touchTargetMin,
    borderRadius: Metrics.touchTargetMin / 2,
    backgroundColor: Colors.neutralCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  buttonActive: {
    backgroundColor: Colors.passBackground,
    borderColor: Colors.pass,
  },
  buttonSpeakerActive: {
    backgroundColor: 'rgba(255, 68, 88, 0.2)',
    borderColor: Colors.brandPrimary,
  },
  endCallButton: {
    width: Metrics.touchTargetMin + 4,
    height: Metrics.touchTargetMin + 4,
    borderRadius: (Metrics.touchTargetMin + 4) / 2,
    backgroundColor: Colors.pass,
    borderColor: Colors.pass,
    ...Shadows.glowPrimary,
  },
});
