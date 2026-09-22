import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { Search, MessageSquareDashed, Sparkles, X } from 'lucide-react-native';
import { Colors, Spacing, Typography, BorderRadius, HitSlop, Shadows } from '../../theme';
import { MatchCarousel } from '../../components/chat/MatchCarousel';
import { Avatar } from '../../components/common/Avatar';
import { useMatchStore } from '../../store/useMatchStore';
import { useChatStore } from '../../store/useChatStore';
import { Conversation } from '../../types/chat.types';
import { MatchSummary } from '../../types/interaction.types';

interface MatchesTrayScreenProps {
  navigation: any;
}

export const MatchesTrayScreen: React.FC<MatchesTrayScreenProps> = ({ navigation }) => {
  const { matches, fetchMatches, isLoading } = useMatchStore();
  const { conversations, fetchConversations } = useChatStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMatches();
    fetchConversations();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchMatches(), fetchConversations()]);
    setRefreshing(false);
  };

  const handleSelectMatch = (match: MatchSummary) => {
    navigation.navigate('ChatRoom', {
      matchId: match.match_id,
      partnerProfile: {
        userId: match.partner_profile.user_id,
        name: match.partner_profile.first_name,
        avatar: match.partner_profile.photos[0]?.media_url || '',
        isOnline:
          match.partner_profile.first_name === 'Elena' ||
          match.partner_profile.first_name === 'Yuki',
        isVerified: match.partner_profile.is_verified,
      },
    });
  };

  const handleSelectConversation = (conv: Conversation) => {
    navigation.navigate('ChatRoom', {
      matchId: conv.match_id,
      partnerProfile: {
        userId: conv.partner_id,
        name: conv.partner_name,
        avatar: conv.partner_avatar,
        isOnline: conv.is_online,
        isVerified: conv.is_verified,
      },
    });
  };

  const filteredConversations = conversations.filter((c) =>
    c.partner_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.backgroundPrimary} />

      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={Typography.h1}>Messages</Text>
          <Text style={styles.headerSubtitle}>Connect and plan your next date</Text>
        </View>
      </View>

      {/* Frosted Glass Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color={Colors.textMuted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search matches or chats..."
            placeholderTextColor={Colors.textMuted}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={HitSlop.small}
            >
              <X size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* List content with Match Carousel as header */}
      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.match_id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.brandPrimary}
            colors={[Colors.brandPrimary]}
          />
        }
        ListHeaderComponent={
          matches.length > 0 ? (
            <MatchCarousel matches={matches} onSelectMatch={handleSelectMatch} />
          ) : null
        }
        renderItem={({ item }) => {
          const isUnread = item.unread_count > 0;

          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleSelectConversation(item)}
              style={[
                styles.conversationRow,
                isUnread && styles.conversationRowUnread,
              ]}
            >
              <Avatar
                uri={item.partner_avatar}
                size={54}
                isOnline={item.is_online}
                isVerified={item.is_verified}
                gradientRing={isUnread}
              />

              <View style={styles.convDetails}>
                <View style={styles.convNameRow}>
                  <Text
                    style={[
                      Typography.subtitle,
                      styles.partnerName,
                      isUnread && styles.partnerNameUnread,
                    ]}
                  >
                    {item.partner_name}
                  </Text>
                  <Text
                    style={[
                      styles.timeText,
                      isUnread && styles.timeTextUnread,
                    ]}
                  >
                    {item.last_message_time || 'Just now'}
                  </Text>
                </View>

                <View style={styles.messagePreviewRow}>
                  <Text
                    style={[
                      styles.messagePreviewText,
                      isUnread && styles.messageUnreadText,
                    ]}
                    numberOfLines={1}
                  >
                    {item.last_message || 'Start the conversation...'}
                  </Text>

                  {isUnread && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadBadgeText}>{item.unread_count}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBadge}>
                <MessageSquareDashed size={40} color={Colors.brandSecondaryLight} />
              </View>
              <Text style={[Typography.h3, styles.emptyText]}>No conversations yet</Text>
              <Text style={styles.emptySubtext}>
                Swipe on more profiles to make new connections and start chatting!
              </Text>
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
    fontSize: 13,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.glassBackground,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 14,
    height: 46,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  listContent: {
    paddingBottom: 90,
  },
  conversationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  conversationRowUnread: {
    backgroundColor: 'rgba(255, 68, 88, 0.04)',
  },
  convDetails: {
    flex: 1,
    marginLeft: 14,
  },
  convNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  partnerName: {
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  partnerNameUnread: {
    color: Colors.textPrimary,
    fontWeight: '800',
    fontSize: 16,
  },
  timeText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 12,
  },
  timeTextUnread: {
    color: Colors.brandPrimary,
    fontWeight: '700',
  },
  messagePreviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messagePreviewText: {
    ...Typography.bodySecondary,
    color: Colors.textMuted,
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  messageUnreadText: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  unreadBadge: {
    backgroundColor: Colors.brandPrimary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.glowPrimary,
  },
  unreadBadgeText: {
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '800',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: Spacing.xl,
  },
  emptyIconBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.neutralCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    marginBottom: 16,
  },
  emptyText: {
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  emptySubtext: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
    maxWidth: 280,
  },
});
