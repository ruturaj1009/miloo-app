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
} from 'react-native';
import { Search, MessageSquareDashed } from 'lucide-react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../theme';
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
        isOnline: match.partner_profile.first_name === 'Elena' || match.partner_profile.first_name === 'Yuki',
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
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={Typography.h1}>Messages</Text>
      </View>

      {/* Search Bar */}
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
            tintColor={Colors.primary}
          />
        }
        ListHeaderComponent={
          matches.length > 0 ? (
            <MatchCarousel matches={matches} onSelectMatch={handleSelectMatch} />
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleSelectConversation(item)}
            style={styles.conversationRow}
          >
            <Avatar
              uri={item.partner_avatar}
              size={54}
              isOnline={item.is_online}
              isVerified={item.is_verified}
            />

            <View style={styles.convDetails}>
              <View style={styles.convNameRow}>
                <Text style={[Typography.subtitle, styles.partnerName]}>
                  {item.partner_name}
                </Text>
                <Text style={styles.timeText}>{item.last_message_time || 'Just now'}</Text>
              </View>

              <View style={styles.messagePreviewRow}>
                <Text
                  style={[
                    styles.messagePreviewText,
                    item.unread_count > 0 && styles.messageUnreadText,
                  ]}
                  numberOfLines={1}
                >
                  {item.last_message || 'Start the conversation...'}
                </Text>

                {item.unread_count > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>{item.unread_count}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <MessageSquareDashed size={48} color={Colors.textMuted} />
              <Text style={[Typography.subtitle, styles.emptyText]}>No conversations yet</Text>
              <Text style={styles.emptySubtext}>
                Swipe on more profiles to make new matches!
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
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 14,
    height: 44,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
  },
  listContent: {
    paddingBottom: 40,
  },
  conversationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
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
    color: '#FFFFFF',
    fontWeight: '700',
  },
  timeText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 12,
  },
  messagePreviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messagePreviewText: {
    ...Typography.bodySecondary,
    color: Colors.textSecondary,
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  messageUnreadText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: Spacing.xl,
  },
  emptyText: {
    marginTop: 16,
    color: '#FFFFFF',
  },
  emptySubtext: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
  },
});
