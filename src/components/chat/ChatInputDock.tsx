import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Plus, Mic, Smile, ArrowUp } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, BorderRadius, Spacing, Typography, HitSlop, Shadows } from '../../theme';

interface ChatInputDockProps {
  onSendMessage: (text: string) => void;
  onAttachMedia?: () => void;
}

export const ChatInputDock: React.FC<ChatInputDockProps> = ({
  onSendMessage,
  onAttachMedia,
}) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}
    onSendMessage(text.trim());
    setText('');
  };

  return (
    <View style={styles.outerContainer}>
      <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
        {/* Attachment button */}
        <TouchableOpacity
          activeOpacity={0.7}
          hitSlop={HitSlop.small}
          onPress={onAttachMedia}
          style={styles.iconButton}
          accessibilityLabel="Attach media"
          accessibilityRole="button"
        >
          <Plus size={22} color={Colors.textSecondary} />
        </TouchableOpacity>

        {/* Mic voice note button */}
        <TouchableOpacity
          activeOpacity={0.7}
          hitSlop={HitSlop.small}
          style={styles.iconButton}
          accessibilityLabel="Record voice message"
          accessibilityRole="button"
        >
          <Mic size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        {/* Emoji button */}
        <TouchableOpacity
          activeOpacity={0.7}
          hitSlop={HitSlop.small}
          style={styles.iconButton}
          accessibilityLabel="Open emojis"
          accessibilityRole="button"
        >
          <Smile size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        {/* Text Input */}
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type your message..."
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
          multiline
          maxLength={1000}
        />

        {/* Send Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSend}
          disabled={!text.trim()}
          style={[styles.sendButton, text.trim() ? styles.sendActive : styles.sendDisabled]}
          accessibilityLabel="Send message"
          accessibilityRole="button"
        >
          <ArrowUp size={20} color={Colors.textPrimary} strokeWidth={3} />
        </TouchableOpacity>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    backgroundColor: Colors.backgroundPrimary,
  },
  blurContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.glassBackground,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    ...Shadows.subtle,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.textPrimary,
    paddingHorizontal: 10,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 15,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  sendActive: {
    backgroundColor: Colors.brandPrimary,
    ...Shadows.glowPrimary,
  },
  sendDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    opacity: 0.4,
  },
});
