import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { isOnboardingCompleted, setOnboardingCompleted } from '@/utils/storage';
import OnboardingScreen from '@/components/onboarding/OnboardingScreen';

export default function RootLayout() {
  useFrameworkReady();
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    const completed = await isOnboardingCompleted();
    setShowOnboarding(!completed);
  };

  const handleOnboardingComplete = async () => {
    await setOnboardingCompleted();
    setShowOnboarding(false);
  };

  if (showOnboarding === null) {
    return null; // Loading
  }

  if (showOnboarding) {
    return (
      <SafeAreaProvider>
        <OnboardingScreen onComplete={handleOnboardingComplete} />
        <StatusBar style="auto" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
