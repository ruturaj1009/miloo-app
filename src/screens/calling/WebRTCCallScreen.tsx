import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { Wifi, PhoneCall } from 'lucide-react-native';
import { Colors, BorderRadius, Spacing, Typography } from '../../theme';
import { DraggablePiP } from '../../components/calling/DraggablePiP';
import { CallControlBar } from '../../components/calling/CallControlBar';
import { useCallStore } from '../../store/useCallStore';
import { CURRENT_USER } from '../../api/mock/mockData';

interface WebRTCCallScreenProps {
  route: {
    params: {
      matchId: string;
      partnerId: string;
      partnerName: string;
      partnerAvatar: string;
      callType: 'AUDIO' | 'VIDEO';
      isIncoming?: boolean;
    };
  };
  navigation: any;
}

export const WebRTCCallScreen: React.FC<WebRTCCallScreenProps> = ({ route, navigation }) => {
  const { partnerName, partnerAvatar, callType } = route.params;
  const {
    activeSession,
    endCall,
    toggleAudio,
    toggleVideo,
    flipCamera,
    toggleSpeaker,
    incrementDuration,
  } = useCallStore();

  const isConnected = activeSession?.status === 'CONNECTED';
  const duration = activeSession?.duration_seconds || 0;

  // Format MM:SS
  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  useEffect(() => {
    let interval: any;
    if (isConnected) {
      interval = setInterval(() => {
        incrementDuration();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const handleEndCall = () => {
    endCall();
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent />

      {/* Fullscreen Remote Video Feed or Audio Avatar Background */}
      {callType === 'VIDEO' && isConnected && !activeSession?.is_video_muted ? (
        <Image
          source={{ uri: partnerAvatar }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.audioFallback]}>
          <Image
            source={{ uri: partnerAvatar }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            blurRadius={40}
          />
          <View style={styles.audioCenterBadge}>
            <Image
              source={{ uri: partnerAvatar }}
              style={styles.centerAvatar}
              contentFit="cover"
            />
            <Text style={[Typography.h2, styles.centerName]}>{partnerName}</Text>
            <Text style={styles.callStateLabel}>
              {isConnected ? 'In Call' : 'Connecting HD Audio...'}
            </Text>
          </View>
        </View>
      )}

      {/* Dark overlay gradient */}
      <View style={styles.vignetteOverlay} />

      <SafeAreaView style={styles.safeArea}>
        {/* Top Header Card */}
        <View style={styles.headerWrapper}>
          <BlurView intensity={60} tint="dark" style={styles.headerCard}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.headerName}>{partnerName}</Text>
                <Text style={styles.timerText}>
                  {isConnected ? formatTimer(duration) : 'Ringing...'}
                </Text>
              </View>

              <View style={styles.hdBadge}>
                <Wifi size={14} color={Colors.online} style={{ marginRight: 4 }} />
                <Text style={styles.hdText}>HD</Text>
              </View>
            </View>
          </BlurView>
        </View>

        {/* Draggable Self View PiP */}
        {callType === 'VIDEO' && (
          <DraggablePiP
            avatarUri={CURRENT_USER.photos[0]?.media_url}
            isVideoMuted={activeSession?.is_video_muted}
          />
        )}

        {/* Bottom Call Controls */}
        <View style={styles.bottomControls}>
          <CallControlBar
            isAudioMuted={activeSession?.is_audio_muted || false}
            isVideoMuted={activeSession?.is_video_muted || false}
            isSpeakerOn={activeSession?.is_speaker_on ?? true}
            onToggleAudio={toggleAudio}
            onToggleVideo={toggleVideo}
            onFlipCamera={flipCamera}
            onToggleSpeaker={toggleSpeaker}
            onEndCall={handleEndCall}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  vignetteOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10, 13, 20, 0.25)',
  },
  audioFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundPrimary,
  },
  audioCenterBadge: {
    alignItems: 'center',
  },
  centerAvatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginBottom: 16,
  },
  centerName: {
    color: '#FFFFFF',
    marginBottom: 4,
  },
  callStateLabel: {
    ...Typography.bodySecondary,
    color: Colors.secondary,
  },
  headerWrapper: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 16,
    alignItems: 'center',
  },
  headerCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(20, 24, 35, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerName: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  timerText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  hdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  hdText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  bottomControls: {
    width: '100%',
  },
});
