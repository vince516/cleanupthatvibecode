import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  PRIVACY_POLICY,
  PRIVACY_POLICY_DATE,
  PRIVACY_POLICY_SUMMARY,
  PRIVACY_POLICY_VERSION,
} from '@/legal/privacy';
import { colors, radius, space } from '@/theme/colors';

export default function PrivacyScreen() {
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
      <Stack.Screen options={{ title: 'Privacy policy' }} />
      <ScrollView contentContainerStyle={styles.wrap}>
        <Text style={styles.title}>Privacy policy</Text>
        <Text style={styles.version}>
          Version {PRIVACY_POLICY_VERSION} · {PRIVACY_POLICY_DATE}
        </Text>
        <View style={styles.summary}>
          <Text style={styles.summaryText}>{PRIVACY_POLICY_SUMMARY}</Text>
        </View>

        {PRIVACY_POLICY.map((s) => (
          <View key={s.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{s.title}</Text>
            <Text style={styles.sectionBody}>{s.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  wrap: { padding: space(4), gap: space(3), paddingBottom: space(8) },
  title: { color: colors.text, fontSize: 26, fontWeight: '800' },
  version: { color: colors.textMuted, fontSize: 13 },
  summary: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: space(3),
    marginTop: space(1),
  },
  summaryText: { color: colors.text, fontSize: 14, lineHeight: 20 },
  section: { gap: space(1), marginTop: space(2) },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  sectionBody: { color: colors.textMuted, fontSize: 14, lineHeight: 22 },
});
