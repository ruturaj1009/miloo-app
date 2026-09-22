import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MatchSummary } from '../../types/interaction.types';
import { Colors, Spacing, Typography, HitSlop } from '../../theme';
import { Avatar } from '../common/Avatar';

interface MatchCarouselProps {
  matches: MatchSummary[];
  onSelectMatch: (match: MatchSummary) => void;
}

export const MatchCarousel: React.FC<MatchCarouselProps> = ({ matches, onSelectMatch }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[Typography.caption, styles.sectionTitle]}>
          NEW MATCHES & STORIES
        </Text>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{matches.length}</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {matches.map((match) => {
          const profile = match.partner_profile;
          const photoUrl = profile.photos[0]?.media_url;
          const isOnline = profile.first_name === 'Elena' || profile.first_name === 'Yuki';

          return (
            <TouchableOpacity
              key={match.match_id}
              activeOpacity={0.8}
              hitSlop={HitSlop.small}
              onPress={() => onSelectMatch(match)}
              style={styles.matchItem}
              accessibilityLabel={`Open chat with ${profile.first_name}`}
              accessibilityRole="button"
            >
              {/* 2px Gradient Ring Avatar per SKILL.md */}
              <Avatar
                uri={
                  photoUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80'
                }
                size={66}
                gradientRing={true}
                isOnline={isOnline}
                isVerified={profile.is_verified}
              />
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
    backgroundColor: Colors.backgroundPrimary,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xs,
    gap: 8,
  },
  sectionTitle: {
    color: Colors.textMuted,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  countBadge: {
    backgroundColor: Colors.neutralCard,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  countBadgeText: {
    color: Colors.brandPrimary,
    fontSize: 11,
    fontWeight: '800',
  },
  scrollList: {
    paddingHorizontal: Spacing.lg,
    gap: 16,
    paddingTop: 4,
    paddingBottom: 2,
  },
  matchItem: {
    alignItems: 'center',
    width: 68,
  },
  nameText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 6,
  },
});
