import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { SlidersHorizontal, Flame, Sparkles } from 'lucide-react-native';
import { Colors, Spacing, Typography } from '../../theme';
import { SwipeableCard } from '../../components/discovery/SwipeableCard';
import { ActionDock } from '../../components/discovery/ActionDock';
import { ProfileDetailsSheet } from '../../components/discovery/ProfileDetailsSheet';
import { RadarScanner } from '../../components/common/RadarScanner';
import { MatchCelebrationModal } from './MatchCelebrationModal';
import { useDiscoveryStore } from '../../store/useDiscoveryStore';
import { useMatchStore } from '../../store/useMatchStore';
import { useChatStore } from '../../store/useChatStore';
import { UserProfile } from '../../types/profile.types';

interface DiscoveryDeckScreenProps {
  navigation?: any;
}

export const DiscoveryDeckScreen: React.FC<DiscoveryDeckScreenProps> = ({ navigation }) => {
  const { profiles, currentIndex, fetchDiscoveryFeed, swipe, undoSwipe, resetDeck } =
    useDiscoveryStore();
  const {
    isCelebrationVisible,
    celebrationProfile,
    celebrationMatchId,
    dismissMatchCelebration,
  } = useMatchStore();
  const { sendMessage } = useChatStore();

  const [detailsProfile, setDetailsProfile] = useState<UserProfile | null>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  useEffect(() => {
    fetchDiscoveryFeed();
  }, []);

  const visibleProfiles = profiles.slice(currentIndex, currentIndex + 3);
  const hasMoreCards = currentIndex < profiles.length;

  const handleOpenDetails = (profile: UserProfile) => {
    setDetailsProfile(profile);
    setIsDetailsVisible(true);
  };

  const handleMatchSendMessage = async (text: string) => {
    if (celebrationMatchId && celebrationProfile) {
      await sendMessage(celebrationMatchId, celebrationProfile.user_id, text);
      dismissMatchCelebration();
      // Navigate to chat room
      navigation?.navigate('ChatRoom', {
        matchId: celebrationMatchId,
        partnerProfile: {
          userId: celebrationProfile.user_id,
          name: celebrationProfile.first_name,
          avatar: celebrationProfile.photos[0]?.media_url || '',
          isOnline: true,
          isVerified: celebrationProfile.is_verified,
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.brandRow}>
          <Flame size={26} color={Colors.primary} fill={Colors.primary} />
          <Text style={styles.brandTitle}>MILOO</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => navigation?.navigate('Settings')}
            style={styles.headerIconButton}
          >
            <SlidersHorizontal size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Deck Container */}
      <View style={styles.deckContainer}>
        {hasMoreCards ? (
          visibleProfiles
            .map((profile, i) => (
              <SwipeableCard
                key={profile.user_id}
                profile={profile}
                index={i}
                isFirst={i === 0}
                onSwipeLeft={() => swipe('PASS')}
                onSwipeRight={() => swipe('LIKE')}
                onSwipeUp={() => swipe('SUPERLIKE')}
                onOpenDetails={handleOpenDetails}
              />
            ))
            .reverse()
        ) : (
          <RadarScanner />
        )}
      </View>

      {/* Floating Frosted Glass Action Dock */}
      {hasMoreCards && (
        <ActionDock
          canUndo={currentIndex > 0}
          onUndo={() => undoSwipe()}
          onPass={() => swipe('PASS')}
          onSuperlike={() => swipe('SUPERLIKE')}
          onLike={() => swipe('LIKE')}
          onBoost={() => {
            // Simulated boost trigger
            alert('🚀 30-Minute Boost Activated! Your profile is now top 1 in your area.');
          }}
        />
      )}

      {/* SCR-04: "It's a Match!" Celebration Modal */}
      <MatchCelebrationModal
        visible={isCelebrationVisible}
        partnerProfile={celebrationProfile}
        onSendMessage={handleMatchSendMessage}
        onKeepSwiping={dismissMatchCelebration}
      />

      {/* Extended Profile Details Sheet */}
      <ProfileDetailsSheet
        visible={isDetailsVisible}
        profile={detailsProfile}
        onClose={() => setIsDetailsVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: 10,
    paddingBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  deckContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
});
