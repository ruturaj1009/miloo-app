import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Check, CheckCheck, Clock } from 'lucide-react-native';
import { ChatMessage } from '../../types/chat.types';
import { Colors, BorderRadius, Spacing, Typography } from '../../theme';

interface MessageBubbleProps {
  message: ChatMessage;
  isMe: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMe }) => {
  return (
    <View style={[styles.row, isMe ? styles.rowMe : styles.rowPartner]}>
      {isMe ? (
        <LinearGradient
          colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.bubble, styles.bubbleMe]}
        >
          {message.media_url && (
            <Image
              source={{ uri: message.media_url }}
              style={styles.attachmentImage}
              contentFit="cover"
            />
          )}

          <Text style={styles.textMe}>{message.content}</Text>

          <View style={styles.timeRowMe}>
            <Text style={styles.timeTextMe}>{message.created_at}</Text>
            {message.is_pending ? (
              <Clock size={12} color="rgba(255, 255, 255, 0.7)" />
            ) : message.is_read ? (
              <CheckCheck size={14} color="#38BDF8" />
            ) : (
              <Check size={14} color="rgba(255, 255, 255, 0.7)" />
            )}
          </View>
        </LinearGradient>
      ) : (
        <View style={[styles.bubble, styles.bubblePartner]}>
          {message.media_url && (
            <Image
              source={{ uri: message.media_url }}
              style={styles.attachmentImage}
              contentFit="cover"
            />
          )}

          <Text style={styles.textPartner}>{message.content}</Text>

          <View style={styles.timeRowPartner}>
            <Text style={styles.timeTextPartner}>{message.created_at}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    marginVertical: 4,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
  },
  rowMe: {
    justifyContent: 'flex-end',
  },
  rowPartner: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.xl,
  },
  bubbleMe: {
    borderBottomRightRadius: BorderRadius.xs,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  bubblePartner: {
    backgroundColor: 'rgba(32, 39, 56, 0.9)',
    borderBottomLeftRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  attachmentImage: {
    width: 220,
    height: 160,
    borderRadius: BorderRadius.md,
    marginBottom: 8,
  },
  textMe: {
    ...Typography.body,
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 20,
  },
  textPartner: {
    ...Typography.body,
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 20,
  },
  timeRowMe: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  timeTextMe: {
    ...Typography.caption,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  timeRowPartner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 4,
  },
  timeTextPartner: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textMuted,
  },
});
