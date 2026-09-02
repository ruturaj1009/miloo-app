import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Plus, Mic, Smile, ArrowUp } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, BorderRadius, Spacing, Typography } from '../../theme';

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
      <BlurView intensity={70} tint="dark" style={styles.blurContainer}>
        {/* Attachment button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onAttachMedia}
          style={styles.iconButton}
        >
          <Plus size={22} color={Colors.textSecondary} />
        </TouchableOpacity>

        {/* Mic voice note button */}
        <TouchableOpacity activeOpacity={0.7} style={styles.iconButton}>
          <Mic size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        {/* Emoji button */}
        <TouchableOpacity activeOpacity={0.7} style={styles.iconButton}>
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
        >
          <ArrowUp size={20} color="#FFFFFF" strokeWidth={3} />
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
    borderRadius: BorderRadius.xxl,
    backgroundColor: 'rgba(26, 31, 46, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
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
    color: '#FFFFFF',
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
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  sendDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    opacity: 0.4,
  },
});
