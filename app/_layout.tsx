import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';

import '@/firebase/config';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.bg },
            headerTintColor: colors.text,
            contentStyle: { backgroundColor: colors.bg },
            headerTitleStyle: { fontWeight: '700' },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Home' }} />
          <Stack.Screen name="category/[categoryId]" options={{ title: '' }} />
          <Stack.Screen name="course/[courseId]" options={{ title: '' }} />
          <Stack.Screen name="session/[exerciseId]" options={{ title: 'Session', presentation: 'modal' }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
