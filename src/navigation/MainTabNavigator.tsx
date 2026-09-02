import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Flame, MessageCircle, User, SlidersHorizontal } from 'lucide-react-native';
import { MainTabParamList } from '../types/navigation.types';
import { Colors, BorderRadius } from '../theme';
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
          <BlurView intensity={75} tint="dark" style={styles.blurBackground} />
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
                color={focused ? Colors.primary : Colors.textMuted}
                fill={focused ? Colors.primary : 'none'}
              />
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
                color={focused ? Colors.secondary : Colors.textMuted}
                fill={focused ? Colors.secondary : 'none'}
              />
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
                color={focused ? '#FFFFFF' : Colors.textMuted}
              />
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
                color={focused ? '#FFFFFF' : Colors.textMuted}
              />
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
    bottom: 20,
    left: 20,
    right: 20,
    height: 64,
    borderRadius: BorderRadius.xxl,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 10,
    overflow: 'hidden',
  },
  blurBackground: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(14, 18, 27, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: BorderRadius.xxl,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  iconActiveGlow: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
});
