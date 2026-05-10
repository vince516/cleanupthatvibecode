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
import { signUp } from '@/firebase/auth';
import { Checkbox } from '@/components/Checkbox';
import { PRIVACY_POLICY_VERSION } from '@/legal/privacy';
import { colors, radius, space } from '@/theme/colors';
import type { Role } from '@/domain/types';

export default function SignUpScreen() {
  const [role, setRole] = useState<Role>('parent');
  const [displayName, setDisplayName] = useState('');
  const [childName, setChildName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const [acceptParental, setAcceptParental] = useState(false);
  const [acceptAnalytics, setAcceptAnalytics] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requiresParental = role === 'parent';
  const canSubmit =
    !!email.trim() &&
    password.length >= 6 &&
    acceptPolicy &&
    (!requiresParental || acceptParental) &&
    (!requiresParental || !!childName.trim());

  const submit = async () => {
    setError(null);
    if (!canSubmit) {
      setError('Please complete the required fields and consents.');
      return;
    }
    setBusy(true);
    try {
      await signUp({
        email: email.trim(),
        password,
        role,
        displayName: displayName.trim() || undefined,
        childName: requiresParental ? childName.trim() : undefined,
        consent: {
          policyVersion: PRIVACY_POLICY_VERSION,
          acceptedAt: Date.now(),
          privacyPolicy: acceptPolicy,
          parentalConsent: requiresParental ? acceptParental : false,
          analytics: acceptAnalytics,
          marketingEmail: acceptMarketing,
        },
      });
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
          <Text style={styles.title}>Create an account</Text>
          <Text style={styles.sub}>Choose your role — this changes what you see.</Text>

          <View style={styles.roleRow}>
            <RoleCard
              active={role === 'parent'}
              onPress={() => setRole('parent')}
              title="I'm a parent / caregiver"
              detail="Run home sessions, log progress, follow your SLP's plan."
            />
            <RoleCard
              active={role === 'slp'}
              onPress={() => setRole('slp')}
              title="I'm an SLP / therapist"
              detail="Place children, set targets, review parent logs."
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Your name (optional)</Text>
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              placeholder={role === 'slp' ? 'Ms. Cruz' : 'Mama Ana'}
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
          </View>

          {requiresParental && (
            <View style={styles.field}>
              <Text style={styles.label}>Child's first name</Text>
              <TextInput
                value={childName}
                onChangeText={setChildName}
                placeholder="Liam"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
              />
            </View>
          )}

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
              placeholder="At least 6 characters"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
          </View>

          <View style={styles.consentBlock}>
            <Text style={styles.consentTitle}>Privacy & consent</Text>
            <Text style={styles.consentIntro}>
              We collect only what's needed to deliver your child's program. You can export or
              delete everything at any time.
            </Text>
            <Link href="/privacy" style={styles.policyLink}>
              Read the full privacy policy →
            </Link>

            <Checkbox
              required
              checked={acceptPolicy}
              onChange={setAcceptPolicy}
              label="I have read and agree to the Privacy Policy."
              hint={`Version ${PRIVACY_POLICY_VERSION}.`}
            />

            {requiresParental && (
              <Checkbox
                required
                checked={acceptParental}
                onChange={setAcceptParental}
                label="I confirm I am the parent or legal guardian and consent to processing my child's data."
                hint="Required under GDPR Article 8 (parental consent)."
              />
            )}

            <Checkbox
              checked={acceptAnalytics}
              onChange={setAcceptAnalytics}
              label="Allow anonymous usage analytics."
              hint="Helps us improve the app. You can change this any time in You → Privacy."
            />
            <Checkbox
              checked={acceptMarketing}
              onChange={setAcceptMarketing}
              label="Send me product updates by email."
              hint="Optional. Unsubscribe any time."
            />
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <Pressable
            onPress={submit}
            disabled={busy || !canSubmit}
            style={[styles.cta, (busy || !canSubmit) && { opacity: 0.5 }]}
          >
            <Text style={styles.ctaText}>{busy ? 'Creating account…' : 'Create account'}</Text>
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have one? </Text>
            <Link href="/sign-in" style={styles.footerLink}>
              Sign in
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function RoleCard({
  active,
  onPress,
  title,
  detail,
}: {
  active: boolean;
  onPress: () => void;
  title: string;
  detail: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.roleCard, active && styles.roleCardActive]}
    >
      <Text style={[styles.roleTitle, active && { color: colors.text }]}>{title}</Text>
      <Text style={styles.roleDetail}>{detail}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  wrap: { padding: space(5), gap: space(3), paddingTop: space(8) },
  brand: { color: colors.primary, fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  title: { color: colors.text, fontSize: 28, fontWeight: '800' },
  sub: { color: colors.textMuted, fontSize: 14, marginBottom: space(2) },
  roleRow: { gap: space(2) },
  roleCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: space(3),
    borderWidth: 1,
    borderColor: colors.border,
    gap: space(1),
  },
  roleCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryDeep },
  roleTitle: { color: colors.textMuted, fontWeight: '700', fontSize: 15 },
  roleDetail: { color: colors.textMuted, fontSize: 13 },
  field: { gap: space(1) },
  label: { color: colors.textMuted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: space(3),
    color: colors.text,
    fontSize: 16,
  },
  consentBlock: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: space(4),
    gap: space(2),
    marginTop: space(2),
  },
  consentTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  consentIntro: { color: colors.textMuted, fontSize: 13, lineHeight: 18 },
  policyLink: { color: colors.primary, fontWeight: '700', marginBottom: space(1) },
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
});
