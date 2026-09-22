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
import { ArrowLeft, Sparkles, Quote } from 'lucide-react-native';
import {
  Colors,
  Gradients,
  BorderRadius,
  Spacing,
  Typography,
  HitSlop,
} from '../../theme';
import { GradientButton } from '../../components/common/GradientButton';
import { PhotoSlotGrid } from '../../components/profile/PhotoSlotGrid';
import { TagBadge } from '../../components/common/TagBadge';
import { useProfileStore } from '../../store/useProfileStore';
import { GenderType, InterestedInType } from '../../types/profile.types';

const INTEREST_TAGS_CATEGORIZED = [
  { name: 'Specialty Coffee', cat: 'Hobbies' as const },
  { name: 'Film Photography', cat: 'Hobbies' as const },
  { name: 'Modern Art', cat: 'Hobbies' as const },
  { name: 'Mountain Hiking', cat: 'Hobbies' as const },
  { name: 'Surfing', cat: 'Hobbies' as const },
  { name: 'Tennis', cat: 'Hobbies' as const },
  { name: 'Electronic Music', cat: 'Music' as const },
  { name: 'Jazz Kissaten', cat: 'Music' as const },
  { name: 'Vinyl Records', cat: 'Music' as const },
  { name: 'Indie Rock', cat: 'Music' as const },
  { name: 'Classical Cello', cat: 'Music' as const },
  { name: 'Mindfulness & Yoga', cat: 'Values' as const },
  { name: 'Sustainability', cat: 'Values' as const },
  { name: 'Continuous Growth', cat: 'Values' as const },
  { name: 'Foodie Culture', cat: 'Lifestyle' as const },
  { name: 'Weekend Travel', cat: 'Lifestyle' as const },
  { name: 'Architecture', cat: 'Lifestyle' as const },
  { name: 'Dog Lover', cat: 'Lifestyle' as const },
];

