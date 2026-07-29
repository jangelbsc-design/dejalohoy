import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { initializeDatabase } from '../src/data/database/db';
import { UserRepository } from '../src/data/repositories/UserRepository';
import { useStore } from '../src/presentation/store/useStore';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '../src/presentation/theme/colors';

export default function RootLayout() {
  const { isProfileLoaded, setProfile, setProfileLoaded } = useStore();

  useEffect(() => {
    async function setupApp() {
      await initializeDatabase();
      const profile = await UserRepository.getProfile();
      if (profile) {
        setProfile(profile);
      }
      setProfileLoaded(true);
    }
    setupApp();
  }, []);

  if (!isProfileLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
