import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation.types';
import { useAuthStore } from '../store/useAuthStore';
import { AuthScreen } from '../screens/auth/AuthScreen';
import { ProfileBuilderScreen } from '../screens/profile/ProfileBuilderScreen';
import { MainTabNavigator } from './MainTabNavigator';
import { ChatRoomScreen } from '../screens/chat/ChatRoomScreen';
import { WebRTCCallScreen } from '../screens/calling/WebRTCCallScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen
              name="ProfileBuilder"
              component={ProfileBuilderScreen}
              options={{ animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="ChatRoom"
              component={ChatRoomScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="WebRTCCall"
              component={WebRTCCallScreen}
              options={{
                animation: 'fade_from_bottom',
                presentation: 'fullScreenModal',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
