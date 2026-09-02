import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ArrowLeft, Sparkles, Check, Heart, User, MapPin } from 'lucide-react-native';
import { Colors, BorderRadius, Spacing, Typography } from '../../theme';
import { GradientButton } from '../../components/common/GradientButton';
import { PhotoSlotGrid } from '../../components/profile/PhotoSlotGrid';
import { TagBadge } from '../../components/common/TagBadge';
import { useProfileStore } from '../../store/useProfileStore';
import { GenderType, InterestedInType } from '../../types/profile.types';

const INTEREST_TAGS_POOL = [
  'Travel', 'Coffee', 'Tennis', 'AI', 'Art', 'Music', 'Wine', 'Hiking',
  'EDM', 'Yoga', 'Photography', 'Gaming', 'Cooking', 'Design', 'Surfing',
  'Architecture', 'Cinema', 'Books', 'Vinyl Records', 'Running',
];

interface ProfileBuilderProps {
  navigation?: any;
  onComplete?: () => void;
  onBack?: () => void;
}

export const ProfileBuilderScreen: React.FC<ProfileBuilderProps> = ({
  navigation,
  onComplete,
  onBack,
}) => {
  const [step, setStep] = useState(2); // Step 2: Photos & Bio matching the UX mockup
  const { profile, updateProfile, addPhoto, removePhoto } = useProfileStore();

  const handleFinish = () => {
    if (onComplete) {
      onComplete();
    } else if (navigation) {
      navigation.navigate('MainTabs');
    }
  };

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  const [firstName, setFirstName] = useState(profile.first_name || 'Alex');
  const [bio, setBio] = useState(profile.bio || 'Exploring the world, one city at a time. Passionate about art galleries, good coffee, hiking, and exploring the tech landscape.');
  const [selectedGender, setSelectedGender] = useState<GenderType>(profile.gender || 'MAN');
  const [interestedIn, setInterestedIn] = useState<InterestedInType>(profile.interested_in || 'WOMEN');
  const [selectedTags, setSelectedTags] = useState<string[]>(profile.interest_tags || ['Travel', 'Coffee', 'Tennis', 'AI', 'Art', 'Music', 'Wine', 'Hiking']);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      if (selectedTags.length < 10) {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  const handleContinue = () => {
    updateProfile({
      first_name: firstName,
      bio,
      gender: selectedGender,
      interested_in: interestedIn,
      interest_tags: selectedTags,
    });

    if (step < 3) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => (step > 1 ? setStep(step - 1) : handleGoBack())}
          style={styles.backButton}
        >
          <ArrowLeft size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.stepTitle}>
            Step {step} of 3 - {step === 1 ? 'About You' : step === 2 ? 'Photos & Bio' : 'Passions'}
          </Text>
          {/* Progress dots */}
          <View style={styles.dotsRow}>
            {[1, 2, 3].map((i) => (
              <View
                key={i}
                style={[
                  styles.progressDot,
                  i === step ? styles.dotActive : i < step ? styles.dotCompleted : styles.dotInactive,
                ]}
              />
            ))}
          </View>
        </View>

        <TouchableOpacity onPress={handleFinish} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {step === 1 && (
            <View style={styles.stepSection}>
              <Text style={[Typography.h2, styles.sectionHeading]}>What's your name?</Text>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First Name"
                placeholderTextColor={Colors.textMuted}
                style={styles.textInput}
              />

              <Text style={[Typography.h3, styles.subHeading]}>I am a</Text>
              <View style={styles.genderRow}>
                {(['MAN', 'WOMAN', 'NON_BINARY'] as GenderType[]).map((g) => (
                  <TouchableOpacity
                    key={g}
                    onPress={() => setSelectedGender(g)}
                    style={[styles.genderChip, selectedGender === g && styles.genderChipSelected]}
                  >
                    <Text
                      style={[styles.genderText, selectedGender === g && styles.genderTextSelected]}
                    >
                      {g === 'MAN' ? 'Man' : g === 'WOMAN' ? 'Woman' : 'Non-Binary'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[Typography.h3, styles.subHeading]}>Interested in</Text>
              <View style={styles.genderRow}>
                {(['WOMEN', 'MEN', 'EVERYONE'] as InterestedInType[]).map((pref) => (
                  <TouchableOpacity
                    key={pref}
                    onPress={() => setInterestedIn(pref)}
                    style={[styles.genderChip, interestedIn === pref && styles.genderChipSelected]}
                  >
                    <Text
                      style={[styles.genderText, interestedIn === pref && styles.genderTextSelected]}
                    >
                      {pref === 'WOMEN' ? 'Women' : pref === 'MEN' ? 'Men' : 'Everyone'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepSection}>
              {/* 6-Slot Photo Grid */}
              <View style={styles.gridSection}>
                <Text style={styles.groupTitle}>Add Photos</Text>
                <PhotoSlotGrid
                  photos={profile.photos}
                  onAddPhoto={(uri) => addPhoto(uri)}
                  onRemovePhoto={(id) => removePhoto(id)}
                />
              </View>

              {/* Bio Section with Character Count */}
              <View style={styles.bioSection}>
                <View style={styles.bioHeaderRow}>
                  <Text style={styles.groupTitle}>Tell Your Story</Text>
                  <Text style={styles.charCount}>{bio.length}/500</Text>
                </View>
                <View style={styles.bioBox}>
                  <TextInput
                    value={bio}
                    onChangeText={setBio}
                    placeholder="Write a little about what makes you smile, what you love doing, or your favorite places..."
                    placeholderTextColor={Colors.textMuted}
                    multiline
                    maxLength={500}
                    style={styles.bioInput}
                  />
                </View>
              </View>

              {/* Quick Interest Tags Preview */}
              <View style={styles.tagsSection}>
                <Text style={styles.groupTitle}>Interest Tags</Text>
                <View style={styles.tagsFlex}>
                  {INTEREST_TAGS_POOL.slice(0, 8).map((tag) => (
                    <TagBadge
                      key={tag}
                      label={tag}
                      selected={selectedTags.includes(tag)}
                      onPress={() => toggleTag(tag)}
                    />
                  ))}
                </View>
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepSection}>
              <Text style={[Typography.h2, styles.sectionHeading]}>Select Your Passions</Text>
              <Text style={styles.stepSubtitle}>
                Pick up to 10 interests to find people who share your vibe.
              </Text>
              <View style={styles.tagsFlex}>
                {INTEREST_TAGS_POOL.map((tag) => (
                  <TagBadge
                    key={tag}
                    label={tag}
                    selected={selectedTags.includes(tag)}
                    onPress={() => toggleTag(tag)}
                  />
                ))}
              </View>
            </View>
          )}

          <GradientButton
            title={step === 3 ? 'Save & Start Swiping' : 'Continue →'}
            onPress={handleContinue}
            style={styles.continueButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
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
    paddingTop: 54,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  stepTitle: {
    ...Typography.subtitle,
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 6,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: Colors.secondary,
    width: 20,
  },
  dotCompleted: {
    backgroundColor: Colors.primary,
  },
  dotInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  skipButton: {
    paddingHorizontal: 8,
  },
  skipText: {
    ...Typography.caption,
    color: Colors.secondary,
    fontWeight: '700',
    fontSize: 14,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  stepSection: {
    marginBottom: Spacing.xl,
  },
  sectionHeading: {
    marginBottom: 6,
  },
  stepSubtitle: {
    ...Typography.bodySecondary,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  subHeading: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  groupTitle: {
    ...Typography.h3,
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: Spacing.sm,
  },
  gridSection: {
    marginBottom: Spacing.lg,
  },
  bioSection: {
    marginBottom: Spacing.lg,
  },
  bioHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCount: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  bioBox: {
    backgroundColor: 'rgba(26, 31, 46, 0.75)',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    padding: Spacing.md,
    minHeight: 120,
  },
  bioInput: {
    ...Typography.body,
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
  },
  tagsSection: {
    marginBottom: Spacing.lg,
  },
  tagsFlex: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  textInput: {
    height: 52,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 16,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 10,
  },
  genderChip: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderChipSelected: {
    borderColor: Colors.secondary,
    backgroundColor: 'rgba(139, 92, 246, 0.25)',
  },
  genderText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  genderTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  continueButton: {
    marginTop: Spacing.md,
  },
});
