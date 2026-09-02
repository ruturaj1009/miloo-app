import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Plus, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { ProfileMedia } from '../../types/profile.types';
import { Colors, BorderRadius, Spacing, Typography } from '../../theme';

interface PhotoSlotGridProps {
  photos: ProfileMedia[];
  onAddPhoto: (uri: string) => void;
  onRemovePhoto: (mediaId: string) => void;
  maxSlots?: number;
}

export const PhotoSlotGrid: React.FC<PhotoSlotGridProps> = ({
  photos,
  onAddPhoto,
  onRemovePhoto,
  maxSlots = 6,
}) => {
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access photos is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      onAddPhoto(result.assets[0].uri);
    }
  };

  const slots = Array.from({ length: maxSlots }, (_, i) => photos[i] || null);

  return (
    <View style={styles.gridContainer}>
      {slots.map((photo, index) => {
        const isMain = index === 0;

        return (
          <View
            key={photo ? photo.media_id : `slot_${index}`}
            style={[styles.slot, isMain && styles.mainSlot]}
          >
            {photo ? (
              <View style={styles.photoWrapper}>
                <Image
                  source={{ uri: photo.media_url }}
                  style={styles.photoImage}
                  contentFit="cover"
                />

                {/* Slot index or MAIN badge */}
                <View style={[styles.badge, isMain ? styles.mainBadge : styles.indexBadge]}>
                  <Text style={styles.badgeText}>{isMain ? 'MAIN' : `${index + 1}`}</Text>
                </View>

                {/* Delete photo button */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => onRemovePhoto(photo.media_id)}
                  style={styles.deleteButton}
                >
                  <X size={14} color="#FFFFFF" strokeWidth={3} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={pickImage}
                style={styles.emptySlot}
              >
                <View style={styles.slotIndexCorner}>
                  <Text style={styles.slotIndexText}>{index + 1}</Text>
                </View>
                <View style={styles.addIconCircle}>
                  <Plus size={22} color={Colors.secondary} strokeWidth={2.5} />
                </View>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  slot: {
    width: '30.5%',
    aspectRatio: 3 / 4,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  mainSlot: {
    borderColor: Colors.secondary,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  photoWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  emptySlot: {
    width: '100%',
    height: '100%',
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(20, 24, 35, 0.4)',
  },
  slotIndexCorner: {
    position: 'absolute',
    top: 6,
    left: 8,
  },
  slotIndexText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '700',
  },
  addIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  badge: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  mainBadge: {
    backgroundColor: Colors.secondary,
  },
  indexBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  deleteButton: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
