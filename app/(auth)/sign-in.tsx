import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signIn } from '@/firebase/auth';
import { colors, radius, space } from '@/theme/colors';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setBusy(true);
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
          <Text style={styles.brand}>Mylo</Text>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.sub}>Sign in to continue your child's program.</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              placeholder="you@example.com"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <Pressable
            onPress={submit}
            disabled={busy}
            style={[styles.cta, busy && { opacity: 0.6 }]}
          >
            <Text style={styles.ctaText}>{busy ? 'Signing in…' : 'Sign in'}</Text>
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>New here? </Text>
            <Link href="/sign-up" style={styles.footerLink}>
              Create an account
            </Link>
          </View>

          <Link href="/privacy" style={styles.policyLink}>
            Privacy policy
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  wrap: { padding: space(5), gap: space(3), paddingTop: space(8) },
  brand: { color: colors.primary, fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  title: { color: colors.text, fontSize: 28, fontWeight: '800' },
  sub: { color: colors.textMuted, fontSize: 14, marginBottom: space(2) },
  field: { gap: space(1) },
  label: { color: colors.textMuted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: space(3),
    color: colors.text,
    fontSize: 16,
  },
  error: { color: colors.danger, fontSize: 13 },
  cta: {
    marginTop: space(2),
    paddingVertical: space(3),
    borderRadius: radius.md,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  ctaText: { color: colors.text, fontWeight: '800', fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: space(3) },
  footerText: { color: colors.textMuted },
  footerLink: { color: colors.primary, fontWeight: '700' },
  policyLink: { color: colors.textMuted, textAlign: 'center', marginTop: space(2), fontSize: 13 },
});
