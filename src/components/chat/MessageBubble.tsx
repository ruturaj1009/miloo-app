import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Check, CheckCheck, Clock } from 'lucide-react-native';
import { ChatMessage } from '../../types/chat.types';
import { Colors, Gradients, BorderRadius, Spacing, Typography, Shadows } from '../../theme';

interface MessageBubbleProps {
  message: ChatMessage;
  isMe: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMe }) => {
  return (
    <View style={[styles.row, isMe ? styles.rowMe : styles.rowPartner]}>
      {isMe ? (
        <LinearGradient
          colors={Gradients.brand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.bubble, styles.bubbleMe]}
        >
          {message.media_url && (
            <Image
              source={{ uri: message.media_url }}
              style={styles.attachmentImage}
              contentFit="cover"
              priority="high"
            />
          )}

          <Text style={styles.textMe}>{message.content}</Text>

          <View style={styles.timeRowMe}>
            <Text style={styles.timeTextMe}>{message.created_at}</Text>
            {message.is_pending ? (
              <Clock size={12} color="rgba(255, 255, 255, 0.7)" />
            ) : message.is_read ? (
              <CheckCheck size={14} color={Colors.verifiedBadge} />
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
              priority="high"
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
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.xl,
  },
  bubbleMe: {
    borderBottomRightRadius: BorderRadius.xs,
    ...Shadows.glowPrimary,
  },
  bubblePartner: {
    backgroundColor: Colors.backgroundElevated,
    borderBottomLeftRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  attachmentImage: {
    width: 220,
    height: 160,
    borderRadius: BorderRadius.md,
    marginBottom: 8,
  },
  textMe: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontSize: 15,
    lineHeight: 20,
  },
  textPartner: {
    ...Typography.body,
    color: Colors.textPrimary,
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
