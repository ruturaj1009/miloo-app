import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { SlidersHorizontal, Flame } from 'lucide-react-native';
import { Colors, Spacing, Typography, HitSlop } from '../../theme';
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
  const { profiles, currentIndex, fetchDiscoveryFeed, swipe, undoSwipe } =
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
      <StatusBar barStyle="light-content" backgroundColor={Colors.backgroundPrimary} />

      {/* Top Brand Header */}
      <View style={styles.topHeader}>
        <View style={styles.brandRow}>
          <Flame size={28} color={Colors.brandPrimary} fill={Colors.brandPrimary} />
          <Text style={styles.brandTitle}>MILOO</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => navigation?.navigate('Settings')}
            hitSlop={HitSlop.standard}
            style={styles.headerIconButton}
            accessibilityLabel="Open settings and discovery filters"
            accessibilityRole="button"
          >
            <SlidersHorizontal size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Deck Container (Cards occupy ~77% viewport height) */}
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

      {/* Floating Action Dock in bottom natural thumb reach zone */}
      {hasMoreCards && (
        <ActionDock
          canUndo={currentIndex > 0}
          onUndo={() => undoSwipe()}
          onPass={() => swipe('PASS')}
          onSuperlike={() => swipe('SUPERLIKE')}
          onLike={() => swipe('LIKE')}
          onBoost={() => {
            alert('🚀 30-Minute Boost Activated! Your profile is now #1 in your area.');
          }}
        />
      )}

      {/* Celebration Modal when mutual match occurs */}
      <MatchCelebrationModal
        visible={isCelebrationVisible}
        partnerProfile={celebrationProfile}
        onSendMessage={handleMatchSendMessage}
        onKeepSwiping={dismissMatchCelebration}
      />

      {/* Extended Profile Details Sheet with prompt boxes & action dock */}
      <ProfileDetailsSheet
        visible={isDetailsVisible}
        profile={detailsProfile}
        onClose={() => setIsDetailsVisible(false)}
        onPass={() => swipe('PASS')}
        onLike={() => swipe('LIKE')}
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
    fontSize: 26,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 3,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.neutralCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  deckContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
});
