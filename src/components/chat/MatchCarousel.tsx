import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MatchSummary } from '../../types/interaction.types';
import { Colors, Spacing, Typography, BorderRadius } from '../../theme';
import { Avatar } from '../common/Avatar';

interface MatchCarouselProps {
  matches: MatchSummary[];
  onSelectMatch: (match: MatchSummary) => void;
}

export const MatchCarousel: React.FC<MatchCarouselProps> = ({ matches, onSelectMatch }) => {
  return (
    <View style={styles.container}>
      <Text style={[Typography.caption, styles.sectionTitle]}>NEW MATCHES ({matches.length})</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {matches.map((match) => {
          const profile = match.partner_profile;
          const photoUrl = profile.photos[0]?.media_url;

          return (
            <TouchableOpacity
              key={match.match_id}
              activeOpacity={0.8}
              onPress={() => onSelectMatch(match)}
              style={styles.matchItem}
            >
              <LinearGradient
                colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientRing}
              >
                <Avatar
                  uri={photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80'}
                  size={62}
                  isOnline={profile.first_name === 'Elena' || profile.first_name === 'Yuki'}
                />
              </LinearGradient>
              <Text style={styles.nameText} numberOfLines={1}>
                {profile.first_name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  sectionTitle: {
    paddingHorizontal: Spacing.md,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  scrollList: {
    paddingHorizontal: Spacing.md,
    gap: 14,
  },
  matchItem: {
    alignItems: 'center',
    width: 68,
  },
  gradientRing: {
    padding: 2.5,
    borderRadius: BorderRadius.full,
    marginBottom: 6,
  },
  nameText: {
    ...Typography.caption,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 12,
  },
});
