import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { ChevronLeft, Phone, Video, MoreVertical } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Spacing, Typography } from '../../theme';
import { Avatar } from '../../components/common/Avatar';
import { MessageBubble } from '../../components/chat/MessageBubble';
import { ChatInputDock } from '../../components/chat/ChatInputDock';
import { TypingBubble } from '../../components/chat/TypingBubble';
import { useChatStore } from '../../store/useChatStore';
import { useCallStore } from '../../store/useCallStore';

interface ChatRoomScreenProps {
  route: {
    params: {
      matchId: string;
      partnerProfile: {
        userId: string;
        name: string;
        avatar: string;
        isOnline?: boolean;
        isVerified?: boolean;
      };
    };
  };
  navigation: any;
}

export const ChatRoomScreen: React.FC<ChatRoomScreenProps> = ({ route, navigation }) => {
  const { matchId, partnerProfile } = route.params;
  const { messages, fetchMessages, sendMessage, typingUsers } = useChatStore();
  const { startCall } = useCallStore();

  const flatListRef = useRef<FlatList>(null);
  const matchMessages = messages[matchId] || [];
  const isPartnerTyping = typingUsers[matchId] || false;

  useEffect(() => {
    fetchMessages(matchId);
  }, [matchId]);

  const handleSend = (text: string) => {
    sendMessage(matchId, partnerProfile.userId, text);
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleAttachMedia = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!res.canceled && res.assets[0]?.uri) {
      sendMessage(matchId, partnerProfile.userId, '📷 Shared a photo', res.assets[0].uri);
    }
  };

  const handleStartCall = (callType: 'AUDIO' | 'VIDEO') => {
    startCall({
      matchId,
      targetId: partnerProfile.userId,
      targetName: partnerProfile.name,
      targetAvatar: partnerProfile.avatar,
      callType,
    });

    navigation.navigate('WebRTCCall', {
      matchId,
      partnerId: partnerProfile.userId,
      partnerName: partnerProfile.name,
      partnerAvatar: partnerProfile.avatar,
      callType,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Top Custom Frosted Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ChevronLeft size={28} color="#FFFFFF" />
          </TouchableOpacity>

          <Avatar
            uri={partnerProfile.avatar}
            size={42}
            isOnline={partnerProfile.isOnline}
            isVerified={partnerProfile.isVerified}
          />

          <View style={styles.headerInfo}>
            <Text style={[Typography.subtitle, styles.partnerName]}>
              {partnerProfile.name}
            </Text>
            <Text style={styles.onlineStatus}>
              {partnerProfile.isOnline ? 'Online now' : 'Active recently'}
            </Text>
          </View>
        </View>

        {/* Audio & Video Call Action Buttons */}
        <View style={styles.headerActions}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => handleStartCall('AUDIO')}
            style={styles.actionPill}
          >
            <Phone size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => handleStartCall('VIDEO')}
            style={[styles.actionPill, styles.videoPill]}
          >
            <Video size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} style={styles.moreButton}>
            <MoreVertical size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages Thread Container */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        style={{ flex: 1 }}
      >
        <FlatList
          ref={flatListRef}
          data={matchMessages}
          keyExtractor={(item) => item.message_id}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              isMe={item.sender_id === 'usr_me_001'}
            />
          )}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          ListFooterComponent={
            isPartnerTyping ? <TypingBubble partnerName={partnerProfile.name} /> : null
          }
        />

        {/* Bottom Floating Composer Dock */}
        <ChatInputDock
          onSendMessage={handleSend}
          onAttachMedia={handleAttachMedia}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(10, 13, 20, 0.95)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    marginRight: -4,
  },
  headerInfo: {
    marginLeft: 6,
  },
  partnerName: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  onlineStatus: {
    ...Typography.caption,
    color: Colors.online,
    fontSize: 11,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionPill: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  videoPill: {
    backgroundColor: 'rgba(139, 92, 246, 0.25)',
    borderColor: Colors.secondary,
  },
  moreButton: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesList: {
    paddingVertical: Spacing.md,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});
