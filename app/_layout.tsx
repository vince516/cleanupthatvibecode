import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { Splash } from '@/components/Splash';
import { useAuth, useAuthListener } from '@/state/auth';

import '@/firebase/config';

const PUBLIC_ROUTES = new Set(['privacy']);

function useAuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const initialized = useAuth((s) => s.initialized);
  const user = useAuth((s) => s.user);

  useEffect(() => {
    if (!initialized) return;
    const first = segments[0] ?? '';
    const inAuth = first === '(auth)';
    const isPublic = PUBLIC_ROUTES.has(first);
    if (!user && !inAuth && !isPublic) {
      router.replace('/sign-in');
    } else if (user && inAuth) {
      router.replace('/');
    }
  }, [initialized, user, segments, router]);
}

export default function RootLayout() {
  useAuthListener();
  useAuthGate();
  const initialized = useAuth((s) => s.initialized);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        {!initialized ? (
          <Splash />
        ) : (
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: colors.bg },
              headerTintColor: colors.text,
              contentStyle: { backgroundColor: colors.bg },
              headerTitleStyle: { fontWeight: '700' },
            }}
          >
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ title: 'Home' }} />
            <Stack.Screen name="you" options={{ title: 'You' }} />
            <Stack.Screen name="data" options={{ title: 'Privacy & data' }} />
            <Stack.Screen name="privacy" options={{ title: 'Privacy policy' }} />
            <Stack.Screen name="progress" options={{ title: 'Recent sessions' }} />
            <Stack.Screen name="invite/[childId]" options={{ title: '' }} />
            <Stack.Screen name="category/[categoryId]" options={{ title: '' }} />
            <Stack.Screen name="course/[courseId]" options={{ title: '' }} />
            <Stack.Screen
              name="session/[exerciseId]"
              options={{ title: 'Session', presentation: 'modal' }}
            />
          </Stack>
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
