import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Flame, MessageCircle, User, SlidersHorizontal } from 'lucide-react-native';
import { MainTabParamList } from '../types/navigation.types';
import { Colors, BorderRadius, Shadows } from '../theme';
import { DiscoveryDeckScreen } from '../screens/discovery/DiscoveryDeckScreen';
import { MatchesTrayScreen } from '../screens/matches/MatchesTrayScreen';
import { ProfileViewScreen } from '../screens/profile/ProfileViewScreen';
import { SettingsPrefsScreen } from '../screens/settings/SettingsPrefsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <BlurView intensity={85} tint="dark" style={styles.blurBackground} />
        ),
      }}
    >
      <Tab.Screen
        name="Discovery"
        component={DiscoveryDeckScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconActiveGlow]}>
              <Flame
                size={26}
                color={focused ? Colors.brandPrimary : Colors.textMuted}
                fill={focused ? Colors.brandPrimary : 'none'}
              />
              {focused && <View style={[styles.activeDot, { backgroundColor: Colors.brandPrimary }]} />}
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Matches"
        component={MatchesTrayScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconActiveGlow]}>
              <MessageCircle
                size={26}
                color={focused ? Colors.brandSecondaryLight : Colors.textMuted}
                fill={focused ? Colors.brandSecondaryLight : 'none'}
              />
              {focused && (
                <View
                  style={[styles.activeDot, { backgroundColor: Colors.brandSecondaryLight }]}
                />
              )}
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileViewScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconActiveGlow]}>
              <User
                size={26}
                color={focused ? Colors.textPrimary : Colors.textMuted}
              />
              {focused && <View style={[styles.activeDot, { backgroundColor: Colors.textPrimary }]} />}
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsPrefsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconActiveGlow]}>
              <SlidersHorizontal
                size={26}
                color={focused ? Colors.textPrimary : Colors.textMuted}
              />
              {focused && <View style={[styles.activeDot, { backgroundColor: Colors.textPrimary }]} />}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 22,
    left: 20,
    right: 20,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 10,
    overflow: 'hidden',
  },
  blurBackground: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.glassBackgroundDark,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: BorderRadius.full,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    position: 'relative',
  },
  iconActiveGlow: {
    backgroundColor: Colors.neutralCard,
  },
  activeDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
