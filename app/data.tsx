import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/state/auth';
import { deleteAccount, exportUserData } from '@/firebase/account';
import { updateConsent } from '@/firebase/users';
import { colors, radius, space } from '@/theme/colors';

export default function DataScreen() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [analytics, setAnalytics] = useState(profile?.consent.analytics ?? false);
  const [marketing, setMarketing] = useState(profile?.consent.marketingEmail ?? false);
  const [savingConsent, setSavingConsent] = useState(false);

  const [exporting, setExporting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [password, setPassword] = useState('');
  const [deleting, setDeleting] = useState(false);

  if (!user || !profile) return null;

  const persistConsent = async (next: { analytics?: boolean; marketing?: boolean }) => {
    setSavingConsent(true);
    try {
      if (next.analytics !== undefined) setAnalytics(next.analytics);
      if (next.marketing !== undefined) setMarketing(next.marketing);
      await updateConsent(user.uid, {
        analytics: next.analytics,
        marketingEmail: next.marketing,
      });
    } catch (err) {
      Alert.alert('Could not save', String((err as Error).message));
    } finally {
      setSavingConsent(false);
    }
  };

  const onExport = async () => {
    setExporting(true);
    try {
      const bundle = await exportUserData();
      const json = JSON.stringify(bundle, null, 2);
      await Share.share({
        title: 'Mylo data export',
        message: json,
      });
    } catch (err) {
      Alert.alert('Export failed', String((err as Error).message));
    } finally {
      setExporting(false);
    }
  };

  const onDelete = async () => {
    if (!password) {
      Alert.alert('Password required', 'Enter your password to confirm deletion.');
      return;
    }
    setDeleting(true);
    try {
      await deleteAccount(password);
      router.replace('/sign-in');
    } catch (err) {
      Alert.alert('Could not delete account', String((err as Error).message));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.title}>Privacy & data</Text>
      <Text style={styles.intro}>
        Your data lives in Firebase. You can read the full policy, change consent,
        export everything, or delete it all.
      </Text>

      <Link href="/privacy" asChild>
        <Pressable style={styles.linkCard}>
          <Text style={styles.linkText}>Read the privacy policy</Text>
          <Text style={styles.linkChevron}>→</Text>
        </Pressable>
      </Link>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Consent</Text>
        <Text style={styles.cardSub}>
          Accepted policy v{profile.consent.policyVersion} on{' '}
          {new Date(profile.consent.acceptedAt).toLocaleDateString()}.
        </Text>

        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleLabel}>Anonymous analytics</Text>
            <Text style={styles.toggleHint}>Helps us improve the app.</Text>
          </View>
          <Switch
            value={analytics}
            onValueChange={(v) => persistConsent({ analytics: v })}
            disabled={savingConsent}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleLabel}>Product emails</Text>
            <Text style={styles.toggleHint}>Occasional updates. No third-party marketing.</Text>
          </View>
          <Switch
            value={marketing}
            onValueChange={(v) => persistConsent({ marketing: v })}
            disabled={savingConsent}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Download my data</Text>
        <Text style={styles.cardSub}>
          Exports your account, child profiles, and session logs as JSON. Right of access
          and portability under GDPR Articles 15 and 20.
        </Text>
        <Pressable
          onPress={onExport}
          disabled={exporting}
          style={[styles.btn, styles.btnPrimary, exporting && { opacity: 0.6 }]}
        >
          <Text style={styles.btnText}>{exporting ? 'Preparing…' : 'Export as JSON'}</Text>
        </Pressable>
      </View>

      <View style={[styles.card, styles.danger]}>
        <Text style={styles.cardTitle}>Delete account & all data</Text>
        <Text style={styles.cardSub}>
          Permanently removes your user record, all child profiles you created, and every
          session log. This cannot be undone. Right to erasure under GDPR Article 17.
        </Text>

        {!confirmingDelete ? (
          <Pressable
            onPress={() => setConfirmingDelete(true)}
            style={[styles.btn, styles.btnDanger]}
          >
            <Text style={styles.btnText}>Delete my account</Text>
          </Pressable>
        ) : (
          <View style={{ gap: space(2) }}>
            <Text style={styles.confirmText}>
              Type your password to confirm. We re-authenticate before deletion as a safety check.
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Your password"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
            <View style={styles.confirmRow}>
              <Pressable
                onPress={() => {
                  setConfirmingDelete(false);
                  setPassword('');
                }}
                style={[styles.btn, styles.btnSecondary, { flex: 1 }]}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={onDelete}
                disabled={deleting}
                style={[styles.btn, styles.btnDanger, { flex: 1 }, deleting && { opacity: 0.6 }]}
              >
                <Text style={styles.btnText}>
                  {deleting ? 'Deleting…' : 'Yes, delete everything'}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: space(4), gap: space(3), paddingBottom: space(8) },
  title: { color: colors.text, fontSize: 24, fontWeight: '800' },
  intro: { color: colors.textMuted, fontSize: 14, lineHeight: 20 },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: space(4),
  },
  linkText: { color: colors.text, fontWeight: '700' },
  linkChevron: { color: colors.primary, fontSize: 18 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: space(4),
    gap: space(2),
  },
  danger: { borderWidth: 1, borderColor: colors.danger + '55' },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  cardSub: { color: colors.textMuted, fontSize: 13, lineHeight: 18 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space(3),
    paddingTop: space(2),
  },
  toggleLabel: { color: colors.text, fontWeight: '600' },
  toggleHint: { color: colors.textMuted, fontSize: 12 },
  btn: { paddingVertical: space(3), borderRadius: radius.md, alignItems: 'center' },
  btnPrimary: { backgroundColor: colors.primary },
  btnSecondary: { backgroundColor: colors.bgElevated },
  btnDanger: { backgroundColor: colors.danger },
  btnText: { color: colors.text, fontWeight: '800' },
  confirmText: { color: colors.textMuted, fontSize: 13 },
  input: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.md,
    padding: space(3),
    color: colors.text,
  },
  confirmRow: { flexDirection: 'row', gap: space(2) },
});
