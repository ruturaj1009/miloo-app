import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Mic, MicOff, Video, VideoOff, SwitchCamera, Volume2, PhoneOff } from 'lucide-react-native';
import { Colors, BorderRadius, Shadows } from '../../theme';

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
      <BlurView intensity={70} tint="dark" style={styles.blurBar}>
        {/* Mic Toggle */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => trigger(onToggleAudio)}
          style={[styles.button, isAudioMuted && styles.buttonActive]}
        >
          {isAudioMuted ? (
            <MicOff size={22} color={Colors.pass} />
          ) : (
            <Mic size={22} color="#FFFFFF" />
          )}
        </TouchableOpacity>

        {/* Video Toggle */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => trigger(onToggleVideo)}
          style={[styles.button, isVideoMuted && styles.buttonActive]}
        >
          {isVideoMuted ? (
            <VideoOff size={22} color={Colors.pass} />
          ) : (
            <Video size={22} color="#FFFFFF" />
          )}
        </TouchableOpacity>

        {/* Flip Camera */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => trigger(onFlipCamera)}
          style={styles.button}
        >
          <SwitchCamera size={22} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Speaker Toggle */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => trigger(onToggleSpeaker)}
          style={[styles.button, isSpeakerOn && styles.buttonSpeakerActive]}
        >
          <Volume2 size={22} color={isSpeakerOn ? Colors.primary : '#FFFFFF'} />
        </TouchableOpacity>

        {/* End Call (Red) */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => trigger(onEndCall)}
          style={[styles.button, styles.endCallButton]}
        >
          <PhoneOff size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
  blurBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: BorderRadius.xxl,
    backgroundColor: 'rgba(20, 24, 35, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    width: '100%',
    maxWidth: 380,
    ...Shadows.medium,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  buttonActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: Colors.pass,
  },
  buttonSpeakerActive: {
    backgroundColor: 'rgba(255, 45, 85, 0.2)',
    borderColor: Colors.primary,
  },
  endCallButton: {
    backgroundColor: Colors.pass,
    borderColor: Colors.pass,
    shadowColor: Colors.pass,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
});
