import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  Alert,
  StatusBar,
} from 'react-native';
import {
  MapPin,
  Bell,
  Volume2,
  Vibrate,
  Shield,
  LogOut,
  Trash2,
  ChevronRight,
  Globe,
  Sliders,
} from 'lucide-react-native';
import { Colors, BorderRadius, Spacing, Typography, HitSlop } from '../../theme';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { InterestedInType } from '../../types/profile.types';

export const SettingsPrefsScreen: React.FC = () => {
  const {
    maxDistanceKm,
    ageMinPref,
    ageMaxPref,
    interestedIn,
    globalMode,
    pushNotifications,
    soundEffects,
    hapticsEnabled,
    setMaxDistanceKm,
    setAgeRange,
    setInterestedIn,
    toggleGlobalMode,
    togglePushNotifications,
    toggleSoundEffects,
    toggleHaptics,
  } = useSettingsStore();

  const { logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of Miloo?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.backgroundPrimary} />

      <View style={styles.header}>
        <Text style={Typography.h1}>Discovery & Settings</Text>
        <Text style={styles.headerSubtitle}>Configure your matching preferences</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section 1: Discovery Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DISCOVERY PREFERENCES</Text>

          {/* Maximum Distance */}
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <View style={styles.iconLabel}>
                <MapPin size={20} color={Colors.brandPrimary} />
                <Text style={styles.itemLabel}>Maximum Distance</Text>
              </View>
              <Text style={styles.valueHighlight}>{maxDistanceKm} km</Text>
            </View>

            {/* Step buttons for distance */}
            <View style={styles.distanceChipsRow}>
              {[10, 25, 50, 80, 100].map((dist) => (
                <TouchableOpacity
                  key={dist}
                  onPress={() => setMaxDistanceKm(dist)}
                  hitSlop={HitSlop.small}
                  style={[
                    styles.chip,
                    maxDistanceKm === dist && styles.chipSelected,
                  ]}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.chipText,
                      maxDistanceKm === dist && styles.chipTextSelected,
                    ]}
                  >
                    {dist} km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Age Preference */}
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <View style={styles.iconLabel}>
                <Sliders size={20} color={Colors.brandSecondaryLight} />
                <Text style={styles.itemLabel}>Age Range</Text>
              </View>
              <Text style={styles.valueHighlightSecondary}>
                {ageMinPref} - {ageMaxPref}
              </Text>
            </View>

            {/* Quick age preset chips */}
            <View style={styles.distanceChipsRow}>
              {[
                { min: 18, max: 25, label: '18-25' },
                { min: 21, max: 32, label: '21-32' },
                { min: 25, max: 40, label: '25-40' },
                { min: 18, max: 55, label: 'All Ages' },
              ].map((range) => (
                <TouchableOpacity
                  key={range.label}
                  onPress={() => setAgeRange(range.min, range.max)}
                  hitSlop={HitSlop.small}
                  style={[
                    styles.chip,
                    ageMinPref === range.min && ageMaxPref === range.max && styles.chipSelectedSecondary,
                  ]}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.chipText,
                      ageMinPref === range.min &&
                        ageMaxPref === range.max &&
                        styles.chipTextSelected,
                    ]}
                  >
                    {range.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Show Me / Interested In */}
          <View style={styles.card}>
            <Text style={styles.itemLabel}>Show Me</Text>
            <View style={styles.genderRow}>
              {(['WOMEN', 'MEN', 'EVERYONE'] as InterestedInType[]).map((pref) => (
                <TouchableOpacity
                  key={pref}
                  onPress={() => setInterestedIn(pref)}
                  style={[
                    styles.genderButton,
                    interestedIn === pref && styles.genderButtonSelected,
                  ]}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.genderBtnText,
                      interestedIn === pref && styles.genderBtnTextSelected,
                    ]}
                  >
                    {pref === 'WOMEN' ? 'Women' : pref === 'MEN' ? 'Men' : 'Everyone'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Global Passport Mode */}
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <View style={styles.iconLabel}>
                <Globe size={20} color={Colors.accent} />
                <View>
                  <Text style={styles.itemLabel}>Global Passport Mode</Text>
                  <Text style={styles.itemSubtext}>Connect with people worldwide</Text>
                </View>
              </View>
              <Switch
                value={globalMode}
                onValueChange={toggleGlobalMode}
                trackColor={{ false: '#334155', true: Colors.accent }}
                thumbColor={Colors.textPrimary}
              />
            </View>
          </View>
        </View>

        {/* Section 2: Notifications & App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APP & HAPTICS</Text>

          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <View style={styles.iconLabel}>
                <Bell size={20} color={Colors.textPrimary} />
                <Text style={styles.itemLabel}>Push Notifications</Text>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={togglePushNotifications}
                trackColor={{ false: '#334155', true: Colors.brandPrimary }}
                thumbColor={Colors.textPrimary}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.rowBetween}>
              <View style={styles.iconLabel}>
                <Volume2 size={20} color={Colors.textPrimary} />
                <Text style={styles.itemLabel}>Sound Effects</Text>
              </View>
              <Switch
                value={soundEffects}
                onValueChange={toggleSoundEffects}
                trackColor={{ false: '#334155', true: Colors.brandPrimary }}
                thumbColor={Colors.textPrimary}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.rowBetween}>
              <View style={styles.iconLabel}>
                <Vibrate size={20} color={Colors.textPrimary} />
                <Text style={styles.itemLabel}>Tactile Haptics</Text>
              </View>
              <Switch
                value={hapticsEnabled}
                onValueChange={toggleHaptics}
                trackColor={{ false: '#334155', true: Colors.brandPrimary }}
                thumbColor={Colors.textPrimary}
              />
            </View>
          </View>
        </View>

        {/* Section 3: Account & Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT & PRIVACY</Text>

          <View style={styles.card}>
            <TouchableOpacity style={styles.rowBetween} hitSlop={HitSlop.small}>
              <View style={styles.iconLabel}>
                <Shield size={20} color={Colors.textPrimary} />
                <Text style={styles.itemLabel}>Privacy & Blocked Users</Text>
              </View>
              <ChevronRight size={18} color={Colors.textMuted} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              onPress={handleLogout}
              style={styles.rowBetween}
              hitSlop={HitSlop.small}
            >
              <View style={styles.iconLabel}>
                <LogOut size={20} color={Colors.undo} />
                <Text style={[styles.itemLabel, { color: Colors.undo }]}>Log Out</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.rowBetween} hitSlop={HitSlop.small}>
              <View style={styles.iconLabel}>
                <Trash2 size={20} color={Colors.pass} />
                <Text style={[styles.itemLabel, { color: Colors.pass }]}>Delete Account</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 90,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: Spacing.sm,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: Colors.glassBackground,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemLabel: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
    fontSize: 15,
  },
  itemSubtext: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  valueHighlight: {
    ...Typography.body,
    color: Colors.brandPrimary,
    fontWeight: '700',
  },
  valueHighlightSecondary: {
    ...Typography.body,
    color: Colors.brandSecondaryLight,
    fontWeight: '700',
  },
  distanceChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutralCard,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  chipSelected: {
    backgroundColor: Colors.passBackground,
    borderColor: Colors.brandPrimary,
  },
  chipSelectedSecondary: {
    backgroundColor: 'rgba(124, 58, 237, 0.25)',
    borderColor: Colors.brandSecondary,
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.neutralCard,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  genderButtonSelected: {
    borderColor: Colors.brandSecondary,
    backgroundColor: 'rgba(124, 58, 237, 0.25)',
  },
  genderBtnText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 13,
  },
  genderBtnTextSelected: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 12,
  },
});