const PRESET_PROMPTS = [
  'A non-negotiable for me is...',
  'Together, we could...',
  'My simple pleasures...',
  'Dating me is like...',
  'Teach me something about...',
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
  const [step, setStep] = useState(2); // Step 2: Photos & Bio matching default flow
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
  const [bio, setBio] = useState(
    profile.bio ||
      'Product architect & electronic music enthusiast. Always looking for the next hidden coffee spot or weekend mountain trail.'
  );
  const [selectedGender, setSelectedGender] = useState<GenderType>(profile.gender || 'MAN');
  const [interestedIn, setInterestedIn] = useState<InterestedInType>(
    profile.interested_in || 'WOMEN'
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    profile.interest_tags || ['Travel', 'Coffee', 'Tennis', 'AI', 'Art', 'Music', 'Wine']
  );
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const [promptAnswer, setPromptAnswer] = useState(
    profile.prompts?.[0]?.answer ||
      'Curiosity about the world, good taste in electronic music, and kindness to service staff.'
  );

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
      {/* Top Navigation Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => (step > 1 ? setStep(step - 1) : handleGoBack())}
          hitSlop={HitSlop.standard}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.stepTitle}>
            Step {step} of 3 •{' '}
            {step === 1 ? 'About You' : step === 2 ? 'Photos & Bio' : 'Passions'}
          </Text>
          {/* Progress dots */}
          <View style={styles.dotsRow}>
            {[1, 2, 3].map((i) => (
              <View
                key={i}
                style={[
                  styles.progressDot,
                  i === step
                    ? styles.dotActive
                    : i < step
                    ? styles.dotCompleted
                    : styles.dotInactive,
                ]}
              />
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleFinish}
          hitSlop={HitSlop.standard}
          style={styles.skipButton}
          accessibilityLabel="Skip"
          accessibilityRole="button"
        >
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
          {/* STEP 1: Basic Info */}
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
                    accessibilityRole="button"
                  >
                    <Text
                      style={[
                        styles.genderText,
                        selectedGender === g && styles.genderTextSelected,
                      ]}
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
                    style={[
                      styles.genderChip,
                      interestedIn === pref && styles.genderChipSelected,
                    ]}
                    accessibilityRole="button"
                  >
                    <Text
                      style={[
                        styles.genderText,
                        interestedIn === pref && styles.genderTextSelected,
                      ]}
                    >
                      {pref === 'WOMEN' ? 'Women' : pref === 'MEN' ? 'Men' : 'Everyone'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* STEP 2: Photos, Bio & Dating Prompts */}
          {step === 2 && (
            <View style={styles.stepSection}>
              {/* 6-Slot Photo Grid */}
              <View style={styles.gridSection}>
                <Text style={styles.groupTitle}>Add Photos (Min 2)</Text>
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

              {/* Dating Prompt Editor per SKILL.md */}
              <View style={styles.promptSection}>
                <Text style={styles.groupTitle}>Add a Dating Prompt</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.promptPicker}
                >
                  {PRESET_PROMPTS.map((q, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => setSelectedPromptIndex(idx)}
                      style={[
                        styles.promptChip,
                        selectedPromptIndex === idx && styles.promptChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.promptChipText,
                          selectedPromptIndex === idx && styles.promptChipTextActive,
                        ]}
                        numberOfLines={1}
                      >
                        {q}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <View style={styles.promptAnswerBox}>
                  <View style={styles.promptSelectedHeader}>
                    <Quote size={14} color={Colors.brandSecondaryLight} />
                    <Text style={styles.promptSelectedTitle}>
                      {PRESET_PROMPTS[selectedPromptIndex]}
                    </Text>
                  </View>
                  <TextInput
                    value={promptAnswer}
                    onChangeText={setPromptAnswer}
                    placeholder="Write your answer..."
                    placeholderTextColor={Colors.textMuted}
                    multiline
                    maxLength={200}
                    style={styles.promptAnswerInput}
                  />
                </View>
              </View>
            </View>
          )}

          {/* STEP 3: Passions & Passions Categorized */}
          {step === 3 && (
            <View style={styles.stepSection}>
              <Text style={[Typography.h2, styles.sectionHeading]}>Select Your Passions</Text>
              <Text style={styles.stepSubtitle}>
                Pick up to 10 interests to connect with people who match your frequency.
              </Text>
              <View style={styles.tagsFlex}>
                {INTEREST_TAGS_CATEGORIZED.map((item) => (
                  <TagBadge
                    key={item.name}
                    label={item.name}
                    category={item.cat}
                    selected={selectedTags.includes(item.name)}
                    onPress={() => toggleTag(item.name)}
                  />
                ))}
              </View>
            </View>
          )}

          <GradientButton
            title={step === 3 ? 'Save & Start Exploring' : 'Continue →'}
            onPress={handleContinue}
            colors={Gradients.brand}
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
    backgroundColor: Colors.backgroundPrimary,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neutralCard,
  },
  headerCenter: {
    alignItems: 'center',
  },
  stepTitle: {
    ...Typography.subtitle,
    color: Colors.textPrimary,
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
    backgroundColor: Colors.brandSecondary,
    width: 22,
  },
  dotCompleted: {
    backgroundColor: Colors.brandPrimary,
  },
  dotInactive: {
    backgroundColor: Colors.neutralCard,
  },
  skipButton: {
    paddingHorizontal: 8,
  },
  skipText: {
    ...Typography.caption,
    color: Colors.brandSecondaryLight,
    fontWeight: '700',
    fontSize: 14,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 60,
  },
  stepSection: {
    marginBottom: Spacing.xl,
  },
  sectionHeading: {
    marginBottom: 6,
    color: Colors.textPrimary,
  },
  stepSubtitle: {
    ...Typography.bodySecondary,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  subHeading: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    color: Colors.textPrimary,
  },
  groupTitle: {
    ...Typography.h3,
    fontSize: 18,
    color: Colors.textPrimary,
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
    backgroundColor: Colors.glassBackground,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    padding: Spacing.md,
    minHeight: 110,
  },
  bioInput: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
  },
  promptSection: {
    marginBottom: Spacing.lg,
  },
  promptPicker: {
    marginBottom: Spacing.sm,
  },
  promptChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutralCard,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    marginRight: 8,
  },
  promptChipActive: {
    borderColor: Colors.brandSecondary,
    backgroundColor: 'rgba(124, 58, 237, 0.25)',
  },
  promptChipText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  promptChipTextActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  promptAnswerBox: {
    backgroundColor: Colors.promptBoxBackground,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.promptBoxBorder,
    padding: Spacing.md,
  },
  promptSelectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  promptSelectedTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.brandSecondaryLight,
  },
  promptAnswerInput: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 60,
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
    color: Colors.textPrimary,
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
    backgroundColor: Colors.neutralCard,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderChipSelected: {
    borderColor: Colors.brandSecondary,
    backgroundColor: 'rgba(124, 58, 237, 0.25)',
  },
  genderText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  genderTextSelected: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  continueButton: {
    marginTop: Spacing.md,
  },
});
